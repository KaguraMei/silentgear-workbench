# Silent Gear 材料属性表与词条说明（ATM9 本地扫描）

扫描日期：2026-10-14。对象：Minecraft 1.20.1，Silent Gear **3.6.7**；名称是 Silent Gear（寂静装备），不是 Silence Gear。

本文件完整收录本地 **128 个材料定义、70 个词条定义**，并解析木材、石材、羊毛、陶瓦的父材料继承。数值来自安装包，不套用新版或其他整合包的数据。另一份文档见 [高伤害武器与防具](2026-10-14_ATM9_高伤害武器与防具.md)。

## 先看这几条

- **材料值不是成品面板值**。主体、部件模板、手柄、尖端、握把、涂层、材料品级和协同共同决定装备属性。
- 下界合金在这份材料数据里只有**涂层**用途，不能按原版“下界合金剑”理解为SG主体。
- 435 个模组JAR及 `kubejs/data` 中未发现 allthemodium、vibranium、unobtainium 的 SG 材料定义；它们自己的武器防具属于另一条装备路线。
- 精炼黑曜石主体的基础近战值10、护甲总值30，高于泰瑞安钢的8、25；泰瑞安钢仍有更高耐久和虚空保护等用途。
- 两个隐藏定义是 `barrier`、`example`；三个动态复合材料是 `metal_alloy`、`hybrid_gem`、`mixed_fabric`。`sheet_metal` 是依赖输入材料的加工材料，不能给它一个固定成品数值。
- 目录下没有 `saves`，因此未核对具体世界或远程服务器的数据包与服务器配置。标签候选物品只是静态证据；有定义不保证当前存档能合成，实际配方以JEI和服务器为准。

## 如何读属性与部件

`—` 表示这个材料未显式定义此项或不适用，**不是0**；默认值、父材料与装备类型仍可能参与计算。总表显示已继承的JSON基础数值，不预先代入品级、星光、协同、词条和附魔。

数值操作按单次统计计算依次为：基础值及 `avg`（加权平均）→ `max`（取较大值）→ `mul1`（倍率相加）→ `mul2`（倍率逐项相乘）→ `add`（最后直接相加）。例如 `mul2 0.3` 是×1.3，`mul2 -0.2` 是×0.8；`add 2` 是+2。材料阶段与成品阶段各有计算，不能把所有JSON字段不分层地塞进一个公式。

带 `/axe`、`/hoe`、`/helmet` 等后缀的条目只作用于指定装备类型；例如 `attack_speed/axe` 不是所有武器通用。材料阶级 `tier` 主要用于材料体系与协同；采掘能力则看 `harvest_tier`，二者不同。

| 字段 | 中文含义 | 解释 |
| --- | --- | --- |
| durability | 工具耐久 | 工具、武器的基础耐久；为0的材料一般不能制作工具主体。 |
| armor_durability | 护甲耐久系数 | 不是单件耐久点数。常规头／胸／腿／靴分别乘11／16／15／13；鞘翅另有规则。 |
| armor | 护甲值 | 主体总值供材料比较；成品优先使用 armor/helmet、chestplate、leggings、boots 的槽位值。 |
| armor_toughness | 盔甲韧性 | 降低大额物理伤害对护甲效果的削弱。材料中通常是整套值，单件计算除以4。 |
| magic_armor | 魔法防御 | 通常按四件均分。只对代码识别的 minecraft:magic 伤害减伤：全身合计M≤20时为3%×M，超过20时为60%+1.5%×(M−20)。不覆盖所有模组法术或魔法类伤害。 |
| melee_damage | 近战伤害 | 材料基础贡献，不是成品伤害。还要计算武器部件、手柄、尖端、涂层、品级、协同与角色基础攻击。 |
| magic_damage | 魔法伤害 | 隐藏统计字段；不能直接加到普通近战伤害上，也不等于 Iron’s Spells 的法术强度。 |
| attack_speed | 攻击速度修正 | 材料或部件对攻击速度的增减；角色默认4次/秒，再加武器修正。剑刃本身为−2.4。 |
| attack_reach | 攻击距离 | 攻击距离相关统计；不要与方块交互距离混用，具体装备是否使用该统计取决于实现。 |
| reach_distance | 方块触及距离 | 方块交互距离增量；Reach词条增加此类能力，不代表近战距离同幅增加。 |
| harvest_speed | 采掘速度 | 适用方块上的基础破坏速度；不提高挖掘等级，也不是每秒方块数。 |
| harvest_level | 旧版采掘等级 | 旧兼容字段；本批材料使用 harvest_tier 标识采掘能力。 |
| enchantment_value | 附魔能力 | 影响附魔台随机附魔质量；不是最终附魔等级上限或额外附魔槽位数。 |
| ranged_damage | 远程伤害 | 用于弓、弩、弹弓等的伤害统计；箭速、弹药与武器实现也影响命中伤害，不能直接当成扣血量。 |
| ranged_speed | 远程速度 | 用于拉弓／装填速度的材料贡献；主体与弓弦等的最终组合决定手感，不是固定箭速。 |
| projectile_speed | 弹射物速度 | 影响射出弹射物的速度；更快通常更平直，命中伤害仍取决于弹射物规则。 |
| projectile_accuracy | 弹射物精度 | 精度统计，越高通常越准确；1表示基准，不是100%必中的保证。 |
| charging_value | 星光充能适性 | 影响星光充能对材料的强化效果；不是FE电量，也不表示装备持续消耗电力。 |
| rarity | 稀有度 | 模组内部稀有度评分；不是掉落率、幸运值或直接战斗增伤。 |
| repair_efficiency | 修理效率 | 装备修复消耗材料的效率因素；还受修理包等级和修理方式影响。 |
| repair_value | 修理加成 | 材料修复能力的加成字段；不能单独当成一次修复的耐久点数。 |
| knockback_resistance | 击退抗性 | SG装备将此统计除以10后写入原版击退抗性属性；涂层的+1相当于单件+0.1。 |

| 部件键 | 中文 | 主要用途 |
| --- | --- | --- |
| main | 主体 | 剑刃、工具头、护甲板等主体；决定主要基础数值。 |
| rod | 手柄／杆 | 工具或武器的柄／杆，提供独立修正与词条。 |
| tip | 尖端 | 尖端升级；必须是接受此升级的装备。 |
| coating | 涂层 | 涂层升级，如下界合金。 |
| grip | 握把 | 手柄外的握把，可增攻速等。 |
| lining | 衬里 | 防具衬里，常用于舒适性和词条。 |
| binding | 绑定 | 绑定部件，不等于弓弦。 |
| cord | 弓弦 | 弓弦材料槽。 |
| fletching | 箭羽 | 箭羽部件。 |
| adornment | 饰物 | 戒指、手镯等饰物用材料槽。 |

## 材料主体属性总表

头／胸／腿／靴按此顺序列出。韧性是**材料整套基数**，单件通常为该数值÷4；护甲耐久是系数。以下列出所有具有主体槽的固定材料，包含颜色／木材变体；动态材料另见完整明细。

| 材料（ID后缀） | 阶级 | 工具耐久 | 近战 | 攻速修正 | 采掘速度 | 护甲总值 | 头/胸/腿/靴 | 韧性总值 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 铝 `aluminum` | 2 | 365 | 2 | 0.2 | 8 | 14 | 2/6/4/2 | 0.5 |
| 铝钢 `aluminum_steel` | 3 | 660 | 4 | 0.1 | 8 | 18 | 3/7/5/3 | 2 |
| 紫晶 `amethyst` | 2 | 210 | 1 | 0 | 6 | 15 | 3/5/4/3 | — |
| 蔚蓝琥珀金 `azure_electrum` | 4 | 1259 | 7 | 0 | 29 | 19 | 3/7/6/3 | 8 |
| 蔚蓝银 `azure_silver` | 3 | 197 | 5 | 0 | 19 | 13 | 2/5/4/2 | — |
| 玄武岩 `basalt` | 1 | 137 | 1 | 0 | 4 | 6 | 1/3/1/1 | — |
| 铋 `bismuth` | 2 | 330 | 2.5 | 0.1 | 5 | 16 | 3/6/5/2 | 2 |
| 铋黄铜 `bismuth_brass` | 2 | 580 | 3 | 0.1 | 9 | 18 | 3/7/5/3 | 2 |
| 铋钢 `bismuth_steel` | 3 | 1050 | 4 | -0.1 | 10 | 20 | 3/8/6/3 | 4 |
| 黑石 `blackstone` | 1 | 151 | 1 | 0 | 4 | 5 | 1/2/1/1 | — |
| 烈焰金 `blaze_gold` | 3 | 69 | 2 | 0.1 | 15 | 13 | 2/5/4/2 | 1 |
| 骨 `bone` | 1 | 108 | 2 | 0.1 | 4 | 5 | 1/2/1/1 | — |
| 黄铜 `brass` | 2 | 240 | 1.5 | 0.1 | 7 | 14 | 2/6/4/2 | 1 |
| 青铜 `bronze` | 2 | 300 | 2.5 | 0.2 | 6 | 15 | 3/6/4/2 | 1 |
| 致密铁 `compressed_iron` | 3 | 1024 | 4 | -0.2 | 9 | 20 | 3/8/6/3 | 2 |
| 铜 `copper` | 2 | 151 | 1.5 | 0.1 | 5 | 10 | 2/4/3/1 | — |
| 深红铁 `crimson_iron` | 3 | 420 | 3 | -0.1 | 10 | 18 | 3/7/5/3 | 2 |
| 深红钢 `crimson_steel` | 4 | 2400 | 6 | -0.1 | 15 | 22 | 4/8/6/4 | 10 |
| 钻石 `diamond` | 3 | 1561 | 3 | 0 | 8 | 20 | 3/8/6/3 | 8 |
| 琥珀金 `electrum` | 2 | 96 | 2 | 0.3 | 14 | 15 | 2/6/5/2 | — |
| 绿宝石 `emerald` | 3 | 1080 | 2 | 0 | 10 | 16 | 3/6/4/3 | 4 |
| 末地石 `end_stone` | 1 | 1164 | 2 | 0.1 | 7 | 15 | 3/5/4/3 | 1 |
| 末影 `enderium` | 4 | 1200 | 6 | 0 | 18 | 22 | 3/9/7/3 | 8 |
| 细丝织布 `fine_silk_cloth` | 2 | 0 | — | — | — | 6 | 1/2/2/1 | — |
| 燧石 `flint` | 1 | 124 | 2 | -0.1 | 5 | 4 | 0.5/2/1/0.5 | — |
| 金 `gold` | 2 | 32 | 0 | 0 | 12 | 11 | 2/5/3/1 | — |
| 殷钢 `invar` | 2 | 640 | 3.5 | 0 | 7 | 18 | 2/8/6/2 | 2 |
| 铁 `iron` | 2 | 250 | 2 | 0 | 6 | 15 | 2/6/5/2 | — |
| 青金石 `lapis_lazuli` | 2 | 200 | 2 | 0 | 5 | 15 | 2/6/5/2 | — |
| 铅 `lead` | 2 | 260 | 2 | -0.4 | 4 | 13 | 2/5/4/2 | — |
| 皮革 `leather` | 0 | 0 | — | — | — | 7 | 1/3/2/1 | — |
| 流明 `lumium` | 3 | 920 | 4 | 0.2 | 15 | 18 | 2/8/6/2 | 4 |
| 下界岩 `netherrack` | 1 | 142 | 0.5 | 0 | 5 | 8 | 1/4/2/1 | — |
| 下界木 `netherwood` | 0 | 72 | 0 | 0.2 | 2 | 8 | 1/4/2/1 | — |
| 镍 `nickel` | 2 | 380 | 2.5 | 0.1 | 7 | 13 | 2/5/4/2 | — |
| 黑曜石 `obsidian` | 3 | 3072 | 3 | -0.4 | 6 | 20 | 3/8/6/3 | 4 |
| 锇 `osmium` | 2 | 500 | 4 | 0.1 | 10 | 17 | 3/6/5/3 | — |
| 幻翼膜 `phantom_membrane` | 2 | 0 | — | — | — | 6 | 1/2/2/1 | — |
| 铂 `platinum` | 3 | 900 | 4 | 0 | 12 | 18 | 2/8/6/2 | 2 |
| 石英 `quartz` | 2 | 330 | 2 | 0.1 | 7 | 14 | 3/5/4/2 | — |
| 红石合金 `redstone_alloy` | 2 | 840 | 2 | 0.2 | 11 | 17 | 3/7/5/2 | 1 |
| 强化荧石 `refined_glowstone` | 3 | 300 | 5 | 0 | 14 | 19 | 3/7/6/3 | — |
| 精炼铁 `refined_iron` | 2 | 512 | 3 | 0 | 7 | 18 | 3/7/5/3 | 2 |
| 强化黑曜石 `refined_obsidian` | 4 | 2500 | 10 | 0.3 | 20 | 30 | 5/12/8/5 | 16 |
| 红砂岩 `sandstone/red` | 1 | 117 | 1 | 0.1 | 4 | 5 | 1/2/1/1 | — |
| 砂岩 `sandstone` | 1 | 117 | 1 | 0.1 | 4 | 5 | 1/2/1/1 | — |
| 信素 `signalum` | 4 | 800 | 3 | 0 | 13 | 16 | 2/7/5/2 | 2 |
| 银 `silver` | 2 | 64 | 0 | 0.2 | 11 | 11 | 2/5/3/1 | — |
| 钢 `steel` | 2 | 500 | 4 | -0.2 | 6 | 20 | 3/8/6/3 | 2 |
| 安山岩 `stone/andesite` | 1 | 131 | 1 | 0 | 4 | 5 | 1/2/1/1 | — |
| 闪长岩 `stone/diorite` | 1 | 131 | 1 | 0 | 4 | 5 | 1/2/1/1 | — |
| 花岗岩 `stone/granite` | 1 | 131 | 1 | 0 | 4 | 5 | 1/2/1/1 | — |
| 石头 `stone` | 1 | 131 | 1 | 0 | 4 | 5 | 1/2/1/1 | — |
| 黑色陶瓦 `terracotta/black` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 蓝色陶瓦 `terracotta/blue` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 棕色陶瓦 `terracotta/brown` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 青色陶瓦 `terracotta/cyan` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 灰色陶瓦 `terracotta/gray` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 绿色陶瓦 `terracotta/green` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 淡蓝色陶瓦 `terracotta/light_blue` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 淡灰色陶瓦 `terracotta/light_gray` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 黄绿色陶瓦 `terracotta/lime` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 品红色陶瓦 `terracotta/magenta` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 橙色陶瓦 `terracotta/orange` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 粉色陶瓦 `terracotta/pink` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 紫色陶瓦 `terracotta/purple` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 红色陶瓦 `terracotta/red` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 白色陶瓦 `terracotta/white` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 黄色陶瓦 `terracotta/yellow` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 陶瓦 `terracotta` | 1 | 165 | 1.5 | 0.2 | 4 | 9 | 2/3/3/1 | — |
| 锡 `tin` | 1 | 192 | 1.5 | 0 | 5 | 12 | 2/5/3/2 | — |
| 钛 `titanium` | 4 | 1600 | 6 | 0 | 8 | 24 | 4/9/7/4 | 8 |
| 海龟壳 `turtle` | 2 | 0 | — | — | — | — | 2/—/—/— | — |
| 提尔钢 `tyrian_steel` | 4 | 3652 | 8 | 0 | 18 | 25 | 5/9/7/4 | 12 |
| 铀 `uranium` | 3 | 800 | 2 | 0.1 | 6 | 13 | 2/5/4/2 | 1 |
| 金合欢木 `wood/acacia` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 白桦木 `wood/birch` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 深红木 `wood/crimson` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 深色橡木 `wood/dark_oak` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 从林木 `wood/jungle` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 橡木 `wood/oak` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 云杉木 `wood/spruce` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 弯木 `wood/warped` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 木材 `wood` | 0 | 59 | 0 | 0 | 2 | 7 | 1/3/2/1 | — |
| 黑色羊毛 `wool/black` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 蓝色羊毛 `wool/blue` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 棕色羊毛 `wool/brown` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 青色羊毛 `wool/cyan` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 灰色羊毛 `wool/gray` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 绿色羊毛 `wool/green` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 淡蓝色羊毛 `wool/light_blue` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 淡灰色羊毛 `wool/light_gray` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 黄绿色羊毛 `wool/lime` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 品红色羊毛 `wool/magenta` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 橙色羊毛 `wool/orange` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 粉色羊毛 `wool/pink` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 紫色羊毛 `wool/purple` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 红色羊毛 `wool/red` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 白色羊毛 `wool/white` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 黄色羊毛 `wool/yellow` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 羊毛 `wool` | 0 | 0 | — | — | — | 4 | 0.5/2/1/0.5 | — |
| 锌 `zinc` | 1 | 192 | 1.5 | 0 | 3 | 10 | 1/5/3/1 | — |

### 主体远程、附魔与耐久补充

| 材料ID后缀 | 护甲耐久系数 | 远程伤害 | 远程速度 | 弹速 | 精度 | 附魔能力 | 充能适性 | 采掘层级 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aluminum | 15 | 2 | 0.2 | — | — | 14 | 0.9 | minecraft:iron |
| aluminum_steel | 18 | 2 | 0 | — | — | 11 | 1 | minecraft:diamond |
| amethyst | 10 | 1 | 0 | 1 | 1 | 16 | 1.3 | minecraft:iron |
| azure_electrum | 61 | 3 | 0 | 2 | 1.5 | 37 | 1.5 | minecraft:netherite |
| azure_silver | 17 | 2 | 0 | 1.2 | 1.1 | 29 | 1.4 | minecraft:diamond |
| basalt | 4 | 0 | -0.1 | 1 | 0.8 | 6 | 0.7 | minecraft:stone |
| bismuth | 10 | 1 | 0 | — | — | 12 | 0.9 | minecraft:iron |
| bismuth_brass | 15 | 2 | 0.2 | — | — | 14 | 1.1 | minecraft:iron |
| bismuth_steel | 25 | 3 | 0.1 | — | — | 14 | 1 | minecraft:diamond |
| blackstone | 5 | 0 | -0.2 | 1 | 0.8 | 4 | 0.6 | minecraft:stone |
| blaze_gold | 9 | 1 | 0.2 | 1.2 | 0.9 | 24 | 1.2 | minecraft:iron |
| bone | 4 | 1 | 0 | 0.9 | 1 | 5 | 0.9 | minecraft:stone |
| brass | 8 | 2 | 0.2 | — | — | 13 | 1.2 | minecraft:iron |
| bronze | 13 | 2 | -0.2 | — | — | 12 | 1.1 | minecraft:iron |
| compressed_iron | 24 | 3 | 0 | — | — | 12 | 0.8 | minecraft:diamond |
| copper | 12 | 0.1 | 0 | — | — | 15 | 1.3 | minecraft:stone |
| crimson_iron | 27 | 2 | -0.1 | 1 | 1.1 | 14 | 0.7 | minecraft:diamond |
| crimson_steel | 42 | 3 | -0.1 | 1 | 1.3 | 19 | 0.9 | minecraft:netherite |
| diamond | 33 | 2 | -0.2 | 0.9 | 1.1 | 10 | 0.8 | minecraft:diamond |
| electrum | 10 | 1 | 0.4 | — | — | 25 | 1.5 | minecraft:iron |
| emerald | 24 | 1 | -0.1 | 1.1 | 0.9 | 16 | 1 | minecraft:iron |
| end_stone | 15 | 0 | 0 | 1 | 0.8 | 10 | 0.9 | minecraft:iron |
| enderium | 34 | 3 | 0 | — | — | 13 | 1.2 | minecraft:netherite |
| fine_silk_cloth | 14 | — | — | — | — | 14 | 0.9 | minecraft:wood |
| flint | 4 | 1 | -0.3 | 1 | 1 | 3 | 0.8 | minecraft:stone |
| gold | 7 | 0 | 0.3 | 1.1 | 1 | 22 | 1.2 | minecraft:gold |
| invar | 20 | 2 | 0 | — | — | 13 | 1.2 | minecraft:iron |
| iron | 15 | 1 | 0.1 | 1 | 1.1 | 14 | 0.7 | minecraft:iron |
| lapis_lazuli | 13 | 0 | -0.1 | 1 | 0.8 | 17 | 1.3 | minecraft:iron |
| lead | 14 | 1 | -0.3 | — | — | 15 | 0.8 | minecraft:iron |
| leather | 5 | — | — | — | — | 15 | 0.8 | minecraft:wood |
| lumium | 20 | 2 | 0 | — | — | 14 | 1.3 | minecraft:diamond |
| netherrack | 5 | 0.5 | 0.1 | 0.8 | 1 | 8 | 0.8 | minecraft:stone |
| netherwood | 12 | 0 | 0 | 1 | 0.8 | 13 | 0.7 | minecraft:wood |
| nickel | 17 | 0.5 | 0.1 | — | — | 12 | 1 | minecraft:iron |
| obsidian | 37 | 0 | -0.4 | 0.7 | 0.7 | 7 | 0.6 | minecraft:diamond |
| osmium | 30 | 1 | 0 | — | — | 12 | 1.1 | minecraft:iron |
| phantom_membrane | 12 | — | — | — | — | 10 | 0.7 | minecraft:wood |
| platinum | 21 | 1 | 0 | — | — | 14 | 1.2 | minecraft:diamond |
| quartz | 13 | 0 | 0.1 | 1 | 1 | 10 | 1.2 | minecraft:iron |
| redstone_alloy | 20 | 1 | 0.2 | — | — | 18 | 0.9 | minecraft:iron |
| refined_glowstone | 18 | 3 | 0 | — | — | 18 | 0.8 | minecraft:iron |
| refined_iron | 20 | 2 | 0 | — | — | 15 | 0.8 | minecraft:iron |
| refined_obsidian | 50 | 4 | 0.2 | — | — | 40 | 0.8 | minecraft:diamond |
| sandstone/red | 6 | 0 | -0.1 | 1 | 0.8 | 7 | 0.7 | minecraft:stone |
| sandstone | 6 | 0 | -0.1 | 1 | 0.8 | 7 | 0.7 | minecraft:stone |
| signalum | 25 | 2 | 0.2 | — | — | 16 | 1.2 | minecraft:diamond |
| silver | 9 | 0 | 0.3 | — | — | 20 | 1.1 | minecraft:gold |
| steel | 20 | 2 | -0.2 | — | — | 11 | 0.8 | minecraft:iron |
| stone/andesite | 5 | 0 | -0.2 | 1 | 0.8 | 5 | 0.5 | minecraft:stone |
| stone/diorite | 5 | 0 | -0.2 | 1 | 0.8 | 5 | 0.5 | minecraft:stone |
| stone/granite | 5 | 0 | -0.2 | 1 | 0.8 | 5 | 0.5 | minecraft:stone |
| stone | 5 | 0 | -0.2 | 1 | 0.8 | 5 | 0.5 | minecraft:stone |
| terracotta/black | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/blue | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/brown | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/cyan | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/gray | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/green | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/light_blue | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/light_gray | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/lime | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/magenta | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/orange | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/pink | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/purple | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/red | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/white | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta/yellow | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| terracotta | 11 | 0 | -0.2 | 1 | 0.9 | 9 | 0.8 | minecraft:stone |
| tin | 13 | 0.5 | 0 | — | — | 12 | 1.1 | minecraft:stone |
| titanium | 37 | 1 | -0.2 | — | — | 12 | 1 | minecraft:netherite |
| turtle | — | — | — | — | — | 9 | 0.5 | minecraft:wood |
| tyrian_steel | 81 | 4 | 0 | 1.1 | 1.1 | 16 | 1.1 | minecraft:netherite |
| uranium | 20 | 0.5 | 0.1 | — | — | 17 | 1.5 | minecraft:diamond |
| wood/acacia | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/birch | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/crimson | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/dark_oak | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/jungle | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/oak | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/spruce | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood/warped | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wood | 8 | 0 | 0 | 1 | 0.9 | 15 | 0.6 | minecraft:wood |
| wool/black | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/blue | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/brown | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/cyan | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/gray | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/green | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/light_blue | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/light_gray | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/lime | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/magenta | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/orange | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/pink | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/purple | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/red | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/white | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool/yellow | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| wool | 4 | — | — | — | — | 7 | 0.7 | minecraft:wood |
| zinc | 10 | 0 | 0 | — | — | 15 | 1.1 | minecraft:stone |

## 128 个材料完整明细

每项列出所有已定义属性、各部件词条和触发条件。所有ID均以 `silentgear:` 开头。词条条件中的比例和数量针对其部件／复合材料计算，不表示只要背包里有这种材料即可生效。材料词条还必须满足后文词条本身的装备类型限制。

### 铝 — `aluminum`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/aluminum"}`。

静态标签候选：`alltheores:aluminum_ingot`、`chemlib:aluminum_ingot`、`immersiveengineering:ingot_aluminum`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **365**；护甲耐久系数 `armor_durability` = **15**；附魔能力 `enchantment_value` = **14**；采掘速度 `harvest_speed` = **8**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0.2**；护甲值 `armor` = **14**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **0.5**；魔法防御 `magic_armor` = **3**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **25**；星光充能适性 `charging_value` = **0.9** | 韧性 3〔malleable〕<br>柔软 2〔soft〕：该材料比例≥50%<br>协同作用 1〔synergistic〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.2**；远程伤害 `ranged_damage` = **mul2 0.1**；稀有度 `rarity` = **30** | 韧性 3〔malleable〕<br>协同作用 2〔synergistic〕 |

### 铝钢 — `aluminum_steel`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/aluminum_steel"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **660**；护甲耐久系数 `armor_durability` = **18**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **11**；采掘速度 `harvest_speed` = **8**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **45**；星光充能适性 `charging_value` = **1** | 韧性 4〔malleable〕<br>协同作用 2〔synergistic〕：该材料比例≥50% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.3**；采掘速度 `harvest_speed` = **mul2 0.1**；稀有度 `rarity` = **45** | 韧性 3〔malleable〕<br>协同作用 3〔synergistic〕 |

### 紫晶 — `amethyst`

类别：gem；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"item":"minecraft:amethyst_shard"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **210**；护甲耐久系数 `armor_durability` = **10**；附魔能力 `enchantment_value` = **16**；稀有度 `rarity` = **35**；星光充能适性 `charging_value` = **1.3**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **1**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **3**；魔法防御 `magic_armor` = **10** | 复生 1〔renew〕：该材料比例≥70% |
| 尖端 `tip` | 工具耐久 `durability` = **mul2 -0.25** | 丝滑 1〔silky〕：该材料比例≥66% |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 诅咒 4〔cursed〕 |

### 蔚蓝琥珀金 — `azure_electrum`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"tag":"forge:ingots/azure_electrum"}`。

静态标签候选：`silentgear:azure_electrum_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1259**；护甲耐久系数 `armor_durability` = **61**；附魔能力 `enchantment_value` = **37**；稀有度 `rarity` = **109**；星光充能适性 `charging_value` = **1.5**；修理加成 `repair_value` = **0.5**；采掘速度 `harvest_speed` = **29**；近战伤害 `melee_damage` = **7**；魔法伤害 `magic_damage` = **11**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **2**；弹射物精度 `projectile_accuracy` = **1.5**；护甲值 `armor` = **19**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **8**；魔法防御 `magic_armor` = **19** | 韧性 3〔malleable〕<br>加速 3〔accelerate〕：该材料比例≥35%<br>光辉 4〔light〕：该材料比例≥50% |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **add 3**；弹射物速度 `projectile_speed` = **mul2 1.5** | 柔韧 2〔flexible〕<br>加速 5〔accelerate〕：该材料比例≥66% |
| 尖端 `tip` | 工具耐久 `durability` = **add 401**；护甲耐久系数 `armor_durability` = **add 11**；采掘速度 `harvest_speed` = **add 5** | 韧性 3〔malleable〕 |

### 蔚蓝银 — `azure_silver`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/azure_silver"}`。

静态标签候选：`silentgear:azure_silver_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **197**；护甲耐久系数 `armor_durability` = **17**；附魔能力 `enchantment_value` = **29**；稀有度 `rarity` = **83**；星光充能适性 `charging_value` = **1.4**；修理加成 `repair_value` = **0.5**；采掘速度 `harvest_speed` = **19**；近战伤害 `melee_damage` = **5**；魔法伤害 `magic_damage` = **7**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1.2**；弹射物精度 `projectile_accuracy` = **1.1**；护甲值 `armor` = **13**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **13** | 韧性 3〔malleable〕<br>柔软 2〔soft〕<br>月球行走 4〔moonwalker〕：该材料比例≥50% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 -0.2**；采掘速度 `harvest_speed` = **add 3** | 弯折 2〔bending〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 83**；护甲耐久系数 `armor_durability` = **add 3**；采掘速度 `harvest_speed` = **add 3**；魔法伤害 `magic_damage` = **add 2**；攻击速度修正 `attack_speed` = **add 0.2**；稀有度 `rarity` = **add 31** | 韧性 2〔malleable〕<br>柔软 2〔soft〕 |

### 竹 — `bamboo`

类别：organic；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"minecraft:bamboo"}`。

直接部件替代原料：`{"rod":{"item":"minecraft:bamboo"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 3〔flexible〕 |

### barrier — `barrier`

类别：intangible；材料阶级：5；采掘层级：`minecraft:wood`。隐藏／非正常生存推荐

合成原料定义：`{"item":"minecraft:barrier"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1337**；护甲耐久系数 `armor_durability` = **84**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **111**；星光充能适性 `charging_value` = **0.5**；修理加成 `repair_value` = **-1**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **1**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **10**；魔法防御 `magic_armor` = **10** | 坚硬 5〔adamant〕<br>神圣 5〔holy〕 |

### 玄武岩 — `basalt`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:basalt"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **137**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **6**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **6**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 易碎 2〔brittle〕<br>剥落 3〔chipping〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1**；近战伤害 `melee_damage` = **mul2 -0.1** | 易碎 3〔brittle〕<br>剥落 2〔chipping〕 |

### 铋 — `bismuth`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/bismuth"}`。

静态标签候选：`chemlib:bismuth_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **330**；护甲耐久系数 `armor_durability` = **10**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **2.5**；魔法伤害 `magic_damage` = **3.5**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **16**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **35**；星光充能适性 `charging_value` = **0.9** | 韧性 2〔malleable〕<br>光辉 2〔lustrous〕：该材料比例≥50% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.1**；采掘速度 `harvest_speed` = **mul2 0.1**；稀有度 `rarity` = **35** | 韧性 2〔malleable〕 |

### 铋黄铜 — `bismuth_brass`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/bismuth_brass"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **580**；护甲耐久系数 `armor_durability` = **15**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **14**；采掘速度 `harvest_speed` = **9**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **8**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **50**；星光充能适性 `charging_value` = **1.1** | 韧性 2〔malleable〕<br>光辉 2〔lustrous〕：该材料比例≥50% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 -0.1**；采掘速度 `harvest_speed` = **mul2 0.2**；稀有度 `rarity` = **50** | 韧性 2〔malleable〕 |

### 铋钢 — `bismuth_steel`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/bismuth_steel"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1050**；护甲耐久系数 `armor_durability` = **25**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **14**；采掘速度 `harvest_speed` = **10**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **5**；攻击速度修正 `attack_speed` = **-0.1**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **4**；魔法防御 `magic_armor` = **8**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0.1**；稀有度 `rarity` = **60**；星光充能适性 `charging_value` = **1** | 韧性 3〔malleable〕<br>光辉 2〔lustrous〕：该材料比例≥50% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.25**；采掘速度 `harvest_speed` = **mul2 0.15**；稀有度 `rarity` = **60** | 韧性 3〔malleable〕 |

### 黑石 — `blackstone`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:blackstone"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **151**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **4**；稀有度 `rarity` = **9**；星光充能适性 `charging_value` = **0.6**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 易碎 1〔brittle〕<br>锯齿 2〔jagged〕<br>坚固 2〔hard〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 -0.1** | 易碎 1〔brittle〕<br>锯齿 2〔jagged〕<br>坚固 1〔hard〕 |

### 烈焰金 — `blaze_gold`

类别：metal；材料阶级：3；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/blaze_gold"}`。

静态标签候选：`silentgear:blaze_gold_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **69**；护甲耐久系数 `armor_durability` = **9**；附魔能力 `enchantment_value` = **24**；稀有度 `rarity` = **45**；星光充能适性 `charging_value` = **1.2**；采掘速度 `harvest_speed` = **15**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **5**；攻击速度修正 `attack_speed` = **0.1**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0.2**；弹射物速度 `projectile_speed` = **1.2**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **13**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **10** | 辉煌 1〔brilliant〕：该材料比例≥70%<br>贪婪 3〔greedy〕<br>韧性 3〔malleable〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1** | 柔韧 3〔flexible〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 32**；护甲耐久系数 `armor_durability` = **add 3**；采掘速度 `harvest_speed` = **add 4**；近战伤害 `melee_damage` = **add 1**；魔法伤害 `magic_damage` = **add 1**；稀有度 `rarity` = **add 14** | 柔软 2〔soft〕<br>炽烈 4〔fiery〕（定义等级超过词条上限2） |
| 涂层 `coating` | 工具耐久 `durability` = **mul2 -0.05**；护甲耐久系数 `armor_durability` = **mul2 -0.05**；稀有度 `rarity` = **add 20** | 辉煌 1〔brilliant〕<br>柔软 2〔soft〕 |

### 烈焰棒 — `blaze_rod`

类别：metal；材料阶级：3；采掘层级：`minecraft:iron`。

合成原料定义：`{}`。

直接部件替代原料：`{"rod":{"tag":"forge:rods/blaze"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1**；近战伤害 `melee_damage` = **mul2 0.2**；远程伤害 `ranged_damage` = **mul2 0.1** | 韧性 4〔malleable〕<br>柔韧 2〔flexible〕<br>长臂 1〔reach〕 |

### 骨 — `bone`

类别：organic；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:bone_block"}`。

直接部件替代原料：`{"rod":{"item":"minecraft:bone"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **108**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **8**；星光充能适性 `charging_value` = **0.9**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0.1**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **0.9**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **1** | 剥落 2〔chipping〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.2** | 柔韧 2〔flexible〕 |

### 黄铜 — `brass`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/brass"}`。

静态标签候选：`alltheores:brass_ingot`、`create:brass_ingot`、`railcraft:brass_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **240**；护甲耐久系数 `armor_durability` = **8**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **13**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **1.5**；魔法伤害 `magic_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **14**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **25**；星光充能适性 `charging_value` = **1.2** | 韧性 2〔malleable〕<br>丝滑 1〔silky〕：该材料比例≥66% |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.05**；采掘速度 `harvest_speed` = **mul2 0.05**；稀有度 `rarity` = **25** | 韧性 2〔malleable〕 |

### 青铜 — `bronze`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/bronze"}`。

静态标签候选：`alltheores:bronze_ingot`、`mekanism:ingot_bronze`、`railcraft:bronze_ingot`、`silentgear:bronze_ingot`、`thermal:bronze_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **300**；护甲耐久系数 `armor_durability` = **13**；附魔能力 `enchantment_value` = **12**；稀有度 `rarity` = **15**；星光充能适性 `charging_value` = **1.1**；修理加成 `repair_value` = **0.15**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **2.5**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **-0.2**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **6** | 锋利 1〔sharp〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.05** | 柔韧 1〔flexible〕 |

### 致密铁 — `compressed_iron`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/compressed_iron"}`。

静态标签候选：`pneumaticcraft:ingot_iron_compressed`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1024**；护甲耐久系数 `armor_durability` = **24**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **9**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **-0.2**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **4**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **0.8** | 韧性 2〔malleable〕<br>坚固 3〔hard〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.25**；稀有度 `rarity` = **40** | 韧性 2〔malleable〕<br>磁力 4〔magnetic〕：该材料比例≥50% |

### 铜 — `copper`

类别：metal；材料阶级：2；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:copper_ingot"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **151**；护甲耐久系数 `armor_durability` = **12**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **12**；星光充能适性 `charging_value` = **1.3**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **1.5**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0.1**；攻击速度修正 `attack_speed/axe` = **-0.1**；攻击速度修正 `attack_speed/hoe` = **0**；远程伤害 `ranged_damage` = **0.1**；远程速度 `ranged_speed` = **0**；护甲值 `armor` = **10**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **4**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **8** | 柔软 1〔soft〕：该材料比例≥50% |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2** | 弯折 3〔bending〕<br>柔软 3〔soft〕 |

### 深红铁 — `crimson_iron`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/crimson_iron"}`。

静态标签候选：`silentgear:crimson_iron_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **420**；护甲耐久系数 `armor_durability` = **27**；附魔能力 `enchantment_value` = **14**；稀有度 `rarity` = **31**；星光充能适性 `charging_value` = **0.7**；修理加成 `repair_value` = **0.5**；采掘速度 `harvest_speed` = **10**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **-0.1**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1.1**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6** | 韧性 3〔malleable〕<br>坚固 2〔hard〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 柔韧 3〔flexible〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 224**；护甲耐久系数 `armor_durability` = **add 8**；采掘速度 `harvest_speed` = **add 2**；近战伤害 `melee_damage` = **add 2**；稀有度 `rarity` = **add 10** | 炽烈 1〔fiery〕 |

### 深红钢 — `crimson_steel`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"tag":"forge:ingots/crimson_steel"}`。

静态标签候选：`silentgear:crimson_steel_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **2400**；护甲耐久系数 `armor_durability` = **42**；附魔能力 `enchantment_value` = **19**；稀有度 `rarity` = **83**；星光充能适性 `charging_value` = **0.9**；修理加成 `repair_value` = **0.5**；采掘速度 `harvest_speed` = **15**；近战伤害 `melee_damage` = **6**；魔法伤害 `magic_damage` = **6**；攻击速度修正 `attack_speed` = **-0.1**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1.3**；护甲值 `armor` = **22**；护甲值 `armor/helmet` = **4**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **4**；盔甲韧性 `armor_toughness` = **10**；魔法防御 `magic_armor` = **10** | 韧性 5〔malleable〕<br>坚固 3〔hard〕<br>火焰保护 1〔flame_ward〕：(该材料数量≥3 或 该材料比例≥33%) |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2**；远程伤害 `ranged_damage` = **add 1** | 柔韧 4〔flexible〕<br>坚实 1〔sturdy〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 448**；护甲耐久系数 `armor_durability` = **add 16**；稀有度 `rarity` = **add 20** | 熔岩 1〔magmatic〕 |

### 钻石 — `diamond`

类别：gem；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:gems/diamond"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1561**；护甲耐久系数 `armor_durability` = **33**；附魔能力 `enchantment_value` = **10**；稀有度 `rarity` = **70**；星光充能适性 `charging_value` = **0.8**；攻击速度修正 `attack_speed/hoe` = **1**；采掘速度 `harvest_speed` = **8**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **0.9**；弹射物精度 `projectile_accuracy` = **1.1**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **8**；魔法防御 `magic_armor` = **4** | 易碎 2〔brittle〕<br>光辉 1〔lustrous〕：(该材料数量≥3 或 该材料比例≥50%) |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2** | 易碎 5〔brittle〕：该材料比例≥50%<br>光辉 4〔lustrous〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 256**；护甲耐久系数 `armor_durability` = **add 9**；采掘速度 `harvest_speed` = **add 2**；近战伤害 `melee_damage` = **add 2**；魔法伤害 `magic_damage` = **add 1**；远程伤害 `ranged_damage` = **add 0.5**；稀有度 `rarity` = **add 20** | 易碎 2〔brittle〕<br>光辉 2〔lustrous〕 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 堡垒 1〔bastion〕 |

### 金刚绿宝石 — `dimerald`

类别：gem；材料阶级：3；采掘层级：`minecraft:diamond`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"type":"silentgear:custom_compound","item":"silentgear:custom_gem","material":"silentgear:dimerald"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1776**；护甲耐久系数 `armor_durability` = **36**；附魔能力 `enchantment_value` = **12**；稀有度 `rarity` = **80**；星光充能适性 `charging_value` = **0.7**；采掘速度 `harvest_speed` = **9**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0.1**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1.2**；护甲值 `armor` = **22**；护甲值 `armor/helmet` = **4**；护甲值 `armor/chestplate` = **9**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **10**；魔法防御 `magic_armor` = **10** | 易碎 1〔brittle〕<br>掘金者 2〔gold_digger〕：(该材料数量≥3 或 该材料比例≥50%) |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.15** | 易碎 1〔brittle〕：该材料比例≥50%<br>远古 3〔ancient〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 360**；采掘速度 `harvest_speed` = **add 2**；近战伤害 `melee_damage` = **add 2**；魔法伤害 `magic_damage` = **add 1**；远程伤害 `ranged_damage` = **add 0.5**；稀有度 `rarity` = **add 25** | 帝国宝藏 2〔imperial〕 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 猫眼 1〔kitty_vision〕 |

### 琥珀金 — `electrum`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/electrum"}`。

静态标签候选：`alltheores:electrum_ingot`、`createaddition:electrum_ingot`、`immersiveengineering:ingot_electrum`、`thermal:electrum_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **96**；护甲耐久系数 `armor_durability` = **10**；附魔能力 `enchantment_value` = **25**；采掘速度 `harvest_speed` = **14**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **5**；攻击速度修正 `attack_speed` = **0.3**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **11**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0.4**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **1.5** | 韧性 2〔malleable〕<br>柔软 2〔soft〕：该材料比例≥50% |
| 手柄／杆 `rod` | 攻击速度修正 `attack_speed` = **add 0.1**；远程速度 `ranged_speed` = **mul2 0.1**；稀有度 `rarity` = **40** | 光辉 3〔lustrous〕：该材料比例≥50% |

### 绿宝石 — `emerald`

类别：gem；材料阶级：3；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:gems/emerald"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1080**；护甲耐久系数 `armor_durability` = **24**；附魔能力 `enchantment_value` = **16**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **1**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **10**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/hoe` = **1**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1.1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **16**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **4**；魔法防御 `magic_armor` = **6** | 易碎 1〔brittle〕<br>协同作用 2〔synergistic〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.3** | 易碎 4〔brittle〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 512**；护甲耐久系数 `armor_durability` = **add 12**；采掘速度 `harvest_speed` = **add 2**；近战伤害 `melee_damage` = **add 1**；魔法伤害 `magic_damage` = **add 2**；远程伤害 `ranged_damage` = **add 1**；稀有度 `rarity` = **add 20** | 易碎 1〔brittle〕<br>协同作用 2〔synergistic〕 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 长臂 2〔reach〕 |

### 末地烛 — `end_rod`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{}`。

直接部件替代原料：`{"rod":{"item":"minecraft:end_rod"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2**；近战伤害 `melee_damage` = **mul2 0.1**；远程伤害 `ranged_damage` = **mul2 0.1** | 柔韧 4〔flexible〕<br>坚实 2〔sturdy〕<br>折射 1〔refractive〕 |

### 末地石 — `end_stone`

类别：rock；材料阶级：1；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:end_stones"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1164**；护甲耐久系数 `armor_durability` = **15**；附魔能力 `enchantment_value` = **10**；稀有度 `rarity` = **32**；星光充能适性 `charging_value` = **0.9**；修理加成 `repair_value` = **-0.2**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0.1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **6** | 锯齿 3〔jagged〕<br>远古 2〔ancient〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **add 1** | 韧性 1〔malleable〕<br>远古 4〔ancient〕 |

### 末影 — `enderium`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"tag":"forge:ingots/enderium"}`。

静态标签候选：`alltheores:enderium_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1200**；护甲耐久系数 `armor_durability` = **34**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **13**；采掘速度 `harvest_speed` = **18**；近战伤害 `melee_damage` = **6**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **22**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **9**；护甲值 `armor/leggings` = **7**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **8**；魔法防御 `magic_armor` = **10**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **80**；星光充能适性 `charging_value` = **1.2** | 韧性 3〔malleable〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.2**；采掘速度 `harvest_speed` = **mul2 0.2**；稀有度 `rarity` = **60** | 韧性 2〔malleable〕 |

### 示例 — `example`

类别：intangible；材料阶级：0；采掘层级：`minecraft:wood`。隐藏／非正常生存推荐 装备黑名单：all

合成原料定义：`{}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **100**；护甲耐久系数 `armor_durability` = **6**；附魔能力 `enchantment_value` = **1**；稀有度 `rarity` = **0**；星光充能适性 `charging_value` = **1**；采掘速度 `harvest_speed` = **1**；近战伤害 `melee_damage` = **1**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **1**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **1** | 无显式词条 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 尖端 `tip` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 涂层 `coating` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 握把 `grip` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 绑定 `binding` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 衬里 `lining` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 弓弦 `cord` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 箭羽 `fletching` | 无额外数值修正；该槽位仍可用 | 无显式词条 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 无显式词条 |

### 羽毛 — `feather`

类别：organic；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:feathers"}`。

静态标签候选：`ecologics:penguin_feather`、`eidolon:raven_feather`、`forbidden_arcanus:golden_feather`、`minecraft:feather`、`twilightforest:raven_feather`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 箭羽 `fletching` | 弹射物速度 `projectile_speed` = **0.9**；弹射物精度 `projectile_accuracy` = **1.1** | 无显式词条 |

### 细丝 — `fine_silk`

类别：organic, fiber；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:fine_silk"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 魔法防御 `magic_armor` = **add 2** | 幸运 1〔lucky〕<br>柔韧 4〔flexible〕 |
| 弓弦 `cord` | 远程伤害 `ranged_damage` = **mul1 0.07** | 柔韧 2〔flexible〕 |

### 细丝织布 — `fine_silk_cloth`

类别：organic, cloth；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:fine_silk_cloth"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **14**；附魔能力 `enchantment_value` = **14**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **0.9**；护甲耐久系数 `armor_durability/elytra` = **18**；护甲值 `armor` = **6**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **14** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.1**；采掘速度 `harvest_speed` = **mul1 0.15** | 加速 1〔accelerate〕 |
| 衬里 `lining` | 魔法防御 `magic_armor` = **add 2** | 柔韧 4〔flexible〕 |

### 亚麻 — `flax`

类别：organic, fiber；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:flax_string"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 护甲耐久系数 `armor_durability` = **mul1 0.05**；采掘速度 `harvest_speed` = **mul1 0.05** | 柔韧 3〔flexible〕 |
| 弓弦 `cord` | 远程伤害 `ranged_damage` = **mul1 -0.1**；远程速度 `ranged_speed` = **mul1 0.2** | 无显式词条 |

### 燧石 — `flint`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:flint"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **124**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **3**；稀有度 `rarity` = **6**；星光充能适性 `charging_value` = **0.8**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **2**；攻击速度修正 `attack_speed` = **-0.1**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **-0.3**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5** | 锯齿 3〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 易碎 3〔brittle〕<br>锯齿 2〔jagged〕 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 无显式词条 |

### 毛绒线 — `fluffy_string`

类别：organic, fiber；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:fluffy_string"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 护甲耐久系数 `armor_durability` = **mul1 0.05**；采掘速度 `harvest_speed` = **mul1 -0.05** | 柔韧 3〔flexible〕 |
| 弓弦 `cord` | 远程伤害 `ranged_damage` = **mul1 0.05**；远程速度 `ranged_speed` = **mul1 -0.05** | 无显式词条 |

### 萤石 — `glowstone`

类别：gem, dust；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:dusts/glowstone"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 尖端 `tip` | 采掘速度 `harvest_speed` = **mul2 0.4**；近战伤害 `melee_damage` = **add 2**；魔法伤害 `magic_damage` = **add 2**；远程速度 `ranged_speed` = **mul2 0.3**；稀有度 `rarity` = **add 15** | 折射 1〔refractive〕<br>光辉 4〔lustrous〕 |

### 金 — `gold`

类别：metal；材料阶级：2；采掘层级：`minecraft:gold`。

合成原料定义：`{"tag":"forge:ingots/gold"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **32**；护甲耐久系数 `armor_durability` = **7**；附魔能力 `enchantment_value` = **22**；稀有度 `rarity` = **50**；星光充能适性 `charging_value` = **1.2**；采掘速度 `harvest_speed` = **12**；近战伤害 `melee_damage` = **0**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0.3**；弹射物速度 `projectile_speed` = **1.1**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **11**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **8** | 辉煌 1〔brilliant〕：该材料比例≥70%<br>韧性 1〔malleable〕<br>柔软 3〔soft〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **add 3** | 弯折 4〔bending〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 16**；护甲耐久系数 `armor_durability` = **add 1**；采掘速度 `harvest_speed` = **add 6**；魔法伤害 `magic_damage` = **add 2**；远程速度 `ranged_speed` = **add 0.2**；稀有度 `rarity` = **add 30** | 韧性 1〔malleable〕<br>柔软 3〔soft〕 |
| 涂层 `coating` | 工具耐久 `durability` = **mul2 -0.1**；护甲耐久系数 `armor_durability` = **mul2 -0.1**；稀有度 `rarity` = **add 10** | 辉煌 1〔brilliant〕<br>柔软 3〔soft〕 |

### 高碳钢 — `high_carbon_steel`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"type":"silentgear:custom_compound","item":"silentgear:custom_ingot","material":"silentgear:high_carbon_steel"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **420**；护甲耐久系数 `armor_durability` = **24**；附魔能力 `enchantment_value` = **11**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **0.05**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **-0.2**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **-0.2** | 韧性 3〔malleable〕 |

### 混合宝石 — `hybrid_gem`

类别：动态；材料阶级：动态；采掘层级：`minecraft:wood`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"item":"silentgear:hybrid_gem"}`。

属性与词条从复合材料内的成分动态生成，没有固定静态面板。

### 殷钢 — `invar`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/invar"}`。

静态标签候选：`alltheores:invar_ingot`、`railcraft:invar_ingot`、`thermal:invar_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **640**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **13**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **3.5**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **50**；星光充能适性 `charging_value` = **1.2** | 韧性 3〔malleable〕<br>坚硬 2〔adamant〕：(该材料数量≥3 或 该材料比例≥35%) |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.3**；近战伤害 `melee_damage` = **mul2 0.1**；稀有度 `rarity` = **50** | 韧性 3〔malleable〕 |

### 铁 — `iron`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/iron"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

直接部件替代原料：`{"rod":{"tag":"forge:rods/iron"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **250**；护甲耐久系数 `armor_durability` = **15**；附魔能力 `enchantment_value` = **14**；稀有度 `rarity` = **20**；星光充能适性 `charging_value` = **0.7**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.1**；攻击速度修正 `attack_speed/hoe` = **0**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1.1**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **6** | 韧性 3〔malleable〕<br>磁力 1〔magnetic〕：该材料比例≥66% |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕<br>磁力 3〔magnetic〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 128**；护甲耐久系数 `armor_durability` = **add 4**；采掘速度 `harvest_speed` = **add 1**；近战伤害 `melee_damage` = **add 1**；远程速度 `ranged_speed` = **add 0.2**；稀有度 `rarity` = **add 8** | 韧性 2〔malleable〕 |

### 青金石 — `lapis_lazuli`

类别：gem；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:gems/lapis"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **200**；护甲耐久系数 `armor_durability` = **13**；附魔能力 `enchantment_value` = **17**；稀有度 `rarity` = **30**；星光充能适性 `charging_value` = **1.3**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **15**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **10** | 无显式词条 |
| 尖端 `tip` | 采掘速度 `harvest_speed` = **mul2 -0.1**；魔法伤害 `magic_damage` = **add 2**；攻击速度修正 `attack_speed` = **add 0.3** | 神圣 1〔holy〕：该材料比例≥75%<br>幸运 4〔lucky〕：该材料比例≥75% |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 幸运 3〔lucky〕：该材料比例≥75% |

### 铅 — `lead`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/lead"}`。

静态标签候选：`alltheores:lead_ingot`、`caupona:lead_ingot`、`chemlib:lead_ingot`、`eidolon:lead_ingot`、`immersiveengineering:ingot_lead`、`mekanism:ingot_lead`、`railcraft:lead_ingot`、`thermal:lead_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **260**；护甲耐久系数 `armor_durability` = **14**；附魔能力 `enchantment_value` = **15**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **-0.4**；护甲值 `armor` = **13**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **4**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **-0.3**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **0.8** | 韧性 2〔malleable〕<br>水栖 2〔aquatic〕：(该材料数量≥3 或 该材料比例≥35%) |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.1**；采掘速度 `harvest_speed` = **mul2 -0.1**；稀有度 `rarity` = **40** | 柔软 4〔soft〕 |

### 皮革 — `leather`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:leather"}`。

静态标签候选：`forbidden_arcanus:rotten_leather`、`immersiveengineering:ersatz_leather`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **11**；星光充能适性 `charging_value` = **0.8**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **8** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.1**；采掘速度 `harvest_speed` = **mul1 0.15**；攻击速度修正 `attack_speed` = **add 0.15** | 柔韧 3〔flexible〕 |
| 衬里 `lining` | 无额外数值修正；该槽位仍可用 | 柔韧 4〔flexible〕 |

### 树叶 — `leaves`

类别：organic；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"minecraft:leaves"}`。

静态标签候选：`ad_astra:glacian_leaves`、`aether:crystal_fruit_leaves`、`aether:crystal_leaves`、`aether:decorated_holiday_leaves`、`aether:golden_oak_leaves`、`aether:holiday_leaves`、`aether:skyroot_leaves`、`ars_elemental:yellow_archwood_leaves`等

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 箭羽 `fletching` | 弹射物速度 `projectile_speed` = **1.1**；弹射物精度 `projectile_accuracy` = **0.9** | 无显式词条 |

### 流明 — `lumium`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/lumium"}`。

静态标签候选：`alltheores:lumium_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **920**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **14**；采掘速度 `harvest_speed` = **15**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0.2**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **4**；魔法防御 `magic_armor` = **10**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **75**；星光充能适性 `charging_value` = **1.3** | 韧性 3〔malleable〕<br>折射 1〔refractive〕：该材料比例≥50% |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2**；远程伤害 `ranged_damage` = **mul2 0.1**；稀有度 `rarity` = **75** | 韧性 3〔malleable〕<br>折射 1〔refractive〕：该材料比例≥50% |

### 金属合金 — `metal_alloy`

类别：动态；材料阶级：动态；采掘层级：`minecraft:wood`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"item":"silentgear:alloy_ingot"}`。

属性与词条从复合材料内的成分动态生成，没有固定静态面板。

### mixed_fabric — `mixed_fabric`

类别：动态；材料阶级：动态；采掘层级：`minecraft:wood`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"item":"silentgear:mixed_fabric"}`。

属性与词条从复合材料内的成分动态生成，没有固定静态面板。

### 下界合金 — `netherite`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"item":"minecraft:netherite_ingot"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 涂层 `coating` | 工具耐久 `durability` = **mul2 0.3；add 2**；护甲耐久系数 `armor_durability` = **mul2 0.12121213**；采掘速度 `harvest_speed` = **mul2 0.125**；近战伤害 `melee_damage` = **mul2 0.33333334**；魔法伤害 `magic_damage` = **mul2 0.33333334**；远程伤害 `ranged_damage` = **mul2 0.33333334**；盔甲韧性 `armor_toughness` = **add 4**；击退抗性 `knockback_resistance` = **add 1**；附魔能力 `enchantment_value` = **add 5** | 防火 1〔fireproof〕 |

### 下界岩 — `netherrack`

类别：rock, organic；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"tag":"forge:netherrack"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **142**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **8**；稀有度 `rarity` = **11**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.2**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **0.5**；魔法伤害 `magic_damage` = **0.5**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **0.5**；远程速度 `ranged_speed` = **0.1**；弹射物速度 `projectile_speed` = **0.8**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **8**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **4**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **4** | 侵蚀 3〔eroded〕<br>柔韧 2〔flexible〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 侵蚀 2〔eroded〕<br>弯折 2〔bending〕 |

### 下界木 — `netherwood`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:netherwood_planks"}`。

直接部件替代原料：`{"rod":{"tag":"silentgear:rods/netherwood"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **72**；护甲耐久系数 `armor_durability` = **12**；附魔能力 `enchantment_value` = **13**；稀有度 `rarity` = **4**；星光充能适性 `charging_value` = **0.7**；修理加成 `repair_value` = **0.1**；修理效率 `repair_efficiency` = **0.5**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **8**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **4**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **6** | 柔韧 3〔flexible〕<br>锯齿 2〔jagged〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **add 1**；近战伤害 `melee_damage` = **add 0.5** | 柔韧 1〔flexible〕 |

### 镍 — `nickel`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/nickel"}`。

静态标签候选：`alltheores:nickel_ingot`、`chemlib:nickel_ingot`、`immersiveengineering:ingot_nickel`、`railcraft:nickel_ingot`、`thermal:nickel_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **380**；护甲耐久系数 `armor_durability` = **17**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **2.5**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **13**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **0.5**；远程速度 `ranged_speed` = **0.1**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **1** | 韧性 3〔malleable〕<br>坚硬 1〔adamant〕：(该材料数量≥3 或 该材料比例≥35%) |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.2**；近战伤害 `melee_damage` = **mul2 0.1**；稀有度 `rarity` = **40** | 韧性 3〔malleable〕 |

### 黑曜石 — `obsidian`

类别：rock；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:obsidian"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **3072**；护甲耐久系数 `armor_durability` = **37**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **10**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **-0.5**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **-0.4**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.4**；弹射物速度 `projectile_speed` = **0.7**；弹射物精度 `projectile_accuracy` = **0.7**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **4**；魔法防御 `magic_armor` = **8** | 锯齿 3〔jagged〕<br>粉碎 2〔crushing〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 -0.1** | 易碎 2〔brittle〕<br>剥落 3〔chipping〕 |

### 锇 — `osmium`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/osmium"}`。

静态标签候选：`alltheores:osmium_ingot`、`chemlib:osmium_ingot`、`mekanism:ingot_osmium`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **500**；护甲耐久系数 `armor_durability` = **30**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **10**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **17**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **6**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **3**；魔法防御 `magic_armor` = **4**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **35**；星光充能适性 `charging_value` = **1.1** | 韧性 2〔malleable〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.1**；修理效率 `repair_efficiency` = **mul2 0.1**；稀有度 `rarity` = **35** | 韧性 2〔malleable〕 |

### 纸 — `paper`

类别：organic；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:paper"}`。

静态标签候选：`minecraft:paper`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 箭羽 `fletching` | 弹射物速度 `projectile_speed` = **1.1**；弹射物精度 `projectile_accuracy` = **0.9** | 无显式词条 |

### 幻翼膜 — `phantom_membrane`

类别：organic, cloth；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"minecraft:phantom_membrane"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **12**；附魔能力 `enchantment_value` = **10**；稀有度 `rarity` = **35**；星光充能适性 `charging_value` = **0.7**；护甲耐久系数 `armor_durability/elytra` = **17**；护甲值 `armor` = **6**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **8** | 复生 2〔renew〕：该材料比例≥50% |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.15**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 远古 2〔ancient〕 |
| 衬里 `lining` | 无额外数值修正；该槽位仍可用 | 光辉 2〔light〕<br>柔韧 3〔flexible〕 |

### 铂 — `platinum`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/platinum"}`。

静态标签候选：`alltheores:platinum_ingot`、`chemlib:platinum_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **900**；护甲耐久系数 `armor_durability` = **21**；附魔能力 `enchantment_value` = **14**；采掘速度 `harvest_speed` = **12**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **12**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **80**；星光充能适性 `charging_value` = **1.2** | 韧性 3〔malleable〕<br>柔软 2〔soft〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 -0.1**；修理效率 `repair_efficiency` = **mul2 0.1**；稀有度 `rarity` = **70** | 韧性 2〔malleable〕<br>柔软 4〔soft〕 |

### 海晶石 — `prismarine`

类别：gem, organic；材料阶级：3；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:gems/prismarine"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 涂层 `coating` | 工具耐久 `durability` = **mul2 0.075**；护甲耐久系数 `armor_durability` = **mul2 0.125**；盔甲韧性 `armor_toughness` = **add 1**；击退抗性 `knockback_resistance` = **add 0.25** | 水栖 5〔aquatic〕：该材料比例≥67%<br>水栖 3〔aquatic〕：非(该材料比例≥67%) |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 速泳 3〔swift_swim〕：该材料比例≥67% |

### 石英 — `quartz`

类别：gem；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:gems/quartz"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **330**；护甲耐久系数 `armor_durability` = **13**；附魔能力 `enchantment_value` = **10**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **1.2**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **2**；攻击速度修正 `attack_speed` = **0.1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **1**；护甲值 `armor` = **14**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **4** | 粉碎 3〔crushing〕<br>锯齿 2〔jagged〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2**；近战伤害 `melee_damage` = **mul2 0.1** | 易碎 3〔brittle〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 64**；护甲耐久系数 `armor_durability` = **add 64**；采掘速度 `harvest_speed` = **add 2**；近战伤害 `melee_damage` = **add 4**；远程伤害 `ranged_damage` = **add 1.5**；稀有度 `rarity` = **add 20** | 剥落 1〔chipping〕<br>锯齿 3〔jagged〕 |
| 饰物 `adornment` | 无额外数值修正；该槽位仍可用 | 超凡 2〔mighty〕：该材料比例≥50% |

### 红石 — `redstone`

类别：gem, dust；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"tag":"forge:dusts/redstone"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 尖端 `tip` | 采掘速度 `harvest_speed` = **mul2 0.2**；近战伤害 `melee_damage` = **add 2**；攻击速度修正 `attack_speed` = **add 0.5**；远程伤害 `ranged_damage` = **add 2**；稀有度 `rarity` = **add 10** | 无显式词条 |

### 红石合金 — `redstone_alloy`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/redstone_alloy"}`。

静态标签候选：`enderio:redstone_alloy_ingot`、`morered:red_alloy_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **840**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **18**；采掘速度 `harvest_speed` = **11**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0.2**；护甲值 `armor` = **17**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **8**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **45**；星光充能适性 `charging_value` = **0.9** | 韧性 3〔malleable〕<br>侵蚀 3〔eroded〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.2**；稀有度 `rarity` = **45** | 韧性 3〔malleable〕 |

### 强化荧石 — `refined_glowstone`

类别：metal；材料阶级：3；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/refined_glowstone"}`。

静态标签候选：`mekanism:ingot_refined_glowstone`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **300**；护甲耐久系数 `armor_durability` = **18**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **18**；采掘速度 `harvest_speed` = **14**；近战伤害 `melee_damage` = **5**；魔法伤害 `magic_damage` = **3**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **19**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；魔法防御 `magic_armor` = **8**；远程伤害 `ranged_damage` = **3**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **45**；星光充能适性 `charging_value` = **0.8** | 韧性 2〔malleable〕<br>光辉 4〔lustrous〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 -0.1**；采掘速度 `harvest_speed` = **mul2 0.2**；稀有度 `rarity` = **45** | 韧性 4〔malleable〕<br>光辉 1〔lustrous〕：该材料比例≥75% |
| 尖端 `tip` | 采掘速度 `harvest_speed` = **add 5** | 折射 1〔refractive〕 |

### 精炼铁 — `refined_iron`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/refined_iron"}`。

静态扫描未解析出该标签成员；Forge内置标签及运行时脚本未执行，不能据此判定不可用。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **512**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **15**；采掘速度 `harvest_speed` = **7**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **18**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **25**；星光充能适性 `charging_value` = **0.8** | 韧性 4〔malleable〕<br>恒星 1〔stellar〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.15**；远程伤害 `ranged_damage` = **mul2 0.1**；稀有度 `rarity` = **25** | 韧性 4〔malleable〕<br>磁力 3〔magnetic〕：该材料比例≥35% |

### 强化黑曜石 — `refined_obsidian`

类别：metal；材料阶级：4；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/refined_obsidian"}`。

静态标签候选：`mekanism:ingot_refined_obsidian`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **2500**；护甲耐久系数 `armor_durability` = **50**；修理加成 `repair_value` = **-0.3**；附魔能力 `enchantment_value` = **40**；采掘速度 `harvest_speed` = **20**；近战伤害 `melee_damage` = **10**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0.3**；护甲值 `armor` = **30**；护甲值 `armor/helmet` = **5**；护甲值 `armor/chestplate` = **12**；护甲值 `armor/leggings` = **8**；护甲值 `armor/boots` = **5**；盔甲韧性 `armor_toughness` = **16**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **4**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **70**；星光充能适性 `charging_value` = **0.8** | 韧性 3〔malleable〕<br>坚固 4〔hard〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.25**；稀有度 `rarity` = **70** | 韧性 4〔malleable〕<br>坚固 3〔hard〕 |
| 尖端 `tip` | 工具耐久 `durability` = **add 600** | 火匠 1〔vulcan〕 |

### 红砂岩 — `sandstone/red`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:sandstone`

合成原料定义：`[{"item":"minecraft:red_sandstone"},{"item":"minecraft:chiseled_red_sandstone"},{"item":"minecraft:cut_red_sandstone"},{"item":"minecraft:smooth_red_sandstone"}]`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **117**；护甲耐久系数 `armor_durability` = **6**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0.1**；攻击速度修正 `attack_speed/axe` = **-0.1**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 无显式词条 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 易碎 1〔brittle〕 |

### 砂岩 — `sandstone`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"type":"silentlib:exclusion","value":{"tag":"forge:sandstone"},"exclusions":[{"item":"minecraft:red_sandstone"},{"item":"minecraft:chiseled_red_sandstone"},{"item":"minecraft:cut_red_sandstone"},{"item":"minecraft:smooth_red_sandstone"}]}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **117**；护甲耐久系数 `armor_durability` = **6**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0.1**；攻击速度修正 `attack_speed/axe` = **-0.1**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.1**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 无显式词条 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 易碎 1〔brittle〕 |

### sheet_metal — `sheet_metal`

类别：sheet；材料阶级：0；采掘层级：`minecraft:wood`。动态复合或加工材料，数值取决于输入

合成原料定义：`{"item":"silentgear:sheet_metal"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **mul2 -1**；护甲耐久系数 `armor_durability` = **mul2 -0.4**；护甲值 `armor` = **mul2 -0.5**；盔甲韧性 `armor_toughness` = **mul2 -0.5** | 无显式词条 |

### 信素 — `signalum`

类别：metal；材料阶级：4；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/signalum"}`。

静态标签候选：`alltheores:signalum_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **800**；护甲耐久系数 `armor_durability` = **25**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **16**；采掘速度 `harvest_speed` = **13**；近战伤害 `melee_damage` = **3**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **16**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **7**；护甲值 `armor/leggings` = **5**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **4**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **0.2**；稀有度 `rarity` = **50**；星光充能适性 `charging_value` = **1.2** | 柔韧 2〔flexible〕<br>光辉 4〔lustrous〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.3**；修理效率 `repair_efficiency` = **mul2 -0.1**；稀有度 `rarity` = **50** | 柔韧 4〔flexible〕<br>光辉 2〔lustrous〕 |

### 银 — `silver`

类别：metal；材料阶级：2；采掘层级：`minecraft:gold`。

合成原料定义：`{"tag":"forge:ingots/silver"}`。

静态标签候选：`alltheores:silver_ingot`、`chemlib:silver_ingot`、`eidolon:silver_ingot`、`immersiveengineering:ingot_silver`、`occultism:silver_ingot`、`railcraft:silver_ingot`、`thermal:silver_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **64**；护甲耐久系数 `armor_durability` = **9**；附魔能力 `enchantment_value` = **20**；采掘速度 `harvest_speed` = **11**；近战伤害 `melee_damage` = **0**；魔法伤害 `magic_damage` = **4**；攻击速度修正 `attack_speed` = **0.2**；护甲值 `armor` = **11**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **10**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0.3**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **1.1** | 韧性 2〔malleable〕<br>柔软 1〔soft〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1**；魔法伤害 `magic_damage` = **mul2 0.1**；稀有度 `rarity` = **40** | 韧性 1〔malleable〕<br>柔软 2〔soft〕 |

### 筋 — `sinew`

类别：organic, fiber；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"silentgear:sinew_fiber"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 修理效率 `repair_efficiency` = **mul1 -0.05** | 柔韧 4〔flexible〕 |
| 弓弦 `cord` | 远程伤害 `ranged_damage` = **mul1 0.2** | 柔韧 2〔flexible〕 |

### 黏液 — `slime`

类别：slime, organic；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"minecraft:slime_block"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 衬里 `lining` | 盔甲韧性 `armor_toughness` = **add 0.5** | 反弹 1〔bounce〕 |

### 钢 — `steel`

类别：metal；材料阶级：2；采掘层级：`minecraft:iron`。

合成原料定义：`{"tag":"forge:ingots/steel"}`。

静态标签候选：`ad_astra:steel_ingot`、`alltheores:steel_ingot`、`immersiveengineering:ingot_steel`、`mekanism:ingot_steel`、`railcraft:steel_ingot`、`simplysteel:steel_ingot`、`tconstruct:steel_ingot`、`thermal:steel_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **500**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **0.15**；附魔能力 `enchantment_value` = **11**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **4**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **-0.2**；护甲值 `armor` = **20**；护甲值 `armor/helmet` = **3**；护甲值 `armor/chestplate` = **8**；护甲值 `armor/leggings` = **6**；护甲值 `armor/boots` = **3**；盔甲韧性 `armor_toughness` = **2**；魔法防御 `magic_armor` = **6**；远程伤害 `ranged_damage` = **2**；远程速度 `ranged_speed` = **-0.2**；稀有度 `rarity` = **40**；星光充能适性 `charging_value` = **0.8** | 韧性 5〔malleable〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.25**；稀有度 `rarity` = **40** | 韧性 5〔malleable〕 |

### 安山岩 — `stone/andesite`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:stone`

合成原料定义：`{"item":"minecraft:andesite"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **131**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **4**；星光充能适性 `charging_value` = **0.5**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 远古 1〔ancient〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 2〔crushing〕 |

### 闪长岩 — `stone/diorite`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:stone`

合成原料定义：`{"item":"minecraft:diorite"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **131**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **4**；星光充能适性 `charging_value` = **0.5**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 远古 1〔ancient〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 2〔crushing〕 |

### 花岗岩 — `stone/granite`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:stone`

合成原料定义：`{"item":"minecraft:granite"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **131**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **4**；星光充能适性 `charging_value` = **0.5**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 远古 1〔ancient〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 2〔crushing〕 |

### 石头 — `stone`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"tag":"forge:cobblestone"}`。

静态标签候选：`blue_skies:lunar_cobblestone`、`blue_skies:turquoise_cobblestone`、`undergarden:depthrock`、`undergarden:shiverstone`、`undergarden:tremblecrust`

直接部件替代原料：`{"rod":{"tag":"forge:rods/stone"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **131**；护甲耐久系数 `armor_durability` = **5**；附魔能力 `enchantment_value` = **5**；稀有度 `rarity` = **4**；星光充能适性 `charging_value` = **0.5**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-1**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.8**；护甲值 `armor` = **5**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **1** | 远古 1〔ancient〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 2〔crushing〕 |

### 线 — `string`

类别：organic, fiber；材料阶级：1；采掘层级：`minecraft:wood`。

合成原料定义：`{"type":"silentlib:exclusion","value":{"tag":"forge:string"},"exclusions":[{"item":"silentgear:flax_string"},{"item":"silentgear:fluffy_string"},{"item":"silentgear:sinew_fiber"}]}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 修理效率 `repair_efficiency` = **mul1 0.05** | 柔韧 1〔flexible〕 |
| 弓弦 `cord` | 远程速度 `ranged_speed` = **mul1 0.1** | 无显式词条 |

### 黑色陶瓦 — `terracotta/black`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:black_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 蓝色陶瓦 — `terracotta/blue`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:blue_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 棕色陶瓦 — `terracotta/brown`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:brown_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 青色陶瓦 — `terracotta/cyan`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:cyan_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 灰色陶瓦 — `terracotta/gray`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:gray_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 绿色陶瓦 — `terracotta/green`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:green_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 淡蓝色陶瓦 — `terracotta/light_blue`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:light_blue_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 淡灰色陶瓦 — `terracotta/light_gray`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:light_gray_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 黄绿色陶瓦 — `terracotta/lime`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:lime_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 品红色陶瓦 — `terracotta/magenta`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:magenta_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 橙色陶瓦 — `terracotta/orange`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:orange_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 粉色陶瓦 — `terracotta/pink`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:pink_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 紫色陶瓦 — `terracotta/purple`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:purple_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 红色陶瓦 — `terracotta/red`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:red_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 白色陶瓦 — `terracotta/white`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:white_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 黄色陶瓦 — `terracotta/yellow`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。继承 `silentgear:terracotta`

合成原料定义：`{"item":"minecraft:yellow_terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 陶瓦 — `terracotta`

类别：rock；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"item":"minecraft:terracotta"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **165**；护甲耐久系数 `armor_durability` = **11**；附魔能力 `enchantment_value` = **9**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.8**；修理加成 `repair_value` = **-0.1**；采掘速度 `harvest_speed` = **4**；近战伤害 `melee_damage` = **1.5**；攻击速度修正 `attack_speed` = **0.2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **-0.2**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **9**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **3** | 易碎 1〔brittle〕<br>剥落 2〔chipping〕<br>淳朴 1〔rustic〕 |
| 手柄／杆 `rod` | 近战伤害 `melee_damage` = **mul2 0.1** | 易碎 2〔brittle〕<br>粉碎 1〔crushing〕 |

### 锡 — `tin`

类别：metal；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"tag":"forge:ingots/tin"}`。

静态标签候选：`alltheores:tin_ingot`、`chemlib:tin_ingot`、`mekanism:ingot_tin`、`railcraft:tin_ingot`、`thermal:tin_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **192**；护甲耐久系数 `armor_durability` = **13**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **5**；近战伤害 `melee_damage` = **1.5**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **12**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **2**；魔法防御 `magic_armor` = **2**；远程伤害 `ranged_damage` = **0.5**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **15**；星光充能适性 `charging_value` = **1.1** | 韧性 1〔malleable〕<br>柔软 2〔soft〕 |
| 手柄／杆 `rod` | 攻击速度修正 `attack_speed` = **add 0.2**；稀有度 `rarity` = **15** | 韧性 2〔malleable〕<br>柔软 1〔soft〕 |

### 钛 — `titanium`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"tag":"forge:ingots/titanium"}`。

静态标签候选：`chemlib:titanium_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **1600**；护甲耐久系数 `armor_durability` = **37**；附魔能力 `enchantment_value` = **12**；采掘速度 `harvest_speed` = **8**；近战伤害 `melee_damage` = **6**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **24**；护甲值 `armor/helmet` = **4**；护甲值 `armor/chestplate` = **9**；护甲值 `armor/leggings` = **7**；护甲值 `armor/boots` = **4**；盔甲韧性 `armor_toughness` = **8**；魔法防御 `magic_armor` = **4**；远程伤害 `ranged_damage` = **1**；远程速度 `ranged_speed` = **-0.2**；稀有度 `rarity` = **80**；星光充能适性 `charging_value` = **1** | 韧性 2〔malleable〕<br>坚固 4〔hard〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 0.1**；近战伤害 `melee_damage` = **mul2 0.2；add 2**；稀有度 `rarity` = **80** | 柔韧 2〔flexible〕<br>坚固 4〔hard〕 |

### 海龟壳 — `turtle`

类别：organic；材料阶级：2；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"minecraft:scute"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability/helmet` = **25**；附魔能力 `enchantment_value` = **9**；星光充能适性 `charging_value` = **0.5**；稀有度 `rarity` = **20**；护甲值 `armor/helmet` = **2**；魔法防御 `magic_armor` = **4** | 龟息 1〔turtle〕：该材料数量≥3 |

### 提尔钢 — `tyrian_steel`

类别：metal；材料阶级：4；采掘层级：`minecraft:netherite`。

合成原料定义：`{"tag":"forge:ingots/tyrian_steel"}`。

静态标签候选：`silentgear:tyrian_steel_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **3652**；护甲耐久系数 `armor_durability` = **81**；附魔能力 `enchantment_value` = **16**；稀有度 `rarity` = **100**；星光充能适性 `charging_value` = **1.1**；采掘速度 `harvest_speed` = **18**；近战伤害 `melee_damage` = **8**；魔法伤害 `magic_damage` = **6**；攻击速度修正 `attack_speed` = **0**；远程伤害 `ranged_damage` = **4**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1.1**；弹射物精度 `projectile_accuracy` = **1.1**；护甲值 `armor` = **25**；护甲值 `armor/helmet` = **5**；护甲值 `armor/chestplate` = **9**；护甲值 `armor/leggings` = **7**；护甲值 `armor/boots` = **4**；盔甲韧性 `armor_toughness` = **12**；魔法防御 `magic_armor` = **12** | 坚实 3〔sturdy〕：该材料比例≥50%<br>虚空庇佑 1〔void_ward〕：(该材料数量≥3 或 该材料比例≥50%) |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **add -2** | 坚实 4〔sturdy〕：该材料比例≥50% |
| 尖端 `tip` | 工具耐久 `durability` = **add 251**；稀有度 `rarity` = **add 30** | 帝国宝藏 3〔imperial〕<br>掘金者 3〔gold_digger〕 |

### 铀 — `uranium`

类别：metal；材料阶级：3；采掘层级：`minecraft:diamond`。

合成原料定义：`{"tag":"forge:ingots/uranium"}`。

静态标签候选：`alltheores:uranium_ingot`、`bigreactors:yellorium_ingot`、`chemlib:uranium_ingot`、`immersiveengineering:ingot_uranium`、`mekanism:ingot_uranium`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **800**；护甲耐久系数 `armor_durability` = **20**；修理加成 `repair_value` = **-0.15**；附魔能力 `enchantment_value` = **17**；采掘速度 `harvest_speed` = **6**；近战伤害 `melee_damage` = **2**；魔法伤害 `magic_damage` = **2**；攻击速度修正 `attack_speed` = **0.1**；护甲值 `armor` = **13**；护甲值 `armor/helmet` = **2**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **4**；护甲值 `armor/boots` = **2**；盔甲韧性 `armor_toughness` = **1**；魔法防御 `magic_armor` = **3**；远程伤害 `ranged_damage` = **0.5**；远程速度 `ranged_speed` = **0.1**；稀有度 `rarity` = **50**；星光充能适性 `charging_value` = **1.5** | 韧性 2〔malleable〕 |
| 手柄／杆 `rod` | 采掘速度 `harvest_speed` = **mul2 0.1**；远程速度 `ranged_speed` = **mul2 0.1**；稀有度 `rarity` = **40** | 韧性 2〔malleable〕 |

### 藤蔓 — `vine`

类别：organic；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"item":"minecraft:vine"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 绑定 `binding` | 修理效率 `repair_efficiency` = **mul1 0.03** | 无显式词条 |

### 金合欢木 — `wood/acacia`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:acacia_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 白桦木 — `wood/birch`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:birch_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 深红木 — `wood/crimson`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:crimson_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 深色橡木 — `wood/dark_oak`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:dark_oak_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 从林木 — `wood/jungle`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:jungle_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 橡木 — `wood/oak`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:oak_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 粗木 — `wood/rough`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{}`。

直接部件替代原料：`{"rod":{"tag":"silentgear:rods/rough"}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 粗糙 3〔crude〕<br>弯折 5〔bending〕 |

### 云杉木 — `wood/spruce`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:spruce_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 弯木 — `wood/warped`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wood`

合成原料定义：`{"item":"minecraft:warped_planks"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 木材 — `wood`

类别：organic, wood；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"type":"silentlib:exclusion","value":{"tag":"minecraft:planks"},"exclusions":[{"item":"minecraft:acacia_planks"},{"item":"minecraft:birch_planks"},{"item":"minecraft:dark_oak_planks"},{"item":"minecraft:jungle_planks"},{"item":"minecraft:oak_planks"},{"item":"minecraft:spruce_planks"},{"item":"silentgear:netherwood_planks"},{"item":"minecraft:crimson_planks"},{"item":"minecraft:warped_planks"}]}`。

直接部件替代原料：`{"rod":{"type":"silentlib:exclusion","value":{"tag":"forge:rods/wooden"},"exclusions":[{"item":"silentgear:netherwood_stick"}]}}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **59**；护甲耐久系数 `armor_durability` = **8**；附魔能力 `enchantment_value` = **15**；稀有度 `rarity` = **1**；星光充能适性 `charging_value` = **0.6**；修理加成 `repair_value` = **0.25**；采掘速度 `harvest_speed` = **2**；近战伤害 `melee_damage` = **0**；攻击速度修正 `attack_speed` = **0**；攻击速度修正 `attack_speed/axe` = **-0.2**；攻击速度修正 `attack_speed/hoe` = **-2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；弹射物速度 `projectile_speed` = **1**；弹射物精度 `projectile_accuracy` = **0.9**；护甲值 `armor` = **7**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **3**；护甲值 `armor/leggings` = **2**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2** | 可燃 1〔flammable〕<br>锯齿 1〔jagged〕 |
| 手柄／杆 `rod` | 无额外数值修正；该槽位仍可用 | 柔韧 2〔flexible〕 |

### 黑色羊毛 — `wool/black`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:black_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 蓝色羊毛 — `wool/blue`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:blue_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 棕色羊毛 — `wool/brown`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:brown_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 青色羊毛 — `wool/cyan`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:cyan_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 灰色羊毛 — `wool/gray`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:gray_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 绿色羊毛 — `wool/green`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:green_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 淡蓝色羊毛 — `wool/light_blue`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:light_blue_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 淡灰色羊毛 — `wool/light_gray`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:light_gray_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 黄绿色羊毛 — `wool/lime`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:lime_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 品红色羊毛 — `wool/magenta`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:magenta_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 橙色羊毛 — `wool/orange`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:orange_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 粉色羊毛 — `wool/pink`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:pink_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 紫色羊毛 — `wool/purple`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:purple_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 红色羊毛 — `wool/red`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:red_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 白色羊毛 — `wool/white`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:white_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 黄色羊毛 — `wool/yellow`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。继承 `silentgear:wool`

合成原料定义：`{"item":"minecraft:yellow_wool"}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 羊毛 — `wool`

类别：organic, cloth；材料阶级：0；采掘层级：`minecraft:wood`。

合成原料定义：`{"type":"silentlib:exclusion","value":{"tag":"minecraft:wool"},"exclusions":[{"item":"minecraft:black_wool"},{"item":"minecraft:blue_wool"},{"item":"minecraft:brown_wool"},{"item":"minecraft:cyan_wool"},{"item":"minecraft:gray_wool"},{"item":"minecraft:green_wool"},{"item":"minecraft:light_blue_wool"},{"item":"minecraft:light_gray_wool"},{"item":"minecraft:lime_wool"},{"item":"minecraft:magenta_wool"},{"item":"minecraft:orange_wool"},{"item":"minecraft:pink_wool"},{"item":"minecraft:purple_wool"},{"item":"minecraft:red_wool"},{"item":"minecraft:white_wool"},{"item":"minecraft:yellow_wool"}]}`。

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **0**；护甲耐久系数 `armor_durability` = **4**；附魔能力 `enchantment_value` = **7**；稀有度 `rarity` = **7**；星光充能适性 `charging_value` = **0.7**；护甲值 `armor` = **4**；护甲值 `armor/helmet` = **0.5**；护甲值 `armor/chestplate` = **2**；护甲值 `armor/leggings` = **1**；护甲值 `armor/boots` = **0.5**；魔法防御 `magic_armor` = **4** | 雪地行者 1〔snow_walker〕：装备类型=boots |
| 握把 `grip` | 修理效率 `repair_efficiency` = **mul1 0.2**；采掘速度 `harvest_speed` = **mul1 0.1**；攻击速度修正 `attack_speed` = **add 0.2** | 柔韧 2〔flexible〕 |
| 衬里 `lining` | 击退抗性 `knockback_resistance` = **add 0.1** | 柔韧 2〔flexible〕 |

### 锌 — `zinc`

类别：metal；材料阶级：1；采掘层级：`minecraft:stone`。

合成原料定义：`{"tag":"forge:ingots/zinc"}`。

静态标签候选：`alltheores:zinc_ingot`、`chemlib:zinc_ingot`、`create:zinc_ingot`、`railcraft:zinc_ingot`

| 部件 | 属性 | 材料词条与条件 |
| --- | --- | --- |
| 主体 `main` | 工具耐久 `durability` = **192**；护甲耐久系数 `armor_durability` = **10**；附魔能力 `enchantment_value` = **15**；采掘速度 `harvest_speed` = **3**；近战伤害 `melee_damage` = **1.5**；魔法伤害 `magic_damage` = **1**；攻击速度修正 `attack_speed` = **0**；护甲值 `armor` = **10**；护甲值 `armor/helmet` = **1**；护甲值 `armor/chestplate` = **5**；护甲值 `armor/leggings` = **3**；护甲值 `armor/boots` = **1**；魔法防御 `magic_armor` = **2**；远程伤害 `ranged_damage` = **0**；远程速度 `ranged_speed` = **0**；稀有度 `rarity` = **10**；星光充能适性 `charging_value` = **1.1** | 韧性 1〔malleable〕<br>柔软 2〔soft〕 |
| 手柄／杆 `rod` | 工具耐久 `durability` = **mul2 -0.05**；近战伤害 `melee_damage` = **mul2 0.05**；稀有度 `rarity` = **15** | 韧性 2〔malleable〕<br>柔软 3〔soft〕 |

## 70 个词条的意义与参数

等级数字是词条等级，受词条 `max_level` 上限限制；同名词条在多材料中的合成不应简单逐项相加。表中“材料来源”列出所有根材料或变体的部件来源，实际仍需满足材料占比、数量、装备类型等条件。括号中的英文用于避免汉化歧义。

参数阅读：`activation_chance` 是触发概率基数，耐久／修复类还按词条等级计算；`effect_scale=-1` 表示少损耗1点耐久，`+1` 表示多损耗1点。`attribute_modifiers` 里的 `operation=0` 为直接加值、`1` 为基值比例增量、`2` 为总值倍率；这里是原版属性操作，**不同于材料的mul1/mul2计算层**。`trait_level` 表示按词条等级查数组，`piece_count` 表示按装备件数查数组，`full_set_only` 表示要求全套。药水的 `level=0` 表示不给该效果，而 `amplifier=0` 表示效果I级。`damage_on_use` 是使用消耗耐久，`cooldown` 以游戏刻计，20刻通常为1秒。

| 词条 / ID | 上限 | 含义 |
| --- | --- | --- |
| 加速（Accelerate） `accelerate` | 5 | 耐久损失越多，采掘速度、攻击速度和远程速度越高。 |
| 坚硬（Adamant） `adamant` | 5 | 防具提供抗性提升；说明还标注对基础生命大于20点的生物有额外伤害。防具药水强度按件数计算。 |
| 远古（Ancient） `ancient` | 5 | 增加挖矿及击杀获得的经验；不是时运或抢夺。 |
| 水栖（Aquatic） `aquatic` | 5 | 完整套装提供水下呼吸；说明还标注对水生生物的额外伤害。 |
| 堡垒（Bastion） `bastion` | 5 | 给护甲／饰物增加原版护甲属性。 |
| 弯折（Bending） `bending` | 5 | 提示文本说可能额外耗耐久，但本地JSON的 effect_scale=-1 与柔韧相同，实际参数表示触发时减少1点耐久损耗。这是数据与提示冲突，不能仅按中文判断。 |
| 反弹（Bounce） `bounce` | 1 | 鞋子免除摔落伤害；防具可击退攻击者。 |
| 辉煌（Brilliant） `brilliant` | 1 | 使装备具备猪灵认可的金质特性，不是增加亮度或伤害。 |
| 易碎（Brittle） `brittle` | 5 | 触发时额外损失1点耐久；与可锻等词条抵消。 |
| 笨重（Bulky） `bulky` | 5 | 已有攻速降低参数，随耐久损失增加；语言文件仍写未测试，不推荐作为可靠配装增益。 |
| 冰冻（Chilled） `chilled` | 5 | 对下界或免疫火焰的合适目标额外造成寒冷类型伤害。 |
| 剥落（Chipping） `chipping` | 5 | 耐久损失越多，采掘速度越高，防具护甲越低。 |
| 五彩纸屑!（Confetti!） `confetti` | 5 | 玩家击杀生物且任一手持有该词条时，在被击杀者位置生成3枚随机烟花。是庆祝／烟花效果，不能当作固定近战增伤。 |
| 烧石（Crackler） `crackler` | 1 | 使用时消耗耐久放置玄武岩。 |
| 粗糙（Crude） `crude` | 5 | 降低协同效果；与朴实、协同增效存在抵消关系。 |
| 粉碎（Crushing） `crushing` | 5 | 耐久损失越多，护甲上升、近战伤害下降。 |
| 解毒（Cure Poison） `cure_poison` | 1 | 装备时移除中毒状态。 |
| 唤生（Cure Wither） `cure_wither` | 1 | 装备时移除凋零状态。 |
| 诅咒（Cursed） `cursed` | 7 | 降低原版幸运属性；不是降低武器伤害或附魔等级。 |
| 侵蚀（Eroded） `eroded` | 5 | 耐久损失越多，采掘速度增加、近战伤害减少。 |
| 炽烈（Fiery） `fiery` | 2 | 近战武器获得火焰附加，远程武器获得火矢；这是附魔效果，不是独立固定额外伤害。 |
| 防火（Fireproof） `fireproof` | 1 | 掉落的装备物品不会被火／熔岩烧毁；不等于穿戴者免疫火焰。 |
| 火焰保护（Flame Ward） `flame_ward` | 1 | 全套有效防具提供抗火，并覆盖易燃；也有物品防火效果。 |
| 可燃（Flammable） `flammable` | 1 | 装备在着火情形下会损失耐久，且可作为燃料。 |
| 柔韧（Flexible） `flexible` | 5 | 概率少消耗1点耐久；真正抵消对象是 Bending。部分中英文提示误写为 Brittle，应以JSON为准。 |
| 浮石（Floatstoner） `floatstoner` | 1 | 使用时消耗耐久放置末地石。 |
| 掘金者（Gold Digger） `gold_digger` | 5 | 符合标签条件的挖掘掉落可能额外增加金属粒；不等于所有矿石翻倍。 |
| 贪婪（Greedy） `greedy` | 5 | 提高矿石挖掘速度，不直接增加矿物数量。 |
| 坚固（Hard） `hard` | 5 | 耐久损失越多，采掘速度提高、远程伤害下降；与柔软抵消。 |
| 沉重（Heavy） `heavy` | 5 | 穿戴防具后降低移动速度。 |
| 神圣（Holy） `holy` | 5 | 对亡灵类目标造成额外伤害。 |
| 点燃（Ignite） `ignite` | 1 | 消耗少量耐久点火，类似打火石操作。 |
| 帝国宝藏（Imperial） `imperial` | 5 | 符合标签的宝石掉落可能额外增加；并非所有方块通用时运。 |
| 坚不可摧（Indestructible） `indestructible` | 1 | 防止后续耐久损失；不会自动把已有损耗修满，也不提供掉落物免疫一切伤害。 |
| 无聊的话（Jabberwocky） `jabberwocky` | 1 | 持有该词条、无精准采集地挖掘钻石矿石标签方块时，随机生成狼、猫、兔、鸡、鳕鱼、鲑鱼或河豚之一；属于彩蛋功能。 |
| 锯齿（Jagged） `jagged` | 5 | 耐久损失越多，近战伤害增加、远程伤害下降。 |
| 猫眼（Kitty Vision） `kitty_vision` | 1 | 头盔或饰物提供夜视。 |
| 光辉（Light） `light` | 5 | 穿戴防具后增加移动速度。 |
| 幸运（Lucky） `lucky` | 7 | 增加原版幸运属性，仅影响使用幸运参数的战利品表；不等于时运，不直接增加普通矿石掉落。 |
| 光辉（Lustrous） `lustrous` | 5 | 在光照条件下提高采掘速度；不是夜视或伤害加成。 |
| 熔岩（Magmatic） `magmatic` | 1 | 自动熔炼采掘掉落；熔炼产物不应用时运，避免刷物品。 |
| 磁力（Magnetic） `magnetic` | 5 | 吸引附近掉落物，等级提高吸引范围。 |
| 韧性（Malleable） `malleable` | 5 | 概率少消耗1点耐久；与脆性抵消。 |
| 超凡（Mighty） `mighty` | 5 | 工具／饰物给予急迫，工具在较高等级还给予力量；等级映射见参数。 |
| 月球行走（Moonwalker） `moonwalker` | 5 | 降低实体重力，影响落下与跳跃手感；不是飞行或摔落免疫。 |
| 多重破坏（Multi-break） `multi_break` | 5 | 数据保留的未实现词条，不能当作连锁采矿功能。 |
| nc_radiation_protection（nc_radiation_protection） `nc_radiation_protection` | 5 | NuclearCraft兼容示例，写入 ncRadiationResistance NBT；标注未测试，不能当作 Mekanism 辐射防护。 |
| 有机（Organic） `organic` | 5 | 耐久损失越多，附魔能力提高、魔法伤害字段降低。 |
| 岩石（Racker） `racker` | 1 | 消耗耐久放置下界岩。 |
| 长臂（Reach） `reach` | 5 | 增加方块交互距离，不是明确的近战攻击距离加成。 |
| 红牌（Red Card） `red_card` | 1 | 让装备可以永久损坏，覆盖通常的“耐久耗尽只变成损坏状态”保护。不是增伤词条，昂贵装备不建议添加。 |
| 折射（Refractive） `refractive` | 1 | 消耗耐久放置幻光照明方块。 |
| 复生（Renew） `renew` | 5 | 每秒以1.8%×等级的概率修复，触发时修复1×等级点耐久；不是每秒必定修复。 |
| 造路（Road Maker） `road_maker` | 1 | 将适合的草方块转换成草径，属于使用功能。 |
| 淳朴（Rustic） `rustic` | 5 | 基础协同较低时提供补偿；有效区间以参数为准。 |
| 锋利（Sharp） `sharp` | 5 | 耐久损失越多，采掘速度和近战伤害增加；本地中文把后者写成攻击速度，是误译。 |
| 丝滑（Silky） `silky` | 1 | 给采掘工具添加精准采集附魔。 |
| 雪地行者（Snow Walker） `snow_walker` | 1 | 穿戴相关防具或饰物可走过细雪而不陷入。 |
| 柔软（Soft） `soft` | 5 | 耐久损失越多，采掘速度下降；与坚硬抵消。 |
| 勺子（Spoon） `spoon` | 1 | 让镐可以有效挖掘土类方块。 |
| 恒星（Stellar） `stellar` | 5 | 概率自修复；防具根据装备件数提供速度和跳跃提升。 |
| 坚实（Sturdy） `sturdy` | 5 | 较高概率减少1点耐久损耗，不等于绝对不损坏。 |
| 速泳（Swift Swim） `swift_swim` | 5 | 增加游泳速度。 |
| 协同作用（Synergistic） `synergistic` | 5 | 基础协同达到适用条件时提高协同；不是简单把所有属性直接加4%。 |
| 终端（Terminus） `terminus` | 1 | 消耗耐久放置石头。 |
| 龟息（Turtle） `turtle` | 1 | 延长水下屏息时间，不等于永久水下呼吸。 |
| 毒液（Venom） `venom` | 5 | 攻击时使目标中毒，持续时间随等级增长。 |
| 虚空庇佑（Void Ward） `void_ward` | 1 | 在虚空伤害触发时帮助玩家向上脱离，并给予漂浮／缓降；不是创造模式无敌。 |
| 火匠（Vulcan） `vulcan` | 1 | 高耐久成本放置黑曜石，带冷却。 |
| 拓宽（Widen） `widen` | 3 | 扩大锤子和开掘铲的范围；I／II／III对应5×5／7×7／9×9。 |

### 每个词条的触发限制、精确参数与材料来源

### 词条：加速 `accelerate`

耐久损失越多，采掘速度、攻击速度和远程速度越高。

装备限制：装备类型=tool。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:harvest_speed | 2 | True | False |
| silentgear:attack_speed | 0.01 | True | False |
| silentgear:ranged_speed | 0.01 | True | False |

材料来源：蔚蓝琥珀金 `azure_electrum`／主体；蔚蓝琥珀金 `azure_electrum`／手柄／杆；细丝织布 `fine_silk_cloth`／握把。

### 词条：坚硬 `adamant`

防具提供抗性提升；说明还标注对基础生命大于20点的生物有额外伤害。防具药水强度按件数计算。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "armor": [
      {
        "type": "piece_count",
        "effect": "minecraft:resistance",
        "level": [
          1,
          1,
          1,
          2
        ]
      }
    ]
  }
}
```

材料来源：barrier `barrier`／主体；殷钢 `invar`／主体；镍 `nickel`／主体。

### 词条：远古 `ancient`

增加挖矿及击杀获得的经验；不是时运或抢夺。

装备限制：装备类型=tool。

材料来源：金刚绿宝石 `dimerald`／手柄／杆；末地石 `end_stone`／主体；末地石 `end_stone`／手柄／杆；幻翼膜 `phantom_membrane`／握把；石头 `stone`／主体。

### 词条：水栖 `aquatic`

完整套装提供水下呼吸；说明还标注对水生生物的额外伤害。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "armor": [
      {
        "type": "full_set_only",
        "effect": "minecraft:water_breathing",
        "level": [
          1
        ]
      }
    ]
  }
}
```

材料来源：铅 `lead`／主体；海晶石 `prismarine`／涂层。

### 词条：堡垒 `bastion`

给护甲／饰物增加原版护甲属性。

装备限制：(装备类型=armor 或 装备类型=curio)。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "minecraft:generic.armor",
        "operation": 0,
        "value": [
          1.0,
          2.0,
          3.0,
          4.0,
          5.0
        ]
      }
    ]
  }
}
```

材料来源：钻石 `diamond`／饰物。

### 词条：弯折 `bending`

提示文本说可能额外耗耐久，但本地JSON的 effect_scale=-1 与柔韧相同，实际参数表示触发时减少1点耐久损耗。这是数据与提示冲突，不能仅按中文判断。

抵消对象：`silentgear:flexible`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effect_scale": -1,
  "activation_chance": 0.075
}
```

材料来源：蔚蓝银 `azure_silver`／手柄／杆；铜 `copper`／手柄／杆；金 `gold`／手柄／杆；下界岩 `netherrack`／手柄／杆；粗木 `wood/rough`／手柄／杆。

### 词条：反弹 `bounce`

鞋子免除摔落伤害；防具可击退攻击者。

装备限制：装备类型=armor。

材料来源：黏液 `slime`／衬里。

### 词条：辉煌 `brilliant`

使装备具备猪灵认可的金质特性，不是增加亮度或伤害。

材料来源：烈焰金 `blaze_gold`／主体；烈焰金 `blaze_gold`／涂层；金 `gold`／主体；金 `gold`／涂层。

### 词条：易碎 `brittle`

触发时额外损失1点耐久；与可锻等词条抵消。

抵消对象：`silentgear:malleable`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effect_scale": 1,
  "activation_chance": 0.1
}
```

材料来源：玄武岩 `basalt`／主体；玄武岩 `basalt`／手柄／杆；黑石 `blackstone`／主体；黑石 `blackstone`／手柄／杆；钻石 `diamond`／主体；钻石 `diamond`／手柄／杆；钻石 `diamond`／尖端；金刚绿宝石 `dimerald`／主体；金刚绿宝石 `dimerald`／手柄／杆；绿宝石 `emerald`／主体；绿宝石 `emerald`／手柄／杆；绿宝石 `emerald`／尖端；燧石 `flint`／手柄／杆；黑曜石 `obsidian`／手柄／杆；石英 `quartz`／手柄／杆；砂岩 `sandstone`／手柄／杆；石头 `stone`／手柄／杆；陶瓦 `terracotta`／主体；陶瓦 `terracotta`／手柄／杆。

### 词条：笨重 `bulky`

已有攻速降低参数，随耐久损失增加；语言文件仍写未测试，不推荐作为可靠配装增益。

装备限制：装备类型=tool。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:attack_speed | -0.075 | True | False |

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：冰冻 `chilled`

对下界或免疫火焰的合适目标额外造成寒冷类型伤害。

装备限制：装备类型=weapon。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "damage_type": "chilled",
  "damage_bonus": 2
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：剥落 `chipping`

耐久损失越多，采掘速度越高，防具护甲越低。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:armor | -0.075 | True | True |
| silentgear:harvest_speed | 0.25 | True | True |

材料来源：玄武岩 `basalt`／主体；玄武岩 `basalt`／手柄／杆；骨 `bone`／主体；黑曜石 `obsidian`／手柄／杆；石英 `quartz`／尖端；陶瓦 `terracotta`／主体。

### 词条：五彩纸屑! `confetti`

玩家击杀生物且任一手持有该词条时，在被击杀者位置生成3枚随机烟花。是庆祝／烟花效果，不能当作固定近战增伤。

装备限制：装备类型=weapon。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：烧石 `crackler`

使用时消耗耐久放置玄武岩。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:basalt",
  "damage_on_use": 3,
  "cooldown": 0,
  "sound": "minecraft:block.basalt.place",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：粗糙 `crude`

降低协同效果；与朴实、协同增效存在抵消关系。

抵消对象：`silentgear:rustic`, `silentgear:synergistic`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "synergy_multi": -0.04
}
```

材料来源：粗木 `wood/rough`／手柄／杆。

### 词条：粉碎 `crushing`

耐久损失越多，护甲上升、近战伤害下降。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:armor | 0.05 | True | True |
| silentgear:melee_damage | -0.1667 | True | True |

材料来源：黑曜石 `obsidian`／主体；石英 `quartz`／主体；石头 `stone`／手柄／杆；陶瓦 `terracotta`／手柄／杆。

### 词条：解毒 `cure_poison`

装备时移除中毒状态。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effects": [
    "minecraft:poison"
  ]
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：唤生 `cure_wither`

装备时移除凋零状态。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effects": [
    "minecraft:wither"
  ]
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：诅咒 `cursed`

降低原版幸运属性；不是降低武器伤害或附魔等级。

抵消对象：`silentgear:lucky`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "minecraft:generic.luck",
        "operation": 0,
        "value": [
          -0.5,
          -1.0,
          -1.5,
          -2.0,
          -3.0,
          -4.0,
          -5.0
        ]
      }
    ]
  }
}
```

材料来源：紫晶 `amethyst`／饰物。

### 词条：侵蚀 `eroded`

耐久损失越多，采掘速度增加、近战伤害减少。

装备限制：装备类型=tool。

抵消对象：`silentgear:jagged`。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:melee_damage | -0.15 | True | True |
| silentgear:harvest_speed | 0.15 | True | True |

材料来源：下界岩 `netherrack`／主体；下界岩 `netherrack`／手柄／杆；红石合金 `redstone_alloy`／主体。

### 词条：炽烈 `fiery`

近战武器获得火焰附加，远程武器获得火矢；这是附魔效果，不是独立固定额外伤害。

装备限制：装备类型=weapon。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "enchantments": {
    "melee_weapon": [
      {
        "enchantment": "minecraft:fire_aspect",
        "level": [
          1,
          2
        ]
      }
    ],
    "ranged_weapon": [
      {
        "enchantment": "minecraft:flame",
        "level": [
          1
        ]
      }
    ]
  }
}
```

材料来源：烈焰金 `blaze_gold`／尖端；深红铁 `crimson_iron`／尖端。

### 词条：防火 `fireproof`

掉落的装备物品不会被火／熔岩烧毁；不等于穿戴者免疫火焰。

材料来源：下界合金 `netherite`／涂层。

### 词条：火焰保护 `flame_ward`

全套有效防具提供抗火，并覆盖易燃；也有物品防火效果。

装备限制：装备类型=armor。

覆盖对象：`silentgear:flammable`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "armor": [
      {
        "type": "full_set_only",
        "effect": "minecraft:fire_resistance",
        "level": [
          1
        ]
      }
    ]
  }
}
```

材料来源：深红钢 `crimson_steel`／主体。

### 词条：可燃 `flammable`

装备在着火情形下会损失耐久，且可作为燃料。

材料来源：木材 `wood`／主体。

### 词条：柔韧 `flexible`

概率少消耗1点耐久；真正抵消对象是 Bending。部分中英文提示误写为 Brittle，应以JSON为准。

抵消对象：`silentgear:bending`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effect_scale": -1,
  "activation_chance": 0.075
}
```

材料来源：蔚蓝琥珀金 `azure_electrum`／手柄／杆；竹 `bamboo`／手柄／杆；烈焰金 `blaze_gold`／手柄／杆；烈焰棒 `blaze_rod`／手柄／杆；骨 `bone`／手柄／杆；青铜 `bronze`／手柄／杆；深红铁 `crimson_iron`／手柄／杆；深红钢 `crimson_steel`／手柄／杆；末地烛 `end_rod`／手柄／杆；细丝 `fine_silk`／绑定；细丝 `fine_silk`／弓弦；细丝织布 `fine_silk_cloth`／衬里；亚麻 `flax`／绑定；毛绒线 `fluffy_string`／绑定；铁 `iron`／手柄／杆；皮革 `leather`／握把；皮革 `leather`／衬里；下界岩 `netherrack`／主体；下界木 `netherwood`／主体；下界木 `netherwood`／手柄／杆；幻翼膜 `phantom_membrane`／衬里；信素 `signalum`／主体；信素 `signalum`／手柄／杆；筋 `sinew`／绑定；筋 `sinew`／弓弦；线 `string`／绑定；钛 `titanium`／手柄／杆；深红木 `wood/crimson`／手柄／杆；弯木 `wood/warped`／手柄／杆；木材 `wood`／手柄／杆；羊毛 `wool`／握把；羊毛 `wool`／衬里。

### 词条：浮石 `floatstoner`

使用时消耗耐久放置末地石。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:end_stone",
  "damage_on_use": 3,
  "cooldown": 0,
  "sound": "minecraft:block.stone.place",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：掘金者 `gold_digger`

符合标签条件的挖掘掉落可能额外增加金属粒；不等于所有矿石翻倍。

装备限制：装备类型=harvest_tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "base_chance": 0.15,
  "bonus_multiplier": 0.5,
  "ingredient": {
    "tag": "silentgear:gold_digger"
  }
}
```

材料来源：金刚绿宝石 `dimerald`／主体；提尔钢 `tyrian_steel`／尖端。

### 词条：贪婪 `greedy`

提高矿石挖掘速度，不直接增加矿物数量。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "speed_multiplier": 0.2,
  "blocks": [
    "forge:ores"
  ]
}
```

材料来源：烈焰金 `blaze_gold`／主体。

### 词条：坚固 `hard`

耐久损失越多，采掘速度提高、远程伤害下降；与柔软抵消。

装备限制：装备类型=tool。

抵消对象：`silentgear:soft`。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:harvest_speed | 0.05 | True | True |
| silentgear:ranged_damage | -0.1 | True | True |

材料来源：黑石 `blackstone`／主体；黑石 `blackstone`／手柄／杆；致密铁 `compressed_iron`／主体；深红铁 `crimson_iron`／主体；深红钢 `crimson_steel`／主体；强化黑曜石 `refined_obsidian`／主体；强化黑曜石 `refined_obsidian`／手柄／杆；钛 `titanium`／主体；钛 `titanium`／手柄／杆。

### 词条：沉重 `heavy`

穿戴防具后降低移动速度。

装备限制：装备类型=armor。

抵消对象：`silentgear:light`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "armor/head": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          -0.01,
          -0.02,
          -0.03,
          -0.04,
          -0.05
        ]
      }
    ],
    "armor/chest": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          -0.01,
          -0.02,
          -0.03,
          -0.04,
          -0.05
        ]
      }
    ],
    "armor/legs": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          -0.01,
          -0.02,
          -0.03,
          -0.04,
          -0.05
        ]
      }
    ],
    "armor/feet": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          -0.01,
          -0.02,
          -0.03,
          -0.04,
          -0.05
        ]
      }
    ]
  }
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：神圣 `holy`

对亡灵类目标造成额外伤害。

装备限制：装备类型=weapon。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "damage_type": "holy",
  "damage_bonus": 2
}
```

材料来源：barrier `barrier`／主体；青金石 `lapis_lazuli`／尖端。

### 词条：点燃 `ignite`

消耗少量耐久点火，类似打火石操作。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:fire",
  "damage_on_use": 1,
  "cooldown": 0,
  "sound": "minecraft:item.flintandsteel.use",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：帝国宝藏 `imperial`

符合标签的宝石掉落可能额外增加；并非所有方块通用时运。

装备限制：装备类型=harvest_tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "base_chance": 0.08,
  "bonus_multiplier": 1.0,
  "ingredient": {
    "tag": "silentgear:imperial_drops"
  }
}
```

材料来源：金刚绿宝石 `dimerald`／尖端；提尔钢 `tyrian_steel`／尖端。

### 词条：坚不可摧 `indestructible`

防止后续耐久损失；不会自动把已有损耗修满，也不提供掉落物免疫一切伤害。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：无聊的话 `jabberwocky`

持有该词条、无精准采集地挖掘钻石矿石标签方块时，随机生成狼、猫、兔、鸡、鳕鱼、鲑鱼或河豚之一；属于彩蛋功能。

装备限制：装备类型=harvest_tool。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：锯齿 `jagged`

耐久损失越多，近战伤害增加、远程伤害下降。

抵消对象：`silentgear:eroded`。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:melee_damage | 0.1667 | True | True |
| silentgear:ranged_damage | -0.1667 | True | True |

材料来源：黑石 `blackstone`／主体；黑石 `blackstone`／手柄／杆；末地石 `end_stone`／主体；燧石 `flint`／主体；燧石 `flint`／手柄／杆；下界木 `netherwood`／主体；黑曜石 `obsidian`／主体；石英 `quartz`／主体；石英 `quartz`／尖端；深红木 `wood/crimson`／主体；弯木 `wood/warped`／主体；木材 `wood`／主体。

### 词条：猫眼 `kitty_vision`

头盔或饰物提供夜视。

装备限制：(装备类型=helmet 或 装备类型=curio)。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "helmet": [
      {
        "type": "trait_level",
        "effect": "minecraft:night_vision",
        "level": [
          1
        ]
      }
    ],
    "curio": [
      {
        "type": "trait_level",
        "effect": "minecraft:night_vision",
        "level": [
          1
        ]
      }
    ]
  }
}
```

材料来源：金刚绿宝石 `dimerald`／饰物。

### 词条：光辉 `light`

穿戴防具后增加移动速度。

装备限制：装备类型=armor。

抵消对象：`silentgear:heavy`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "armor/head": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          0.01,
          0.02,
          0.03,
          0.04,
          0.05
        ]
      }
    ],
    "armor/chest": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          0.01,
          0.02,
          0.03,
          0.04,
          0.05
        ]
      }
    ],
    "armor/legs": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          0.01,
          0.02,
          0.03,
          0.04,
          0.05
        ]
      }
    ],
    "armor/feet": [
      {
        "attribute": "minecraft:generic.movement_speed",
        "operation": 1,
        "value": [
          0.01,
          0.02,
          0.03,
          0.04,
          0.05
        ]
      }
    ]
  }
}
```

材料来源：蔚蓝琥珀金 `azure_electrum`／主体；幻翼膜 `phantom_membrane`／衬里。

### 词条：幸运 `lucky`

增加原版幸运属性，仅影响使用幸运参数的战利品表；不等于时运，不直接增加普通矿石掉落。

抵消对象：`silentgear:cursed`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "minecraft:generic.luck",
        "operation": 0,
        "value": [
          0.5,
          1.0,
          1.5,
          2.0,
          3.0,
          4.0,
          5.0
        ]
      }
    ]
  }
}
```

材料来源：细丝 `fine_silk`／绑定；青金石 `lapis_lazuli`／尖端；青金石 `lapis_lazuli`／饰物。

### 词条：光辉 `lustrous`

在光照条件下提高采掘速度；不是夜视或伤害加成。

装备限制：装备类型=harvest_tool。

材料来源：铋 `bismuth`／主体；铋黄铜 `bismuth_brass`／主体；铋钢 `bismuth_steel`／主体；钻石 `diamond`／主体；钻石 `diamond`／手柄／杆；钻石 `diamond`／尖端；琥珀金 `electrum`／手柄／杆；萤石 `glowstone`／尖端；强化荧石 `refined_glowstone`／主体；强化荧石 `refined_glowstone`／手柄／杆；信素 `signalum`／主体；信素 `signalum`／手柄／杆。

### 词条：熔岩 `magmatic`

自动熔炼采掘掉落；熔炼产物不应用时运，避免刷物品。

装备限制：装备类型=harvest_tool。

材料来源：深红钢 `crimson_steel`／尖端。

### 词条：磁力 `magnetic`

吸引附近掉落物，等级提高吸引范围。

材料来源：致密铁 `compressed_iron`／手柄／杆；铁 `iron`／主体；铁 `iron`／手柄／杆；精炼铁 `refined_iron`／手柄／杆。

### 词条：韧性 `malleable`

概率少消耗1点耐久；与脆性抵消。

抵消对象：`silentgear:brittle`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effect_scale": -1,
  "activation_chance": 0.1
}
```

材料来源：铝 `aluminum`／主体；铝 `aluminum`／手柄／杆；铝钢 `aluminum_steel`／主体；铝钢 `aluminum_steel`／手柄／杆；蔚蓝琥珀金 `azure_electrum`／主体；蔚蓝琥珀金 `azure_electrum`／尖端；蔚蓝银 `azure_silver`／主体；蔚蓝银 `azure_silver`／尖端；铋 `bismuth`／主体；铋 `bismuth`／手柄／杆；铋黄铜 `bismuth_brass`／主体；铋黄铜 `bismuth_brass`／手柄／杆；铋钢 `bismuth_steel`／主体；铋钢 `bismuth_steel`／手柄／杆；烈焰金 `blaze_gold`／主体；烈焰棒 `blaze_rod`／手柄／杆；黄铜 `brass`／主体；黄铜 `brass`／手柄／杆；致密铁 `compressed_iron`／主体；致密铁 `compressed_iron`／手柄／杆；深红铁 `crimson_iron`／主体；深红钢 `crimson_steel`／主体；琥珀金 `electrum`／主体；末地石 `end_stone`／手柄／杆；末影 `enderium`／主体；末影 `enderium`／手柄／杆；金 `gold`／主体；金 `gold`／尖端；高碳钢 `high_carbon_steel`／主体；殷钢 `invar`／主体；殷钢 `invar`／手柄／杆；铁 `iron`／主体；铁 `iron`／尖端；铅 `lead`／主体；流明 `lumium`／主体；流明 `lumium`／手柄／杆；镍 `nickel`／主体；镍 `nickel`／手柄／杆；锇 `osmium`／主体；锇 `osmium`／手柄／杆；铂 `platinum`／主体；铂 `platinum`／手柄／杆；红石合金 `redstone_alloy`／主体；红石合金 `redstone_alloy`／手柄／杆；强化荧石 `refined_glowstone`／主体；强化荧石 `refined_glowstone`／手柄／杆；精炼铁 `refined_iron`／主体；精炼铁 `refined_iron`／手柄／杆；强化黑曜石 `refined_obsidian`／主体；强化黑曜石 `refined_obsidian`／手柄／杆；银 `silver`／主体；银 `silver`／手柄／杆；钢 `steel`／主体；钢 `steel`／手柄／杆；锡 `tin`／主体；锡 `tin`／手柄／杆；钛 `titanium`／主体；铀 `uranium`／主体；铀 `uranium`／手柄／杆；锌 `zinc`／主体；锌 `zinc`／手柄／杆。

### 词条：超凡 `mighty`

工具／饰物给予急迫，工具在较高等级还给予力量；等级映射见参数。

装备限制：(装备类型=tool 或 装备类型=curio)。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "tool": [
      {
        "type": "trait_level",
        "effect": "minecraft:strength",
        "level": [
          0,
          0,
          1,
          1,
          2
        ]
      },
      {
        "type": "trait_level",
        "effect": "minecraft:haste",
        "level": [
          1,
          1,
          1,
          2,
          3
        ]
      }
    ],
    "curio": [
      {
        "type": "trait_level",
        "effect": "minecraft:haste",
        "level": [
          1,
          1,
          2,
          2,
          3
        ]
      }
    ]
  }
}
```

材料来源：石英 `quartz`／饰物。

### 词条：月球行走 `moonwalker`

降低实体重力，影响落下与跳跃手感；不是飞行或摔落免疫。

装备限制：(装备类型=boots 或 装备类型=curio)。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "forge:entity_gravity",
        "operation": 1,
        "value": [
          -0.15,
          -0.3,
          -0.45000002,
          -0.6,
          -0.75
        ]
      }
    ]
  }
}
```

材料来源：蔚蓝银 `azure_silver`／主体。

### 词条：多重破坏 `multi_break`

数据保留的未实现词条，不能当作连锁采矿功能。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：nc_radiation_protection `nc_radiation_protection`

NuclearCraft兼容示例，写入 ncRadiationResistance NBT；标注未测试，不能当作 Mekanism 辐射防护。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "nbt": {
    "armor": [
      {
        "level": 1,
        "data": {
          "ncRadiationResistance": 0.05
        }
      },
      {
        "level": 2,
        "data": {
          "ncRadiationResistance": 0.1
        }
      },
      {
        "level": 3,
        "data": {
          "ncRadiationResistance": 0.15
        }
      },
      {
        "level": 4,
        "data": {
          "ncRadiationResistance": 0.2
        }
      },
      {
        "level": 5,
        "data": {
          "ncRadiationResistance": 0.25
        }
      }
    ]
  }
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：有机 `organic`

耐久损失越多，附魔能力提高、魔法伤害字段降低。

抵消对象：`silentgear:eroded`。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:enchantment_value | 0.1 | True | True |
| silentgear:magic_damage | -0.15 | True | True |

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：岩石 `racker`

消耗耐久放置下界岩。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:netherrack",
  "damage_on_use": 3,
  "cooldown": 0,
  "sound": "minecraft:block.netherrack.place",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：长臂 `reach`

增加方块交互距离，不是明确的近战攻击距离加成。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "forge:block_reach",
        "operation": 0,
        "value": [
          0.5,
          1.0,
          1.5,
          2.0,
          3.0
        ]
      }
    ]
  }
}
```

材料来源：烈焰棒 `blaze_rod`／手柄／杆；绿宝石 `emerald`／饰物。

### 词条：红牌 `red_card`

让装备可以永久损坏，覆盖通常的“耐久耗尽只变成损坏状态”保护。不是增伤词条，昂贵装备不建议添加。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：折射 `refractive`

消耗耐久放置幻光照明方块。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "silentgear:phantom_light",
  "damage_on_use": 5,
  "cooldown": 0,
  "sound": "minecraft:block.amethyst_block.step",
  "sound_volume": 0.75,
  "sound_pitch": 0.5
}
```

材料来源：末地烛 `end_rod`／手柄／杆；萤石 `glowstone`／尖端；流明 `lumium`／主体；流明 `lumium`／手柄／杆；强化荧石 `refined_glowstone`／尖端。

### 词条：复生 `renew`

每秒以1.8%×等级的概率修复，触发时修复1×等级点耐久；不是每秒必定修复。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "activation_chance": 0.018,
  "repair_amount": 1
}
```

材料来源：紫晶 `amethyst`／主体；幻翼膜 `phantom_membrane`／主体。

### 词条：造路 `road_maker`

将适合的草方块转换成草径，属于使用功能。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "target": {
    "block": "minecraft:grass_block"
  },
  "fill_block": "minecraft:dirt_path",
  "replace_tile_entities": false,
  "fill_spread_x": 1,
  "fill_spread_y": 0,
  "fill_spread_z": 1,
  "fill_facing_plane_only": false,
  "sneak_mode": "pass",
  "damage_on_use": 0.5,
  "cooldown": 0,
  "sound": "minecraft:block.grass.break",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：淳朴 `rustic`

基础协同较低时提供补偿；有效区间以参数为准。

抵消对象：`silentgear:synergistic`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "synergy_multi": 0.05,
  "applicable_range": {
    "min": 0.749,
    "max": 1.001
  }
}
```

材料来源：陶瓦 `terracotta`／主体。

### 词条：锋利 `sharp`

耐久损失越多，采掘速度和近战伤害增加；本地中文把后者写成攻击速度，是误译。

装备限制：装备类型=tool。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:harvest_speed | 0.125 | True | True |
| silentgear:melee_damage | 0.125 | True | True |

材料来源：青铜 `bronze`／主体。

### 词条：丝滑 `silky`

给采掘工具添加精准采集附魔。

装备限制：装备类型=harvest_tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "enchantments": {
    "harvest_tool": [
      {
        "enchantment": "minecraft:silk_touch",
        "level": [
          1
        ]
      }
    ]
  }
}
```

材料来源：紫晶 `amethyst`／尖端；黄铜 `brass`／主体。

### 词条：雪地行者 `snow_walker`

穿戴相关防具或饰物可走过细雪而不陷入。

材料来源：细丝织布 `fine_silk_cloth`／主体；皮革 `leather`／主体；羊毛 `wool`／主体。

### 词条：柔软 `soft`

耐久损失越多，采掘速度下降；与坚硬抵消。

装备限制：装备类型=tool。

抵消对象：`silentgear:hard`。

下列变化量还要乘词条等级；`factor_damage=true` 再乘已损失耐久比例，`factor_value=true` 再乘该项当前值。

| 属性 | 每级系数 | 乘损耗比例 | 乘属性值 |
| --- | --- | --- | --- |
| silentgear:harvest_speed | -0.15 | True | True |

材料来源：铝 `aluminum`／主体；蔚蓝银 `azure_silver`／主体；蔚蓝银 `azure_silver`／尖端；烈焰金 `blaze_gold`／尖端；烈焰金 `blaze_gold`／涂层；铜 `copper`／主体；铜 `copper`／手柄／杆；琥珀金 `electrum`／主体；金 `gold`／主体；金 `gold`／尖端；金 `gold`／涂层；铅 `lead`／手柄／杆；铂 `platinum`／主体；铂 `platinum`／手柄／杆；银 `silver`／主体；银 `silver`／手柄／杆；锡 `tin`／主体；锡 `tin`／手柄／杆；锌 `zinc`／主体；锌 `zinc`／手柄／杆。

### 词条：勺子 `spoon`

让镐可以有效挖掘土类方块。

装备限制：装备类型=pickaxe。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：恒星 `stellar`

概率自修复；防具根据装备件数提供速度和跳跃提升。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "potion_effects": {
    "armor": [
      {
        "type": "piece_count",
        "effect": "minecraft:speed",
        "level": [
          0,
          1,
          2,
          3
        ]
      },
      {
        "type": "piece_count",
        "effect": "minecraft:jump_boost",
        "level": [
          1,
          2,
          3,
          4
        ]
      }
    ]
  }
}
```

材料来源：精炼铁 `refined_iron`／主体。

### 词条：坚实 `sturdy`

较高概率减少1点耐久损耗，不等于绝对不损坏。

抵消对象：`silentgear:brittle`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effect_scale": -1,
  "activation_chance": 0.175
}
```

材料来源：深红钢 `crimson_steel`／手柄／杆；末地烛 `end_rod`／手柄／杆；提尔钢 `tyrian_steel`／主体；提尔钢 `tyrian_steel`／手柄／杆。

### 词条：速泳 `swift_swim`

增加游泳速度。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "attribute_modifiers": {
    "all": [
      {
        "attribute": "forge:swim_speed",
        "operation": 0,
        "value": [
          0.2,
          0.4,
          0.6,
          0.8,
          1.0
        ]
      }
    ]
  }
}
```

材料来源：海晶石 `prismarine`／饰物。

### 词条：协同作用 `synergistic`

基础协同达到适用条件时提高协同；不是简单把所有属性直接加4%。

抵消对象：`silentgear:crude`。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "synergy_multi": 0.04,
  "applicable_range": {
    "min": 1.0
  }
}
```

材料来源：铝 `aluminum`／主体；铝 `aluminum`／手柄／杆；铝钢 `aluminum_steel`／主体；铝钢 `aluminum_steel`／手柄／杆；绿宝石 `emerald`／主体；绿宝石 `emerald`／尖端。

### 词条：终端 `terminus`

消耗耐久放置石头。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:stone",
  "damage_on_use": 3,
  "cooldown": 0,
  "sound": "minecraft:block.stone.place",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：龟息 `turtle`

延长水下屏息时间，不等于永久水下呼吸。

装备限制：(装备类型=helmet 或 装备类型=curio)。

材料来源：海龟壳 `turtle`／主体。

### 词条：毒液 `venom`

攻击时使目标中毒，持续时间随等级增长。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "effects": {
    "tool": {
      "1": [
        {
          "effect": "minecraft:poison",
          "amplifier": 0,
          "duration": 4.0
        }
      ],
      "2": [
        {
          "effect": "minecraft:poison",
          "amplifier": 0,
          "duration": 8.0
        }
      ],
      "3": [
        {
          "effect": "minecraft:poison",
          "amplifier": 0,
          "duration": 12.0
        }
      ],
      "4": [
        {
          "effect": "minecraft:poison",
          "amplifier": 0,
          "duration": 16.0
        }
      ],
      "5": [
        {
          "effect": "minecraft:poison",
          "amplifier": 0,
          "duration": 20.0
        }
      ]
    }
  }
}
```

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

### 词条：虚空庇佑 `void_ward`

在虚空伤害触发时帮助玩家向上脱离，并给予漂浮／缓降；不是创造模式无敌。

装备限制：装备类型=armor。

材料来源：提尔钢 `tyrian_steel`／主体。

### 词条：火匠 `vulcan`

高耐久成本放置黑曜石，带冷却。

装备限制：装备类型=tool。

本地精确参数（数组按等级／件数顺序；`amplifier=0`表示药水I级）：

```json
{
  "block": "minecraft:obsidian",
  "damage_on_use": 20,
  "cooldown": 100,
  "sound": "minecraft:block.stone.place",
  "sound_volume": 1.0,
  "sound_pitch": 1.0
}
```

材料来源：强化黑曜石 `refined_obsidian`／尖端。

### 词条：拓宽 `widen`

扩大锤子和开掘铲的范围；I／II／III对应5×5／7×7／9×9。

装备限制：装备类型=harvest_tool。

材料来源：没有材料直接授予；可能来自专用部件、兼容或保留定义。

## 品级、协同、星光与本包设置

品级顺序为未鉴定、E、D、C、B、A、S、SS、SSS、MAX；对应品级百分比为0、1、2、3、4、5、10、15、25、30。仅支持品级的属性才受影响；攻速不因MAX自动增加30%。星光充能是另一种材料强化，受 `charging_value` 影响，不能把等级数字直接当成统一倍率。

复合材料的结果受成分、比例、主次顺序与协同影响，不等于把各材料最优属性全部取出来。追求高伤害时，先保证主体伤害，再试验比例和词条门槛；至少分别查看满耐久和磨损后的面板。

本地 `config/silentgear-common.toml`：

- `allowLegacyMaterialMixing=false`：旧版直接在工作台混合材料的方式关闭；使用合金／复合加工设备。
- `breaksPermanently=false`：耐久耗尽通常成为损坏装备，可修复；Red Card词条仍可令其永久损坏。不等于使用中属性完全不变。
- `allowEnchanting=true`、`forceRemoveEnchantments=false`：正常附魔允许。
- `destroySwappedParts=false`：替换部件不会按此配置直接销毁旧部件。
- `applyInAnvilOnly=false`：升级不被此配置强制限制在铁砧中。
- 缺少修理包时的松散材料修理效率为0；五档修理包效率约30%、35%、40%、45%、50%；铁砧修理系数0.5。

## 证据、结论与复核路径

| 证据 | 得出的结论 | 复核路径 |
| --- | --- | --- |
| E1：Silent Gear 3.6.7 的128个材料JSON | 全表基础值、槽位和条件 | [原始提取数据](atm9-equipment-data/silentgear-extracted.json) → materials；JAR内 `data/silentgear/silentgear_materials/` |
| E2：70个词条JSON和中英语言文件 | 词条含义、等级上限、中文误译与Bending参数冲突 | 同一提取数据 → traits / en_us / zh_cn |
| E3：435个JAR与KubeJS数据扫描 | 未发现ATM三金属的SG材料扩展 | [扫描清单](atm9-equipment-data/pack-scan.json) → sources / mods |
| E4：本地配置 | 旧混料关闭、损坏可修复、允许附魔 | `../config/silentgear-common.toml` |
| E5：官方1.20.x源码辅助解释 | 继承、均分韧性、数值运算顺序 | [ItemStat](https://github.com/SilentChaos512/Silent-Gear/blob/1.20.x/src/main/java/net/silentchaos512/gear/api/stats/ItemStat.java)、[ItemStats](https://github.com/SilentChaos512/Silent-Gear/blob/1.20.x/src/main/java/net/silentchaos512/gear/api/stats/ItemStats.java)、[AbstractMaterial](https://github.com/SilentChaos512/Silent-Gear/blob/1.20.x/src/main/java/net/silentchaos512/gear/gear/material/AbstractMaterial.java) |
| E6：本地事件与装备辅助类字节码 | Confetti烟花、Jabberwocky生物生成、Red Card永久损坏、魔法防御分段公式 | [事件核验输出](atm9-equipment-data/silentgear-events-bytecode.txt) |

官方说明仅辅助解释数据格式：[1.16–1.20材料格式](https://github.com/SilentChaos512/Silent-Gear/wiki/Materials-%281.16-to-1.20%29)。本地资源为数值主证据；源码分支会变化，下载快照保存在 `atm9-equipment-data/source/`。没有启动游戏进行伤害实测。

可在整合包目录用任意Python 3执行 `python docs/atm9-equipment-data/scan_pack.py` 重扫资源。扫描脚本不会修改模组、配置或存档。
