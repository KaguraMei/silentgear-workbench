# Silent Gear 汉化核对

核对日期：2026-10-16。只读取汉化补丁，不改动游戏文件。

补丁路径：`C:\sub_work\All the Mods 9-1.1.1_task_67047b34_汉化补丁_fix1_fix3 (1)`

扫描 8 个 JAR/ZIP；网页版本 3.6.7 与补丁 JAR 文件版本匹配。
材料名称命中 125/128，词条名称命中 69/70；本次改名 0 项。
新增/同步游戏原说明 68 项，长说明 1 项。

## 结论与优先级

现有网页译名已与补丁生效译名吻合。网页此前只显示源码解释，没有单独展示补丁原文。KubeJS 的 Silent Gear 语言文件比 JAR 多 71 个材料/词条语言键，重叠键译文一致；没有发现文件内重复键。现在保留原有 `description`，增加 `localizedDescription` / `localizedDescriptionLong`。数值、计算方法、适用条件不以汉化文案替换。

先读 JAR/ZIP 中的语言文件，再读 KubeJS 资源覆写；同一 JSON 内重复键取末次定义。`mods/assets` 解包目录只作为旁证，不参与覆盖。相同优先级的多包冲突按路径排序并在下方显式列出；此补丁不存在此类有效词条冲突。

`config/vaultpatcher_asm/silentgear.json` 属于硬编码字符串补丁，不含词条语言键；不把其中 Material/Part 的一般界面翻译当作词条译名。额外 allthemodium 语言键只归档，不新增本地未定义的材料。

## 来源

| 文件 | 匹配语言键 | 角色 | SHA-256 |
| --- | ---: | --- | --- |
| `mods/silent-gear-1.20.1-3.6.7.jar!assets/silentgear/lang/zh_cn.json` | 194 | 有效资源 | `7594b937b8437f3e0bce7d83ab8afb1642f2ce65fa95118eb9c62bd86ddbded4` |
| `mods/assets/silentgear/lang/zh_cn.json` | 194 | 解包旁证 | `7594b937b8437f3e0bce7d83ab8afb1642f2ce65fa95118eb9c62bd86ddbded4` |
| `kubejs/assets/allthemodium/lang/zh_cn.json` | 6 | 有效资源 | `91ec08896ff5f5ffd3e4dd3217528accd3ad872bfe2a528177378ffa71aa0646` |
| `kubejs/assets/silentgear/lang/zh_cn.json` | 265 | 有效资源 | `76296a71bd92a106a94138e1690738d71d7f701af0a1f5700f34e92cb3c33193` |

## 缺失键（保持现有显示）

- `material.silentgear.barrier` → 保留 `barrier`
- `material.silentgear.mixed_fabric` → 保留 `mixed_fabric`
- `material.silentgear.sheet_metal` → 保留 `sheet_metal`
- `trait.silentgear.nc_radiation_protection` → 保留 `nc_radiation_protection`

缺失词条原说明键：`trait.silentgear.nc_radiation_protection.desc`、`trait.silentgear.red_card.desc`。红牌升级物品另有 `item.silentgear.red_card_upgrade.desc`，但不冒充词条同名键。

68 个采用的原说明与 1 个长说明未出现 `%s`、`%d`、位置参数、`{数字}` 或 `§` 控制码；可直接显示。提取器始终保留字符串原文，未来出现参数化语言条目时需另行按真实上下文处理，不猜测替换值。

## 本次改名

无。已有名称与补丁有效值一致。

## 跨文件有效覆盖差异

无。Silent Gear JAR 与 KubeJS 对应键的有效值一致。

## 文件内重复定义

下表仅列值不同的重复键。旧值并非最终生效翻译；提取结果采用最后一行定义。

| 文件 | 键 | 较早值 | 最终覆盖值 |
| --- | --- | --- | --- |

没有发现相关语言键的重复定义。

## 每个词条的采用键

| ID | 网页采用译名 | 原说明键 | 来源 |
| --- | --- | --- | --- |
| `accelerate` | 加速 | `trait.silentgear.accelerate.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `adamant` | 坚硬 | `trait.silentgear.adamant.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `ancient` | 远古 | `trait.silentgear.ancient.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `aquatic` | 水栖 | `trait.silentgear.aquatic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `bastion` | 堡垒 | `trait.silentgear.bastion.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `bending` | 弯折 | `trait.silentgear.bending.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `bounce` | 反弹 | `trait.silentgear.bounce.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `brilliant` | 辉煌 | `trait.silentgear.brilliant.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `brittle` | 易碎 | `trait.silentgear.brittle.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `bulky` | 笨重 | `trait.silentgear.bulky.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `chilled` | 冰冻 | `trait.silentgear.chilled.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `chipping` | 剥落 | `trait.silentgear.chipping.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `confetti` | 五彩纸屑! | `trait.silentgear.confetti.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `crackler` | 烧石 | `trait.silentgear.crackler.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `crude` | 粗糙 | `trait.silentgear.crude.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `crushing` | 粉碎 | `trait.silentgear.crushing.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `cure_poison` | 解毒 | `trait.silentgear.cure_poison.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `cure_wither` | 唤生 | `trait.silentgear.cure_wither.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `cursed` | 诅咒 | `trait.silentgear.cursed.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `eroded` | 侵蚀 | `trait.silentgear.eroded.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `fiery` | 炽烈 | `trait.silentgear.fiery.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `fireproof` | 防火 | `trait.silentgear.fireproof.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `flame_ward` | 火焰保护 | `trait.silentgear.flame_ward.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `flammable` | 可燃 | `trait.silentgear.flammable.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `flexible` | 柔韧 | `trait.silentgear.flexible.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `floatstoner` | 浮石 | `trait.silentgear.floatstoner.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `gold_digger` | 掘金者 | `trait.silentgear.gold_digger.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `greedy` | 贪婪 | `trait.silentgear.greedy.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `hard` | 坚固 | `trait.silentgear.hard.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `heavy` | 沉重 | `trait.silentgear.heavy.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `holy` | 神圣 | `trait.silentgear.holy.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `ignite` | 点燃 | `trait.silentgear.ignite.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `imperial` | 帝国宝藏 | `trait.silentgear.imperial.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `indestructible` | 坚不可摧 | `trait.silentgear.indestructible.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `jabberwocky` | 无聊的话 | `trait.silentgear.jabberwocky.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `jagged` | 锯齿 | `trait.silentgear.jagged.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `kitty_vision` | 猫眼 | `trait.silentgear.kitty_vision.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `light` | 光辉 | `trait.silentgear.light.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `lucky` | 幸运 | `trait.silentgear.lucky.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `lustrous` | 光辉 | `trait.silentgear.lustrous.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `magmatic` | 熔岩 | `trait.silentgear.magmatic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `magnetic` | 磁力 | `trait.silentgear.magnetic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `malleable` | 韧性 | `trait.silentgear.malleable.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `mighty` | 超凡 | `trait.silentgear.mighty.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `moonwalker` | 月球行走 | `trait.silentgear.moonwalker.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `multi_break` | 多重破坏 | `trait.silentgear.multi_break.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `nc_radiation_protection` | nc_radiation_protection | 缺失，保留源码解释 | `未命中` |
| `organic` | 有机 | `trait.silentgear.organic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `racker` | 岩石 | `trait.silentgear.racker.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `reach` | 长臂 | `trait.silentgear.reach.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `red_card` | 红牌 | 缺失，保留源码解释 | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `refractive` | 折射 | `trait.silentgear.refractive.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `renew` | 复生 | `trait.silentgear.renew.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `road_maker` | 造路 | `trait.silentgear.road_maker.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `rustic` | 淳朴 | `trait.silentgear.rustic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `sharp` | 锋利 | `trait.silentgear.sharp.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `silky` | 丝滑 | `trait.silentgear.silky.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `snow_walker` | 雪地行者 | `trait.silentgear.snow_walker.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `soft` | 柔软 | `trait.silentgear.soft.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `spoon` | 勺子 | `trait.silentgear.spoon.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `stellar` | 恒星 | `trait.silentgear.stellar.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `sturdy` | 坚实 | `trait.silentgear.sturdy.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `swift_swim` | 速泳 | `trait.silentgear.swift_swim.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `synergistic` | 协同作用 | `trait.silentgear.synergistic.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `terminus` | 终端 | `trait.silentgear.terminus.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `turtle` | 龟息 | `trait.silentgear.turtle.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `venom` | 毒液 | `trait.silentgear.venom.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `void_ward` | 虚空庇佑 | `trait.silentgear.void_ward.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `vulcan` | 火匠 | `trait.silentgear.vulcan.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |
| `widen` | 拓宽 | `trait.silentgear.widen.desc` | `kubejs/assets/silentgear/lang/zh_cn.json` |

## 可重复执行

```powershell
py scripts/extract-translations.py --patch-root "C:\sub_work\All the Mods 9-1.1.1_task_67047b34_汉化补丁_fix1_fix3 (1)"
py prepare_data.py
```

首次扫描输出 `translations/silentgear.zh_cn.json`。之后 prepare_data.py 自动应用此快照，无需再次访问外部补丁路径。重新扫描会刷新来源摘要、网页文本与这份报告；不会改变公式字段。

说明原文可能简略或仍有误译（例如对游戏机制的宽泛表述）；页面同时展示源码解释供核对。原文中的英文、标点和版本措辞按补丁保留。
