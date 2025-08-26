## 709寝室宇宙

一个基于 Vite + Tailwind CSS 构建的纯前端互动小站，聚焦寝室主题的趣味展示与交互：室友卡片、通话模块、宠物窝、今日舍规、节日倒计时等。项目轻量、易扩展、可直接部署到任意静态托管平台。

### 预览截图
- 页面包含以下区域：导航栏、舍友一览、通话模块、宠物窝、今日舍规、节日倒计时、全局弹窗。

### 功能一览
- 舍友一览：
  - 卡片悬浮动效与光影。
  - 点击卡片弹出详情，显示“类型/状态/台词 + 能力值表格（两项）”。
  - 已修复“状态：状态：XX”重复前缀问题。
- 通话模块：
  - 内嵌 MiroTalk CME `iframe`，支持相机/麦克风。
  - 一键全屏/退出，容器圆角与裁剪适配。
- 宠物窝：
  - 鱼缸与植物区，鱼有 `requestAnimationFrame` 游动动画。
  - Pointer Events + rAF + transform 平滑拖拽（长按或移动阈值触发），拖拽后抑制点击，不弹出详情。
  - 非鱼元素带漂移动效，悬停眼睛眨动加速。
- 今日舍规：
  - 按日期种子从规则池中选一条并渲染。
- 节日倒计时：
  - 动态渲染多节日（元旦、情人节、清明、劳动节、儿童节、建军、教师、国庆、圣诞、春节、中秋、初音未来日等）。
  - 已过期节日自动切换到下一年并只展示未来项；到点自动移除卡片。
- 全局弹窗/通知系统：统一的打开/关闭与过渡效果。

## 技术栈
- 构建：Vite 7（`vite` 脚本：dev/build/preview）
- 样式：Tailwind CSS v4（`@tailwindcss/postcss` + `autoprefixer`）
- 脚本：原生 ES 模块（无框架），交互集中于 `src/script.js`
- 资源：Google Fonts、Font Awesome 图标

## 目录结构
```text
709web/
  ├─ index.html                 # 页面结构与模块锚点
  ├─ public/                    # 公共资源
  ├─ src/
  │   ├─ main.js                # 入口，仅导入样式与日志
  │   ├─ script.js              # 交互逻辑（卡片/拖拽/规则/倒计时/弹窗等）
  │   ├─ style.css              # Tailwind 引入 + 自定义动画与组件样式
  │   ├─ counter.js, javascript.svg  # Vite 模板残留（可忽略）
  ├─ tailwind.config.js         # Tailwind 主题扩展（配色、字体、圆角等）
  ├─ postcss.config.js          # PostCSS 插件配置
  ├─ vite.config.js             # Vite 插件与构建配置
  ├─ package.json               # 脚本与依赖
  └─ README.md                  # 本文件
```

## 快速开始
### 环境要求
- Node.js 18+（建议 20+）

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
npm run dev
```
默认地址通常为 `http://localhost:5173/`（以终端输出为准）。

### 构建产物
```bash
npm run build
```
产物位于 `dist/`，可直接部署到静态服务器（如 GitHub Pages、Vercel、Netlify、Nginx 等）。

### 本地预览构建结果
```bash
npm run preview
```

## 关键实现说明
### 1) 舍友卡片弹窗与能力值表格
- 点击卡片解析：
  - 名称：读取 `h3`。
  - 状态：从 `.status` 取文本，移除多余前缀“状态：”。
  - 台词：从 `.card-quote p` 读取。
  - 能力值：从 `.power-stats span` 解析“名称: 数值”，仅取前两项，以表格展示。
- 容错：缺失节点时以安全默认值显示，避免控制台报错。

### 2) 拖拽体验
- 使用 Pointer Events + rAF，以 `transform` 更新坐标，流畅且避免回流。
- 长按延时与移动阈值：避免点按即拖；拖拽中不触发点击弹窗；松手后抑制一次点击。
- 鱼类限制在 `.fish-tank` 容器内。

### 3) 节日倒计时
- 在 `initializeCountdown()` 内根据年份生成节日列表：
  - 若今年日期已过，则自动滚动到下一年，始终只展示未来事件。
  - 每个卡片每秒更新天/时/分；到期后自动移除卡片，并弹出通知。
- 节日配置位于 `getFestivalsForYear(year)`，可按需增删。

### 4) 今日舍规
- `dormRulesPool` 包含一组条目，按日期生成确定性的每日一条，渲染至 `.rules-list`。

### 5) 通话模块
- `#call-embed` 容器使用圆角与 overflow 裁剪，`iframe` 全面铺满；按钮调用 `toggleFullscreenById` 进入/退出全屏。

## 配置与自定义
### Tailwind 配色与主题
- 在 `tailwind.config.js` 可自定义以下示例颜色：
  - `milk-pink`、`jelly-purple`、`bright-yellow`、`mint-green`、`sakura-white` 等。
- 在 `src/style.css` 追加了自定义关键帧与组件样式（波浪、抖动、闪烁、鱼尾、水波、叶片摆动等）。

### 节日列表
- 修改 `src/script.js` 中 `getFestivalsForYear()` 的 `list` 数组即可：
  - 新增节日：添加 `{ name, month, day, icon }`。
  - 农历节日：当前使用近似日期；若需要精确农历，建议引入农历换算库并在此处替换生成逻辑。

### 室友卡片
- 在 `index.html` 的“舍友一览”区域增删卡片块即可。
  - 卡片格式：`data-roommate`、标题 `h3`、状态 `.status`、语录 `.card-quote p`、能力值 `.power-stats span`。
  - 能力值按“名称: 数值”格式书写，弹窗将取前两项表格展示。

## 部署建议
### GitHub Pages
1. 将仓库可见性设为 Public。
2. 在 GitHub 仓库的 Settings → Pages：
   - Source 选择 GitHub Actions 或 `gh-pages` 分支（需工作流/脚本支撑）。
3. 若使用 Actions，可添加 Vite 静态站点部署工作流。

### Vercel / Netlify
- 直接导入仓库，构建命令：`npm run build`，静态输出目录：`dist`。

### Nginx
- 将 `dist/` 上传到服务器并配置静态目录。

## 常见问题（FAQ）
1) 点击卡片没有弹窗/控制台报错？
- 确认卡片内存在 `h3`、`.status`、`.card-quote p`，或使用当前版本已包含的容错逻辑。

2) 拖拽时误触发弹窗？
- 已实现“长按/超过阈值才进入拖拽，并在松手后抑制一次点击”逻辑；如需更严格或更灵敏，可在 `DRAG_ACTIVATE_DELAY_MS` 与 `MOVE_THRESHOLD_PX` 调整参数。

3) 节日日期不准确？
- 农历节日当前采用近似日期。可按需接入农历库实现精确换算。

4) 音效在控制台提示 NotSupportedError？
- 已通过 `audio.play().catch(()=>{})` 忽略 Promise 拒绝；若仍异常，可能为浏览器自动播放策略或环境不支持 data URL。

## 开发指南
- 代码风格：
  - 命名清晰，避免难以理解的缩写。
  - 交互逻辑保持在 `src/script.js`，样式与动画集中在 `src/style.css`。
- 调试建议：
  - 使用浏览器 DevTools 观察元素布局与动画。
  - 关注控制台日志，定位交互逻辑。

## Roadmap
- 精确的农历节日换算与渲染。
- 宠物区更多互动（喂食动画、贴纸编辑、位置持久化）。
- 舍友卡片数据改为 JSON/后端 API 动态加载。
- 通话模块可配置房间、昵称与密码。

## 致谢
- UI 色彩与灵感来源于项目内主题色：`milk-pink`、`jelly-purple`、`mint-green`、`bright-yellow`、`sakura-white`。
- 通话模块基于 MiroTalk CME 页面嵌入。

## 许可证
本项目采用 MIT License 开源。详情见 `LICENSE`（如未包含，可根据需要添加）。


