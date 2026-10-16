#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ttf_to_web.py
批量把 TTF 字体转换成适合 Web 使用的 WOFF2（以及可选 WOFF），
并支持按需子集化（只保留实际用到的字符），大幅减小体积后再传 OSS。

依赖：
    pip install fonttools brotli --break-system-packages

用法示例：
    # 1) 最简单：把 fonts/ 目录下所有 ttf 转成 woff2，输出到 dist/
    python ttf_to_web.py -i fonts -o dist

    # 2) 同时生成 woff（兼容极老浏览器，可选，一般现在可以不要）
    python ttf_to_web.py -i fonts -o dist --woff

    # 3) 子集化：只保留页面里实际用到的字符（强烈推荐，尤其中文字体）
    #    --text 可以直接给字符串，也可以给 --text-file 指向一个包含所有用到文案的文本文件
    python ttf_to_web.py -i fonts -o dist --subset --text-file used_text.txt

    # 4) 只保留常用汉字 + 数字 + 英文 + 常见标点（没有明确文案时的保守方案）
    python ttf_to_web.py -i fonts -o dist --subset --common-cjk
"""

import argparse
import os
import sys
from pathlib import Path

from fontTools import subset as ft_subset
from fontTools.ttLib import TTFont


# GB2312 一级 + 二级常用汉字范围（覆盖绝大部分现代文案），做“没有明确文案”时的兜底子集
COMMON_CJK_RANGES = [
    (0x4E00, 0x9FFF),   # CJK统一表意文字（基本区，覆盖常用简体/繁体汉字）
    (0x3000, 0x303F),   # CJK标点符号
    (0xFF00, 0xFFEF),   # 全角字符、全角标点
]


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}TB"


def build_common_cjk_text() -> str:
    chars = []
    for start, end in COMMON_CJK_RANGES:
        chars.extend(chr(c) for c in range(start, end + 1))
    # 补上 ASCII 可见字符（英文、数字、常见标点）
    chars.extend(chr(c) for c in range(0x20, 0x7F))
    return "".join(chars)


def convert_one(
    src: Path,
    out_dir: Path,
    make_woff2: bool,
    make_woff: bool,
    subset_text: str | None,
):
    src_size = src.stat().st_size
    stem = src.stem

    if subset_text:
        # ---- 子集化路径：用 fontTools.subset 先裁剪，再分别导出 woff2 / woff ----
        for fmt, ext in (("woff2", ".woff2"), ("woff", ".woff")):
            if fmt == "woff2" and not make_woff2:
                continue
            if fmt == "woff" and not make_woff:
                continue

            font = TTFont(str(src))
            subsetter = ft_subset.Subsetter()
            subsetter.populate(text=subset_text)
            subsetter.subset(font)

            font.flavor = fmt  # 'woff2' 或 'woff'
            out_path = out_dir / f"{stem}{ext}"
            font.save(str(out_path))
            font.close()

            out_size = out_path.stat().st_size
            print(
                f"  [子集+{fmt}] {out_path.name:30s} "
                f"{human_size(src_size):>8s} -> {human_size(out_size):>8s} "
                f"(-{(1 - out_size / src_size) * 100:.1f}%)"
            )
    else:
        # ---- 不子集化：仅做格式转换 + 压缩 ----
        for fmt, ext, flag in (("woff2", ".woff2", make_woff2), ("woff", ".woff", make_woff)):
            if not flag:
                continue
            font = TTFont(str(src))
            font.flavor = fmt
            out_path = out_dir / f"{stem}{ext}"
            font.save(str(out_path))
            font.close()

            out_size = out_path.stat().st_size
            print(
                f"  [{fmt}]      {out_path.name:30s} "
                f"{human_size(src_size):>8s} -> {human_size(out_size):>8s} "
                f"(-{(1 - out_size / src_size) * 100:.1f}%)"
            )


def main():
    parser = argparse.ArgumentParser(description="批量将 TTF 转换为 Web 字体格式 (WOFF2/WOFF)")
    parser.add_argument("-i", "--input", required=True, help="输入目录或单个 .ttf 文件")
    parser.add_argument("-o", "--output", required=True, help="输出目录")
    parser.add_argument("--woff", action="store_true", help="同时生成 .woff（默认只生成 .woff2）")
    parser.add_argument("--no-woff2", action="store_true", help="不生成 .woff2（配合 --woff 单独使用较少见）")
    parser.add_argument("--subset", action="store_true", help="开启子集化，只保留用到的字符")
    parser.add_argument("--text", type=str, default=None, help="子集化：直接传入用到的文字（字符串）")
    parser.add_argument("--text-file", type=str, default=None, help="子集化：从文本文件读取用到的文字")
    parser.add_argument(
        "--common-cjk",
        action="store_true",
        help="子集化兜底方案：保留常用汉字+ASCII，没有明确文案时使用（效果不如精确子集化）",
    )
    args = parser.parse_args()

    in_path = Path(args.input)
    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)

    make_woff2 = not args.no_woff2
    make_woff = args.woff

    subset_text = None
    if args.subset:
        if args.text:
            subset_text = args.text
        elif args.text_file:
            subset_text = Path(args.text_file).read_text(encoding="utf-8")
        elif args.common_cjk:
            subset_text = build_common_cjk_text()
        else:
            print("错误：开启了 --subset 但没有提供字符来源，请使用 --text / --text-file / --common-cjk 之一", file=sys.stderr)
            sys.exit(1)

    if in_path.is_file():
        ttf_files = [in_path]
    else:
        ttf_files = sorted(in_path.rglob("*.ttf")) + sorted(in_path.rglob("*.TTF"))

    if not ttf_files:
        print(f"在 {in_path} 下没有找到 .ttf 文件")
        sys.exit(1)

    print(f"共发现 {len(ttf_files)} 个 TTF 文件，开始转换...\n")

    total_src = 0
    total_out2 = 0

    for f in ttf_files:
        print(f"{f.name}")
        total_src += f.stat().st_size
        convert_one(f, out_dir, make_woff2, make_woff, subset_text)

    # 汇总 woff2 总体积对比（最常用的场景）
    for f in ttf_files:
        p = out_dir / f"{f.stem}.woff2"
        if p.exists():
            total_out2 += p.stat().st_size

    print("\n----- 汇总 -----")
    print(f"原始 TTF 总体积  : {human_size(total_src)}")
    if make_woff2:
        print(f"WOFF2  总体积    : {human_size(total_out2)} (-{(1 - total_out2 / total_src) * 100:.1f}%)")
    print(f"输出目录: {out_dir.resolve()}")
    print("\n接下来把输出目录里的文件传到 OSS 即可，CSS 里用 @font-face 引用，例如：")
    print(
        """
@font-face {
  font-family: "MyFont";
  src: url("https://your-oss-domain/fonts/MyFont.woff2") format("woff2");
  font-display: swap; /* 避免字体加载期间文字不可见 */
}
"""
    )


if __name__ == "__main__":
    main()