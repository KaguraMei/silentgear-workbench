# ATM9 高伤害武器与防具列表

扫描日期：2026-10-14。依据当前目录安装的 Minecraft 1.20.1 整合包文件，包括 Silent Gear 3.6.7、Allthemodium 2.5.6、Mahou Tsukai 1.34.78、Mystical Agriculture 7.0.23、Draconic Evolution 3.1.2.621、Mekanism 10.4.15.75、Apotheosis 7.4.8。

本文同时覆盖 **Silent Gear 配装**和**整合包其他强力装备**。材料全表及70个词条说明见 [Silent Gear 材料文档](2026-10-14_SilentGear_材料属性与词条.md)。这是基于文件核验的候选清单和推荐，不是把435个模组的所有武器都在游戏内测试过后的绝对排行榜。

## 先选路线

| 目标 | 推荐路线 | 原因 |
| --- | --- | --- |
| 中期便宜、可逐步升级的近战武器 | 精炼黑曜石 Silent Gear 剑／太刀，石英尖端，增伤手柄 | 本地SG固定主体中，精炼黑曜石近战基值10最高；升级部件灵活 |
| 固定面板很高、无需长期刷成长 | Allthemodium 合金剑 | 本地未强化基础攻击47、攻击速度9；合成成本较高 |
| 愿意投入时间刷极高单击 | Morgan | 默认成长上限5000，成长数据与魔力供给决定实际伤害 |
| 玩工业模块系统 | Meka-Tool、龙之研究剑／权杖／弓 | 伤害取决于模块与供能，不能只比较刚合成的面板 |
| 中期SG护甲 | 精炼黑曜石主体，按用途选衬里和涂层 | 主体护甲总值30、韧性总值16；可更换功能部件 |
| 高护甲、少操心 | Unobtainium 四件套 | 未强化护甲总值40，韧性总值60，另有环境防护 |
| 自动化供能后的综合防御 | MekaSuit 四件套 | 能量吸收伤害与模块功能是核心，护甲数字不能代表全部防御 |
| 极后期能量护盾路线 | Draconic／Chaotic Chestpiece | 护盾与恢复、保命模块重要；是胸部装备，不是传统四件套 |

## 伤害数字的口径

1点伤害等于半颗心。本文“基础攻击”指普通角色持有装备时，未附魔、无药水、无Apotheosis词缀宝石的攻击属性参考值。角色基础攻击1点、基础攻速4次/秒；例如 Allthemodium 合金剑的攻击为 `1 + 11 + 35 = 47`，攻速为 `4 + 5 = 9`。

**攻击速度×攻击属性不是实际DPS**：攻击冷却、目标受伤无敌时间、护甲、抗性、暴击、词缀触发与Boss限伤都会影响结果。Morgan上限属于成长系统的数值，Clarent上限属于储存伤害，弓的命中伤害还与箭和速度有关，这几种数值不能直接放在同一列进行严格排名。

本目录没有 `saves`。Mahou数值来自 `defaultconfigs`，代表整合包的默认世界配置，已有存档和远程服务器可能不同。

## 高伤害武器列表

### 固定基础数值已核对的武器

Allthemodium、神秘农业数值核验了本地JAR的Java字节码；Silent Gear一栏按本地材料与部件JSON推导。SG示例均为未鉴定、未充能、无合金协同、满耐久且手柄不额外改伤害／攻速的纯主体基准。

| 武器 | 物品ID | 基础攻击 | 基础攻速（次/秒） | 定位与限制 |
| --- | --- | ---: | ---: | --- |
| Allthemodium 合金剑 | `allthemodium:alloy_sword` | **47** | **9.0** | 固定面板很强，主要成本在三组合金；不消耗普通耐久 |
| 觉醒至高精华剑 | `mysticalagriculture:awakened_supremium_sword` | **29** | 1.6 | 农业进度路线，可通过强化组件继续提升 |
| Unobtainium 剑 | `allthemodium:unobtainium_sword` | **28** | **7.2** | 高攻速、不消耗普通耐久；适合接Apotheosis强化 |
| 至高精华剑 | `mysticalagriculture:supremium_sword` | **24** | 1.6 | 觉醒前的成熟武器，可安装适用强化组件 |
| Vibranium 剑 | `allthemodium:vibranium_sword` | **22** | **6.8** | ATM金属装备路线的中间阶段 |
| Allthemodium 剑 | `allthemodium:allthemodium_sword` | **16** | **5.5** | 后续合金剑仪式的核心原料，耐久省心 |
| 精炼黑曜石SG太刀 | `silentgear:katana` | **15** | **1.7** | 主体10+刀刃4+角色1；单击高于同材料剑 |
| 精炼黑曜石SG剑 | `silentgear:sword` | **14** | **1.9** | 主体10+剑刃3+角色1；攻速高于同材料太刀 |
| 泰瑞安钢SG太刀 | `silentgear:katana` | **13** | **1.4** | 主体8+刀刃4+角色1；耐久路线 |
| 泰瑞安钢SG剑 | `silentgear:sword` | **12** | **1.6** | 主体8+剑刃3+角色1；并非SG裸伤最高 |

**同一个 `silentgear:sword` ID 可以对应完全不同的材料装备**，因此不能用ID本身判断伤害。以上SG数值是便于比较的起点，安装尖端、手柄、握把、涂层并强化材料后会更高。

### 成长、储能和模块武器

| 武器 | 物品ID | 本地已确认的依据 | 推荐场景 / 代价 |
| --- | --- | --- | --- |
| Morgan（摩根） | `mahoutsukai:morgan` | 默认Power Consolidation攻击上限 **5000**；上限档位最终也是5000 | 长期培养的极高伤近战；需要成长次数与魔力供给，刚做出来不等于5000伤害 |
| Caliburn | `mahoutsukai:caliburn` | 与上述成长路线关联；提升档位材料为 `irons_spellbooks:ender_upgrade_orb` | 先提高内在上限，再按本包条件转化Morgan；也可单独使用 |
| Clarent | `mahoutsukai:clarent` | 储存伤害上限 **5,000,000**；储存伤害缩放0.5；每伤害魔力成本10 | 特殊储能／反击路线；500万是储存上限，**不是普通常驻攻击伤害** |
| 混沌剑 | `draconicevolution:chaotic_sword` | 本地模组有该装备，数值受伤害模块、格子、能量和装备配置影响 | 极后期模块近战；不宣称存在唯一固定满配伤害 |
| 混沌能量权杖 | `draconicevolution:chaotic_staff` | 本地模组有该装备与模块系统 | 多功能后期装备，按近战模块方案比较 |
| 混沌弓 | `draconicevolution:chaotic_bow` | 本地模组有该装备；发射方式、伤害模块、弹速及供能参与 | 极后期远程爆发／持续射击候选 |
| 神龙剑／弓 | `draconicevolution:draconic_sword` / `draconicevolution:draconic_bow` | 混沌前的可用模块化装备 | 先完成神龙级供能与模块，再考虑混沌升级 |
| Meka-Tool | `mekanism:meka_tool` | 本地安装Mekanism，支持攻击增幅等模块 | 工业全能工具路线，输出依赖攻击模块数量、配置与电量 |

Morgan 的本地关键设置：

| 设置 | 值 | 玩家应如何理解 |
| --- | ---: | --- |
| `POWER_CONSOLIDATION_ATTACK_CAP` | 5000 | 默认攻击成长上限，不是网传旧版500万 |
| `POWER_CONSOLIDATION_TIERS` 最后一档 | 5000 | 必须先满足内在上限提升路线 |
| `POWER_CONSOLIDATION_TIER_UPGRADE_ITEM` | 末影升级宝珠 | 本包提升档位用的物品 |
| `MORGAN_TRANSFORM_ENTITY_WHITELIST` | `minecraft:warden` | 本包用Caliburn击杀监守者转化 |
| `MORGAN_CHILD_INCREASE` | 1.0 | 击杀游戏内幼年村民的成长值 |
| `MORGAN_ADULT_INCREASE` | 0.2 | 击杀成年村民的成长值 |
| `MORGAN_UPGRADE_MANA_COST` | 400 | 每次成长需要的魔力 |

因此，不应照搬旧视频里的500万Morgan，也不应照搬“成年村民+0.5”的数值。上述数值可在 [本地默认配置](../defaultconfigs/mahoutsukai-server.toml) 查到；转化与上限路线也与 [ATM官方指南](https://allthemods.github.io/alltheguides/atm9/mahoutsukai/) 一致。

## Silent Gear 高伤害配装

### 主体优先级

| 主体材料 | 基础近战值 | 工具耐久 | 攻速修正 | 选择原因 |
| --- | ---: | ---: | ---: | --- |
| 精炼黑曜石 `refined_obsidian` | **10** | 2500 | +0.3 | 当前扫描固定主体中近战基值最高；自带正攻速 |
| 泰瑞安钢 `tyrian_steel` | 8 | 3652 | 0 | 高耐久，有减少耐久损耗词条 |
| 蔚蓝琥珀金 `azure_electrum` | 7 | 1259 | 0 | 高附魔能力、加速词条；远程弹速方向也值得考虑 |
| 绯红钢 `crimson_steel` | 6 | 2400 | −0.1 | 中后期高耐久路线；主体防具还能走全套抗火 |
| 钛 `titanium` | 6 | 以材料表为准 | 以材料表为准 | 特别值得关注的是钛手柄的复合增伤，不只是主体 |

### 直接可照着选的部件方案

以下是基于数据的建议组合，**尚未在游戏内制作并测试最终数值**。先在JEI确认本包部件配方和升级兼容，再把昂贵的材料鉴定与充能；文档不声称它们是穷举所有合金后的数学最优解。

| 部位 | 偏高伤害选择 | 数据依据 | 取舍 |
| --- | --- | --- | --- |
| 主体 | 精炼黑曜石剑刃／太刀刃 | 近战10、攻速+0.3 | 剑偏攻速，太刀偏单击 |
| 手柄 | 钛 | 近战 `mul2 +0.2` 再 `add +2` | 钛的取得依赖本包工业进度；先看JEI |
| 易做的增伤手柄 | 骨、烈焰棒 | 近战 `mul2 +0.2` | 同时检查各自的耐久与词条代价 |
| 更偏耐用／功能的手柄 | 末地烛 | 近战 `mul2 +0.1`，柔韧IV、结实II、折射I | 比骨／烈焰棒少一点直接增伤，但耐用与照明方便 |
| 尖端 | **石英** | 近战 `add +4`，锯齿III、剥落I | 是本地固定尖端中最高直接近战加值；磨损时锯齿还提高近战，但不适合照搬到远程武器 |
| 握把 | 幻翼膜或羊毛 | 攻速 `add +0.2` | 幻翼膜附带经验方向词条；羊毛更易获取 |
| 便宜握把 | 皮革 | 攻速 `add +0.15` | 方便的过渡方案 |
| 涂层 | 下界合金 | 近战、魔法、远程 `mul2 +0.33333334`；耐久提升；物品防火 | 不是给人物抗火；完整数值见材料文档 |

推荐制作顺序：先做精炼黑曜石主体 → 装增伤手柄与石英尖端 → 加握把 → 材料鉴定、星光充能及涂层 → 再投入高价值附魔与Apotheosis词缀／宝石。升级槽兼容及配方以JEI为准。

特别注意：**石英适合作尖端，不代表石英主体最强**。石英主体近战只有2，还带磨损时降低近战的 Crushing；尖端则直接+4近战并带 Jagged III。类似地，黑曜石主体自身同时有增伤和减伤词条，不能只看“锯齿”就认定比精炼黑曜石更强。

### 武器类型怎么选

| 类型 | 部件对近战的修改 | 部件攻速修改 | 用途 |
| --- | --- | ---: | --- |
| 剑 `sword` | +3 | −2.4 | 均衡近战起点 |
| 太刀 `katana` | +4 | −2.6 | 更高单击，略慢；部件耐久另有加成 |
| 长矛 `spear` | +3 | −2.7 | 攻击距离统计+1，适合重视距离的场景；实际交互需实测 |
| 砍刀 `machete` | +2 | −2.2 | 更偏速度，单次低于剑 |
| 斧 `axe` | +5 | −3.0 | 高单次、慢速；材料的 `/axe` 攻速特例会覆盖通用值 |
| 匕首 `dagger` | 先 `mul1 -0.5`，末尾+2 | −1.2 | 快速但基础伤害受折减，不能只看+2忽略倍率 |

## 防具列表

### 可直接比较的基础护甲

统一按 **头／胸／腿／靴** 排序。韧性“总计”是四件相加，不是每件都有这个值。SG数值为纯主体的起点，不含品级、协同、涂层、衬里及词条额外护甲。

| 防具 | 头／胸／腿／靴 | 护甲总计 | 单件韧性 | 韧性总计 | 定位 |
| --- | --- | ---: | ---: | ---: | --- |
| Unobtainium 套装 | 8／13／11／8 | **40** | **15** | **60** | 高固定护甲与韧性，实用后期选择 |
| 觉醒至高精华套装 | 6／12／10／8 | **36** | 3.5 | 14 | 农业路线；强化组件的实用性很重要 |
| Vibranium 套装 | 6／11／9／6 | **32** | 9 | 36 | ATM金属路线的中后期装备 |
| 精炼黑曜石SG套装 | 5／12／8／5 | **30** | 4 | 16 | SG固定主体中护甲基值最高，可自定义配装 |
| 至高精华套装 | 5／10／8／6 | **29** | 3 | 12 | 可通过强化组件扩展功能 |
| 泰瑞安钢SG套装 | 5／9／7／4 | **25** | 3 | 12 | 高耐久、结实、虚空保护方向 |
| Allthemodium 套装 | 4／9／7／4 | **24** | 5 | 20 | 比原版套装多种环境便利能力 |
| 绯红钢SG套装 | 4／8／6／4 | **22** | 2.5 | 10 | 全套抗火词条路线 |
| 蔚蓝琥珀金SG套装 | 3／7／6／3 | **19** | 2 | 8 | 轻盈移动方向，裸防不是首选 |

Allthemodium 三套装物品ID为 `allthemodium:<材料>_helmet`、`_chestplate`、`_leggings`、`_boots`。农业套装为 `mysticalagriculture:supremium_*` 与 `mysticalagriculture:awakened_supremium_*`。SG套装物品ID只有 `silentgear:helmet/chestplate/leggings/boots`，具体材料存于装备数据中。

Allthemodium本地手册记载的优势包括水下呼吸、抗火、摔落保护和鞘翅碰撞保护；这些是具体装备能力，不能推导成对所有伤害的无敌。护甲材料击退抗性参数分别是单件0.5／0.8／1.0，最终角色抗性还受属性上限和其他效果约束，不应写成“整套400%击退免疫”。

### 不能只按护甲值排序的防具

| 防具 | ID / 系统 | 核心收益 | 需要准备 | 实际限制 |
| --- | --- | --- | --- | --- |
| MekaSuit 四件套 | `mekanism:mekasuit_helmet`、`mekasuit_bodyarmor`、`mekasuit_pants`、`mekasuit_boots` | 使用能量吸收支持的伤害，模块增加功能 | 稳定充电、储能、对应防护和移动模块 | 不等于所有伤害类型无敌；缺电、绕过护甲的特殊伤害及服务器配置会影响效果 |
| 混沌胸甲 | `draconicevolution:chaotic_chestpiece` | 后期能量护盾平台 | 混沌材料、护盾容量与恢复模块、保命及供能方案 | 单个胸部装备；未安装模块的物品不能代表满配性能 |
| 神龙胸甲 | `draconicevolution:draconic_chestpiece` | 混沌前的能量护盾方案 | 神龙级设备与模块 | 容量、恢复与能耗须共同考虑 |
| 飞龙胸甲 | `draconicevolution:wyvern_chestpiece` | 较早接入龙之研究防御体系 | 飞龙级制作与供能 | 后续仍需升级装备和模块 |
| 觉醒至高精华 + 防御强化组件 | 神秘农业强化系统 | 按需求选生命、吸收、抗性或功能类组件 | 合适强化组件、槽位和等级 | “觉醒”不会自动把所有强化装满；以本地配方及组件适用槽位为准 |
| 带优质Apotheosis词缀和宝石的套装 | 神化冒险装备系统 | 在基础装备上叠加生命、护甲、韧性、其他防御收益 | 重铸、宝石、插槽和附魔资源 | 不同装备接受的词缀、插槽和强化方式不同 |

本地没有找到具体世界的Mekanism装备配置或龙之研究装备配置，因此此处不把官方默认护盾数值冒充当前服务器实测值。MekaSuit的机制可参照 [官方GearConfig](https://github.com/mekanism/Mekanism/blob/1.20.x/src/main/java/mekanism/common/config/GearConfig.java)；具体装备最终以游戏内模块页面和服务器设置为准。

### Silent Gear 防具建议组合

| 目标 | 主体与升级建议 | 原因 / 条件 |
| --- | --- | --- |
| 高基础防护 | 精炼黑曜石主体 + 下界合金涂层 | 主体30护甲、16总韧性；涂层再提供韧性、耐久与击退抗性统计修正 |
| 少摔死 | 鞋子装史莱姆衬里 | `slime` 衬里自带 Bounce I，鞋子用途是摔落保护 |
| 移动轻快 | 幻翼膜衬里 | Light II、Flexible III；主体可继续用高防材料 |
| 耐用 | 皮革或细丝布衬里 | Flexible IV；不要把“减少耐久损耗”当作额外伤害减免 |
| 虚空应急 | 满足条件的泰瑞安钢主体防具 | Void Ward I：材料数量≥3或比例≥50%；还受装备类型限制 |
| 下界抗火 | 四件均具有 Flame Ward 的绯红钢防具 | 主体需达到材料数量≥3或比例≥33%，且需完整套装触发抗火 |
| 夜视功能 | 检查材料表中 Kitty Vision 对应头盔／饰物 | 只有正确装备类型生效；不应把任意位置都当作夜视来源 |

下界合金涂层的 `armor_toughness add 4` 属于SG的均分韧性统计，通常对应**每件+1**，不是每件直接+4。纯主体精炼黑曜石四件套加涂层，在不考虑其他修正时可用总韧性16→20作比较；实际还需考虑品级、协同及计算层级。

## 把装备继续做强

Apotheosis强化往往会改变上述裸装排序。对于高血量目标，结合装备可用词缀，比较暴击率／暴击伤害、护甲穿透／护甲削减、当前生命值伤害和吸血等机制，比只堆一个面板攻击数字更有意义。词缀出现范围和数值以本地该装备的重铸界面与宝石说明为准。

| 词条方向 | 意义 | 容易误解的地方 |
| --- | --- | --- |
| Attack Damage | 提高攻击属性 | 目标实际扣血仍要经过减伤和事件处理 |
| Attack Speed | 更快恢复攻击冷却 | 高面板攻速不保证同一目标每次挥击都能吃到完整伤害 |
| Crit Chance / Crit Damage | 暴击概率与倍率 | 要按实际触发条件看收益，不能总按必暴击计算 |
| Armor Pierce | 护甲穿透，忽略一定护甲 | 不等于所有伤害变成真实伤害 |
| Armor Shred | 削弱目标护甲的方向 | 具体是比例、持续时间还是其他形式要看词缀原文 |
| Current HP Damage | 按目标当前生命增加伤害 | 目标血量下降时收益会变化，不是固定额外伤害 |
| Life Steal | 从攻击中恢复生命 | 不是伤害免疫；触发和治疗量仍取决于机制 |

比较装备时建议固定同一目标、同一附魔和药水、同一攻击冷却；分别记录满耐久和磨损SG装备、充满和低电量模块装备，以及是否触发暴击／百分比伤害。这样才能区分“纸面数字更大”和“实际打得更快”。

## 合金剑的本包配方线索

当前 `kubejs/server_scripts/modpack/atm_alloy_tools.js` 用 Ars Nouveau 附魔装置制作 `allthemodium:alloy_sword`：核心是 Allthemodium 剑，周围使用三种基础金属各1份，以及三种双金属合金各3份，源质消耗5000，保留核心物品NBT。具体物料名称和仪式摆放以JEI为准。

这条路线应当与SG的金属混合器制作合金分开理解；**ATM合金剑不是给Silent Gear塞进ATM三金属的配方**。

## 证据、结论与复核路径

| 证据 | 支持的结论 | 文件 / 路径 |
| --- | --- | --- |
| E1：本地Allthemodium注册与材料类字节码 | 四把剑的伤害、速度，三套护甲和韧性 | [武器注册](atm9-equipment-data/allthemodium-registry-bytecode.txt)、[材料参数](atm9-equipment-data/allthemodium-tiers-bytecode.txt) |
| E2：本地农业材料类及Cucumber剑构造器 | 至高／觉醒至高剑和护甲的基础值 | [农业参数](atm9-equipment-data/mystical-tiers-bytecode.txt)、[剑构造器](atm9-equipment-data/cucumber-sword-bytecode.txt) |
| E3：Silent Gear材料与部件JSON | SG裸装推导、石英尖端、手柄与衬里推荐 | [本地提取数据](atm9-equipment-data/silentgear-extracted.json) → materials / parts |
| E4：本地Mahou默认配置 | Morgan 5000上限、成长值、转化条件、Clarent储存上限 | [默认配置](../defaultconfigs/mahoutsukai-server.toml)，366、381、428、461–488行附近 |
| E5：KubeJS魔改 | ATM合金剑由附魔装置制作 | [合金装备配方脚本](../kubejs/server_scripts/modpack/atm_alloy_tools.js) |
| E6：本地手册、语言与配方资源 | 模块武器／防具确实存在，环境功能的说明 | 对应JAR中的 `assets/*/lang/en_us.json`、手册；`kubejs/assets/allthemodium/patchouli_books/` |

复核固定值可以用JDK的 `javap -p -c -classpath <本地JAR> <完整类名>`；本次输出已经保存，未修改任何模组、游戏配置或存档。源码辅助参考包括 [Allthemodium 1.20.x](https://github.com/AllTheMods/AllTheModium/tree/1.20.x)、[Mystical Agriculture 1.20](https://github.com/BlakeBr0/MysticalAgriculture/tree/1.20)、[Silent Gear 1.20.x](https://github.com/SilentChaos512/Silent-Gear/tree/1.20.x)。源码分支可能更新，固定数值以上述本地JAR核验为准。
