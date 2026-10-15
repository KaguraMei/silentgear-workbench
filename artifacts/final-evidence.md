# 配装工坊视觉与 Three.js 验收

2026-10-15。范围为现有配装工具的立体预览、字体、视觉与静态部署；未发布站点。

## Three.js 的实际用途

此前只在 package.json 声明了 three，画面完全由 Canvas 2D 绘制。本次 `src/CanvasStage.tsx` 使用 Three.js WebGLRenderer、透视相机、半球光/主光/轮廓光、阴影与八角展示台。`src/gear-model.ts` 将原始模组像素图层按材料着色，合成 32×32 图，再生成带正反面及轮廓侧壁的实体 BufferGeometry。它是依照物品图标挤出的立体示意，不是 Minecraft 官方装备模型。背景继续使用按需绘制的 2D 网格。

可拖动/触摸旋转、滚轮或按钮缩放；键盘方向键旋转，+/- 缩放，Home/0 复位。自动旋转默认关闭，尊重减少动态效果设置；标签页隐藏时暂停。WebGL 初始化失败或上下文丢失后使用原贴图 2D 回退，属性计算保留。

## 视觉与素材

- 深色金属面板、铜色刻度、矿物绿色选中状态；保留桌面四角面板和手机滚动布局。
- 从用户指定的 https://rahoo.online/ 素材生成页导出刻度圆、HUD 弧线、等高线 SVG，按用途修改 viewBox 与配色。原始导出保留于 `artifacts/asset-sources/`，来源记录在 `public/decor/SOURCES.md`。
- 正文为本地 HarmonyOS Sans SC Medium/Bold WOFF2；英文标识与数值使用 Monocraft v4.2.1 转制的 WOFF2。原始字体与转换脚本保留在 `assets-sources/fonts/`；没有 Google Fonts 请求。
- 材料库对具有对应原始图标的材料显示真实像素素材，其他材料继续显示配色块。

## 实际检查结果

- `npm test`：18/18 计算测试通过。
- `npm run build`：TypeScript 与 Vite 生产构建通过。
- `npm run test:browser`：13 通过、2 跳过。跳过的是已在桌面通过的静态子路径检查在其他浏览器的重复执行。
- Chrome 1440×900、Edge 1024×768、Chrome Pixel 7 触屏模拟 412×839：配装、品级、星光、比较、词条说明、磨损、重置、导入导出、刷新、分享状态与非法文件处理通过。
- 三个浏览器目标各测试全部 32 种装备，等待当前模型完成，检查属性有限且 WebGL 生成三角形。
- 鼠标拖动/滚轮、真实浏览器触摸事件、键盘旋转、缩放按钮、复位、自动旋转和 reduced-motion 禁用验证通过。
- 通过 WEBGL_lose_context 扩展触发真正上下文丢失，回退画布有非透明像素，3D 控件禁用；流程没有页面异常或 HTTP 资源错误。
- 独立静态服务器挂载 `/silentgear-workbench/`，字体、JS、CSS、装备贴图及装饰资源全部从此路径成功加载。
- 三个视口文档宽度不超过视口，桌面四角边距仍为 16px。已目视检查截图和旋转后的模型厚度。

## 图像与测量

- [桌面](desktop-chrome-redesign.png) / [笔记本](laptop-edge-redesign.png) / [手机](mobile-chrome-redesign.png)
- [旋转视角](desktop-chrome-rotated.png) / [默认视角](desktop-chrome-front.png)
- [浏览器结果](browser-results.json) / [桌面渲染指标](desktop-chrome-inspector.json) / [手机渲染指标](mobile-chrome-inspector.json)

默认剑：7 draw calls、3456 triangles、4 geometries、3 renderer textures，512×512 阴影贴图；DPR 上限 1.75。默认按需重绘，仅手动开启旋转才持续请求动画帧。桌面 32 装备切换测试操作中位数约 54ms、最大 290ms（包括自动化开销，不是 FPS）。

生产 JS 约 1002KB（gzip 246KB），CSS 31KB（gzip 7.6KB）；完整静态目录约 10.5MB，其中两个完整中文字体约 8.9MB。Vite 仍提示 JS 单块超过 500KB；当前加载体积是保留完整中文字体与 Three.js 的代价，未冒称已经完成网络性能优化。

## 交付与边界

`dist/` 为 GitHub Pages 静态输出，Vite base 为 `./`。`.github/workflows/pages.yml` 仅手动触发，尚未运行任何部署。README 包含使用步骤；原先 Sites 配置未被调用。

未做物理手机、Safari 或运行中 Minecraft 的逐项实测。保持单材部件计算边界。没有引入游戏玩法、音频或生成式外部服务；本轮不作 AAA 游戏品质声明。

实际使用技能：threejs-game-director、threejs-aaa-graphics-builder（authoring-recipes、technical-art）、threejs-game-ui-designer（ui-patterns）、threejs-qa-release（release-checks）。原版本记录保留在 baseline-evidence.md。
