# Silent Gear 配装工坊

React + TypeScript + Vite 的静态网页。基于当前 ATM9 的 Silent Gear 3.6.7 材料数据，配置 32 种装备，计算单件基础属性并查询词条说明。桌面以全幅 Canvas 为背景，四个浮动面板贴四角、距边缘 16px；手机改为可滚动面板。

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
5. 配装可导出/导入 JSON，也可复制分享链接。非法或不兼容导入会保留当前方案。

## 工程结构

| 文件 | 职责 |
|---|---|
| `src/App.tsx` | 配装状态、存储、导入导出、分享、模态窗 |
| `src/Panels.tsx` | 部件配置、材料库、属性、词条面板 |
| `src/CanvasStage.tsx` | 背景画布与原始像素贴图组合；按需重绘，DPR 上限 2 |
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

托管配置保存在 `.openai/hosting.json`。Sites 项目 ID 已绑定，更新时复用该站点，不重复创建。
