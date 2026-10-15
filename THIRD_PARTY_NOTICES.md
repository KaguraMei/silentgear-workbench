# 第三方数据与素材

`public/textures/` 的像素贴图、材料/部件/词条原始数据来自 Silent Gear 3.6.7（Minecraft 1.20.1），作者 SilentChaos512 / Silent's Mods。项目采用 LGPL-3.0：

- 项目与许可证：https://github.com/SilentChaos512/Silent-Gear
- 计算核查所用源码快照：https://github.com/SilentChaos512/Silent-Gear/tree/8af569e03ad29e0f8aeeea6bef616bd29d1f4a97

网站使用原始装备像素图层，客户端以材料颜色着色叠加。中文材料名采用当前整合包语言数据；词条说明为本地分析文档中的解释。React、Vite、TypeScript、Playwright 的许可证随相应 npm 包分发。

## HarmonyOS Sans SC

本软件使用 **HarmonyOS Sans Fonts**。版权归 Huawei Device Co., Ltd. 所有（Copyright 2021）。许可全文随网站发布于 [HarmonyOS Sans Fonts License Agreement](public/fonts/licenses/HarmonyOS-Sans-LICENSE.txt)。

`public/fonts/HarmonyOS_Sans_SC_Medium.woff2` 与 `HarmonyOS_Sans_SC_Bold.woff2` 为本机已有 WOFF2 的原样副本，实际来源为 `E:\Endfield Game\sdkresources\font\`。用户提到的工程字体目录在本机不存在，因此使用本机现成的同款字体。命名表确认为 HarmonyOS Sans SC，版本 1.0，版权为 Huawei Device Co., Ltd.；未重新转制、裁剪或修改。Medium 用于正文，Bold 用于较粗标题。字体仅随本软件分发，不单独销售。官方字体设计资源：[Huawei Developers](https://developer.huawei.com/consumer/cn/design/resource/)。

## Monocraft

英文标签、数字使用 [Monocraft v4.2.1](https://github.com/IdreesInc/Monocraft/releases/tag/v4.2.1)，作者 Idrees Hassan，许可为 [SIL Open Font License 1.1](public/fonts/licenses/Monocraft-LICENSE.txt)。

原始 `Monocraft-ttf.zip` 来自该版本发布附件；SHA-256 为 `897faffbef8cc27fadd0d5aa51872ab5f908e22a89bb8fa5b191366025d503e0`，与 GitHub release API 的摘要一致。原包内字体命名表版本为 4.2，附件属于 v4.2.1 发布。`public/fonts/Monocraft-Regular.woff2` 由其 Regular TTF 使用 fontTools 转制，未裁剪字库；保留原始版权、字体名和完整许可。原始 ZIP 与 TTF 留存于 `assets-sources/fonts/`，不进入 `dist/`。

应用逻辑、材料数据、字体与贴图无需外部 API。

## Rahoo 几何装饰

`public/decor/` 的刻度圆、HUD 弧线和等高线由用户指定的 [Rahoo 素材生成器](https://rahoo.online/) 导出，调整了配色与裁切区域。参数、原始导出与使用说明见 [素材来源](public/decor/SOURCES.md)。未使用站点界面截图作为页面素材。

Three.js 使用 MIT 许可证，随 npm 依赖分发。
