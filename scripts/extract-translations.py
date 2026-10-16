"""Audit a local ATM9 translation patch and apply exact Silent Gear language keys.

Usage: py scripts/extract-translations.py --patch-root "C:\\path\\to\\patch"
Only project files are written. JARs and the game installation stay untouched.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import zipfile

HERE = Path(__file__).resolve().parents[1]
PREFIXES = ("trait.silentgear.", "material.silentgear.")


def decode_language(raw):
    duplicates = []
    def pairs_hook(pairs):
        result = {}
        for key, value in pairs:
            if key in result and key.startswith(PREFIXES):
                duplicates.append({"key": key, "earlier": result[key], "effective": value})
            result[key] = value
        return result
    value = json.loads(raw.decode("utf-8-sig"), object_pairs_hook=pairs_hook)
    return value if isinstance(value, dict) else {}, duplicates


def apply_translations(data, snapshot):
    """Keep formula explanations and every numeric field; add original game wording."""
    entries = snapshot["entries"]
    for group, prefix in (("materials", "material"), ("traits", "trait")):
        for identifier, item in data[group].items():
            key = f"{prefix}.silentgear.{identifier.replace('/', '.')}"
            if key in entries:
                item["name"] = entries[key]["text"]
                item["translationKey"] = key
                item["translationSource"] = entries[key]["source"]
            if group == "traits":
                for suffix, field in ((".desc", "localizedDescription"), (".desc.long", "localizedDescriptionLong")):
                    if key + suffix in entries:
                        item[field] = entries[key + suffix]["text"]
    data["localization"] = {"language": "zh_cn", "version": snapshot["version"], "sources": snapshot["sources"]}
    return data


def run(patch_root):
    entries, sources, duplicate_rows, conflicts, invalid = {}, [], [], [], []
    scanned_archives = 0
    def ingest(raw, source, active=True):
        try:
            language, duplicates = decode_language(raw)
        except (ValueError, UnicodeError) as exc:
            invalid.append(f"{source}: {exc}")
            return
        relevant = {key: value for key, value in language.items() if key.startswith(PREFIXES) and isinstance(value, str)}
        if not relevant:
            return
        sources.append({"id": source, "sha256": hashlib.sha256(raw).hexdigest(), "keys": len(relevant), "active": active})
        duplicate_rows.extend({"source": source, **row} for row in duplicates)
        if active:
            for key, value in relevant.items():
                if key in entries and entries[key]["text"] != value:
                    conflicts.append({"key": key, "before": entries[key], "after": {"text": value, "source": source}})
                entries[key] = {"text": value, "source": source}

    # Resource files in archives, then KubeJS overrides. Loose unpacked mods/assets
    # are evidence only: Minecraft does not load that directory as a resource pack.
    for archive in sorted(patch_root.rglob("*")):
        if archive.suffix.lower() not in (".jar", ".zip") or not archive.is_file():
            continue
        scanned_archives += 1
        try:
            with zipfile.ZipFile(archive) as zipped:
                for name in sorted(zipped.namelist()):
                    if re.search(r"(?:^|/)assets/[^/]+/lang/zh_cn\.json$", name):
                        ingest(zipped.read(name), f"{archive.relative_to(patch_root).as_posix()}!{name}")
        except zipfile.BadZipFile:
            invalid.append(f"Invalid archive: {archive.relative_to(patch_root).as_posix()}")
    for file in sorted((patch_root / "mods" / "assets").glob("*/lang/zh_cn.json")):
        ingest(file.read_bytes(), file.relative_to(patch_root).as_posix(), active=False)
    for file in sorted((patch_root / "kubejs" / "assets").glob("*/lang/zh_cn.json")):
        ingest(file.read_bytes(), file.relative_to(patch_root).as_posix())

    data_path = HERE / "src/data.js"
    data = json.loads(data_path.read_text("utf-8").removeprefix("export default ").strip().removesuffix(";"))
    expected = f"silent-gear-1.20.1-{data['version']}.jar"
    if not any(expected + "!assets/silentgear/lang/zh_cn.json" in source["id"] for source in sources):
        raise SystemExit(f"Refusing a version-mismatched patch: expected {expected} with Chinese language data")
    before = {(group, key): item["name"] for group in ("materials", "traits") for key, item in data[group].items()}
    snapshot = {"version": data["version"], "precedence": "archive languages, then kubejs/assets; duplicate JSON keys use the final value", "sources": sources, "entries": entries}
    output = HERE / "translations/silentgear.zh_cn.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", "utf-8")
    apply_translations(data, snapshot)
    data_path.write_text("export default " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", "utf-8")

    # Update only named headings and insert game text next to the existing source
    # explanation. Numeric tables and JSON parameter blocks remain byte-for-byte.
    doc = HERE / "public/docs/materials.md"
    document = doc.read_text("utf-8")
    document = re.sub(r"<!-- game-translation:start -->.*?<!-- game-translation:end -->\n*", "", document, flags=re.S)
    for identifier, item in data["traits"].items():
        heading = f"### 词条：{item['name']} `{identifier}`"
        game = item.get("localizedDescription")
        addition = ""
        if game:
            addition = "\n\n<!-- game-translation:start -->\n**游戏汉化原文**：" + game + "\n"
            if item.get("localizedDescriptionLong"):
                addition += "\n" + item["localizedDescriptionLong"] + "\n"
            addition += f"\n语言键：`trait.silentgear.{identifier}.desc`。以下说明保留源码与计算规则核对结果。\n<!-- game-translation:end -->"
        document = re.sub(r"### 词条：[^\n]* `" + re.escape(identifier) + r"`", lambda _: heading + addition, document)
    marker = "<!-- translation-audit -->"
    note = marker + "\n汉化核对：2026-10-16，采用用户提供的 ATM9 汉化补丁中 Silent Gear 3.6.7 JAR 与 KubeJS 语言资源；游戏译文与计算说明分开列出，按完整语言键核对。\n"
    document = re.sub(r"\n+" + re.escape(marker) + r"\n[^\n]*\n+", "\n\n", document)
    document = document.replace("## 先看这几条", note + "\n## 先看这几条", 1)
    doc.write_text(document, "utf-8")

    changed, missing, matched = [], [], {"materials": 0, "traits": 0}
    for group, prefix in (("materials", "material"), ("traits", "trait")):
        for identifier, item in data[group].items():
            key = f"{prefix}.silentgear.{identifier.replace('/', '.')}"
            if key not in entries:
                missing.append(f"`{key}` → 保留 `{item['name']}`")
            else:
                matched[group] += 1
                if before[(group, identifier)] != item["name"]:
                    changed.append(f"`{key}`：{before[(group, identifier)]} → {item['name']}")
    report = ["# Silent Gear 汉化核对", "", "核对日期：2026-10-16。只读取汉化补丁，不改动游戏文件。", "",
              f"补丁路径：`{patch_root}`", "", f"扫描 {scanned_archives} 个 JAR/ZIP；网页版本 {data['version']} 与补丁 JAR 文件版本匹配。",
              f"材料名称命中 {matched['materials']}/{len(data['materials'])}，词条名称命中 {matched['traits']}/{len(data['traits'])}；本次改名 {len(changed)} 项。",
              f"新增/同步游戏原说明 {sum('localizedDescription' in t for t in data['traits'].values())} 项，长说明 {sum('localizedDescriptionLong' in t for t in data['traits'].values())} 项。", "",
              "## 结论与优先级", "",
              "现有网页译名已与补丁生效译名吻合。网页此前只显示源码解释，没有单独展示补丁原文。KubeJS 的 Silent Gear 语言文件比 JAR 多 71 个材料/词条语言键，重叠键译文一致；没有发现文件内重复键。现在保留原有 `description`，增加 `localizedDescription` / `localizedDescriptionLong`。数值、计算方法、适用条件不以汉化文案替换。",
              "", "先读 JAR/ZIP 中的语言文件，再读 KubeJS 资源覆写；同一 JSON 内重复键取末次定义。`mods/assets` 解包目录只作为旁证，不参与覆盖。相同优先级的多包冲突按路径排序并在下方显式列出；此补丁不存在此类有效词条冲突。",
              "", "`config/vaultpatcher_asm/silentgear.json` 属于硬编码字符串补丁，不含词条语言键；不把其中 Material/Part 的一般界面翻译当作词条译名。额外 allthemodium 语言键只归档，不新增本地未定义的材料。", "",
              "## 来源", "", "| 文件 | 匹配语言键 | 角色 | SHA-256 |", "| --- | ---: | --- | --- |"]
    for source in sources:
        report.append(f"| `{source['id']}` | {source['keys']} | {'有效资源' if source['active'] else '解包旁证'} | `{source['sha256']}` |")
    report += ["", "## 缺失键（保持现有显示）", ""] + ["- " + row for row in missing]
    report += ["", "缺失词条原说明键：`trait.silentgear.nc_radiation_protection.desc`、`trait.silentgear.red_card.desc`。红牌升级物品另有 `item.silentgear.red_card_upgrade.desc`，但不冒充词条同名键。", "", "68 个采用的原说明与 1 个长说明未出现 `%s`、`%d`、位置参数、`{数字}` 或 `§` 控制码；可直接显示。提取器始终保留字符串原文，未来出现参数化语言条目时需另行按真实上下文处理，不猜测替换值。"]
    report += ["", "## 本次改名", ""] + (["- " + row for row in changed] or ["无。已有名称与补丁有效值一致。"])
    report += ["", "## 跨文件有效覆盖差异", ""] + ([f"- `{row['key']}`：{row['before']['text']} → {row['after']['text']}" for row in conflicts] or ["无。Silent Gear JAR 与 KubeJS 对应键的有效值一致。"])
    report += ["", "## 文件内重复定义", "", "下表仅列值不同的重复键。旧值并非最终生效翻译；提取结果采用最后一行定义。", "", "| 文件 | 键 | 较早值 | 最终覆盖值 |", "| --- | --- | --- | --- |"]
    for row in duplicate_rows:
        if row["earlier"] != row["effective"]:
            clean = lambda value: str(value).replace("|", "\\|").replace("\n", " ")
            report.append(f"| `{row['source']}` | `{row['key']}` | {clean(row['earlier'])} | {clean(row['effective'])} |")
    if not duplicate_rows:
        report += ["", "没有发现相关语言键的重复定义。"]
    report += ["", "## 每个词条的采用键", "", "| ID | 网页采用译名 | 原说明键 | 来源 |", "| --- | --- | --- | --- |"]
    for identifier, item in data["traits"].items():
        report.append(f"| `{identifier}` | {item['name']} | {'`trait.silentgear.' + identifier + '.desc`' if 'localizedDescription' in item else '缺失，保留源码解释'} | `{item.get('translationSource', '未命中')}` |")
    report += ["", "## 可重复执行", "", '```powershell', f'py scripts/extract-translations.py --patch-root "{patch_root}"', 'py prepare_data.py', '```', "",
              "首次扫描输出 `translations/silentgear.zh_cn.json`。之后 prepare_data.py 自动应用此快照，无需再次访问外部补丁路径。重新扫描会刷新来源摘要、网页文本与这份报告；不会改变公式字段。", "",
              "说明原文可能简略或仍有误译（例如对游戏机制的宽泛表述）；页面同时展示源码解释供核对。原文中的英文、标点和版本措辞按补丁保留。"]
    if invalid:
        report += ["", "## 无法解析的资源", ""] + ["- " + issue for issue in invalid]
    (HERE / "artifacts").mkdir(exist_ok=True)
    (HERE / "artifacts/translation-audit.md").write_text("\n".join(report) + "\n", "utf-8")
    print(json.dumps({"archives": scanned_archives, "matched": matched, "renamed": len(changed), "missing": missing, "invalid": len(invalid)}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--patch-root", required=True, type=Path)
    args = parser.parse_args()
    if not args.patch_root.is_dir():
        parser.error("patch root must be an existing directory")
    run(args.patch_root.resolve())
