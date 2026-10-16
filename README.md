# Silent Gear 配装工坊

React + TypeScript + Vite 的静态网页。基于当前 ATM9 的 Silent Gear 3.6.7 材料数据，配置 32 种装备，计算单件基础属性并查询词条说明。桌面以全幅等高线 Canvas 为背景，四个浮动面板贴四角、距边缘 16px；手机改为可滚动面板。

## 运行

要求 Node.js 22.12+ 和 npm。首次安装后无需游戏进程即可运行。

```sh
npm ci
npm run dev
```

生产构建与预览：

```sh
npm run build
npm run preview -- --port 4173
```

静态发布目录为 `dist/`。不需要服务端、数据库或密钥；浏览器通过 localStorage 保存配装。分享链接在 URL hash 中携带配置，不会自动扩大站点访问权限。

## 使用

1. 选择装备分类和蓝图，点击部件。
2. 从兼容材料库装配材料，调整品级和星光充能。
3. 右侧即时显示属性与词条；悬停、键盘聚焦或轻触词条查看说明。
4. 拖动耐久损耗滑块观察磨损相关效果。用“固定对比”保留同类装备基准。
5. 打开“对比工作台”，保存最多三个配装快照，与当前实时配装并排比较；“材料候选”只替换当前部件材料，其余条件相同。可选基准、只看差异、应用某列；快照跨装备类型保留。
6. 配装可导出/导入 JSON，也可复制分享链接。非法或不兼容导入会保留当前方案。

## 工程结构

| 文件 | 职责 |
|---|---|
| `src/App.tsx` | 配装状态、存储、导入导出、分享、模态窗 |
| `src/Panels.tsx` | 部件配置、材料库、属性、词条面板 |
| `src/CanvasStage.tsx` | Three.js 装备展示与工坊场景 |
| `src/fonts.css` / `public/fonts/` | 本地 HarmonyOS Sans SC 正文与 Monocraft 英文标签、数值 |
| `src/Tooltip.tsx` | 指针、键盘和触屏说明层，边界定位 |
| `src/engine.js` / `engine.d.ts` | 不依赖 React/DOM 的纯计算函数和类型契约 |
| `src/data.js` | 从模组及本地翻译提取的数据快照 |
| `prepare_data.py` | 从原始扫描数据和本地模组 JAR 重建数据及贴图 |
| `tests/engine.test.mjs` | 已知值、公式、条件、抵消、兼容性与类型覆盖 |
| `tests/workbench.spec.ts` | 实际浏览器交互、画布、导入导出、持久化和布局检查 |

## 检查

```sh
npm run typecheck
npm test
npm run build
npm run test:browser
```

浏览器测试使用本机 Chrome 和 Edge，含 Pixel 7 触屏模拟。测试自动启动生产预览，输出到 `artifacts/`。没有这些浏览器时需安装或修改 Playwright 的 channel；不把模拟结果视为物理手机实测。详见 [验收记录](artifacts/final-evidence.md)。

## 数据与计算边界

- 每个部件一种材料，按标准制作配方的材料格数模拟；主体材料、工具杆、尖端、涂层等分开配置。
- 包含品级、星光、部件协同、磨损、词条条件、同名最高等级和有方向的抵消。
- 排除未建模的动态合金、混材部件、杂项升级、附魔、Apotheosis、服务器附加数据包及其他模组事件修改。
- 暴击、目标减伤、药水及条件触发效果不冒充常驻面板值。远程属性不是实际命中扣血量。
- 采用源码及本地字节码核查结果，未在运行中的 Minecraft 中逐项实测。装备贴图为配色示意。
- `prepare_data.py` 依赖此工程上两级的游戏目录与 `docs/atm9-equipment-data/`。独立分发工程已包含生成的数据，常规构建不需要原始 JAR。

## 资料

- [材料属性与词条](public/docs/materials.md)
- [高伤害武器与防具列表](public/docs/equipment.md)
- [第三方来源](THIRD_PARTY_NOTICES.md)

## GitHub Pages

本工程直接构建为静态文件，不需要绑定 Sites 或其他持久站点。`vite.config.ts` 使用 `base: './'`，适合 `https://用户名.github.io/仓库名/` 的子路径。页面资源与字体均随 `dist/` 分发，分享状态使用 hash，不需要服务端路由回退。

1. 把工程上传到自己的 GitHub 仓库。
2. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
3. 在 **Actions** 中打开 **Deploy workbench to GitHub Pages**，点击 **Run workflow**。

工作流只有手动触发入口，不会因推送自动发布；本地准备工作不会触发部署。也可以运行 `npm run build` 后自行托管 `dist/`。实际 GitHub 部署需要仓库开启 Pages。

## 字体与素材

正文使用 **HarmonyOS Sans SC**，英文标签和数字使用 **Monocraft v4.2.1**。字体通过本地 WOFF2 加载，不依赖 Google Fonts。HarmonyOS 提供 Medium 和 Bold 两个现成字重，正文使用 Medium；现按 Unicode 分为界面常用字、材料词条字、扩展字形三组，浏览器只请求当前文字需要的组，保留原始全部字符覆盖。

Monocraft 发布包原本提供 TTF/OTF，本工程用 fontTools 将 Regular TTF 转为 WOFF2，保留全字库、提示信息和许可证。原始 ZIP 与整套 TTF 保留在 `assets-sources/fonts/`，不复制到生产目录。需要重建时：

```sh
python -m pip install fonttools brotli
python assets-sources/fonts/convert_monocraft.py
```

字体与素材的真实来源、许可见 [第三方来源](THIRD_PARTY_NOTICES.md)。

## 加载优化与重新生成字体

字体分块使用用户 `tff2woff2` 项目的 `convert_one` 逻辑，副本位于 `assets-sources/fonts/ttf_to_web.py`。完整原始 WOFF2 放在 `assets-sources/fonts/originals/`，不进入静态发布目录。执行：

```sh
python -m pip install fonttools brotli
python assets-sources/fonts/build_webfonts.py
```

脚本从 `src/` 界面文案与 `src/data.js` 材料、词条自动收集字符，生成六个不重叠的 WOFF2 文件和 `src/fonts.generated.css`。每组使用 `unicode-range` 按需加载，并验证所有源字符仍被覆盖。修改文案或重新提取汉化后可重跑；常规 `npm ci && npm run build` 使用已生成文件，无需 Python。新增未收录的字符仍会通过扩展字形加载，而非缺字。

Three.js 预览独立为异步模块；界面与计算先运行。下载过程中显示加载提示，下载失败时保留配装功能。体积测量与验证见 `artifacts/loading-evidence.md`。

## 汉化数据

补丁 JAR 与 KubeJS 的语言资源已提取到 `translations/silentgear.zh_cn.json`。词条浮层分别显示游戏汉化和计算说明；数值规则不由汉化文本推断。重复运行提取的方法与缺失条目见 `artifacts/translation-audit.md`；`prepare_data.py` 重建数据时自动应用语言快照。
