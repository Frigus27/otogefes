# 合肥「第一」音游祭 · 赛事官网（第一阶段）

基于 Astro 7 + TypeScript 的静态赛事官网。当前比赛项目为 **Arcaea**，已实现首页、预选榜单、赛事规则、现场赛程、公告列表与公告详情。

本阶段是**展示站**：没有报名、成绩提交、审核后台、数据库或用户认证。榜单与赛程中的时间、成绩、晋级状态等均已标注实际状态，未确认信息不会被写成既定事实。

## 技术栈

- Astro 7（静态输出）
- TypeScript
- Astro Content Collections + Markdown
- 原生 CSS：自定义属性、Grid、Flexbox、容器查询式流式排版
- 本地打包字体：Noto Serif SC Variable（思源宋体同源）、Archivo Variable、IBM Plex Mono（均通过 Fontsource / SIL OFL 引入）
- 无 React、Vue、服务端框架或付费 API

## 本地运行

要求 Node.js `>= 22.22.0`（Astro 7 的要求）。

```bash
cd sites/hefei-daiichi-otoge-fes
./start-server.sh   # 一键启动站点与手机模拟器
```

`start-server.sh` 会启动：

- 站点开发服务器 `http://127.0.0.1:4400/`
- 手机模拟器 `http://127.0.0.1:4410/`
- 按 `Ctrl+C` 会同时停止两个服务
- 只启动站点：`./start-server.sh --no-simulator`

也可以手动运行：

```bash
npm install
npm run dev       # 本地开发，默认 http://localhost:4321
npm run check     # Astro + TypeScript + Content Collections 校验
npm run build     # 输出静态站点到 dist/
npm run preview   # 预览 dist/ 构建结果
```

### 移动端模拟器

项目附带一个本地预览页：`preview/mobile/index.html`。它会以 390 × 844 / 375 × 812 / 320 × 700 三种宽度，把首页、榜单和赛程放进可滚动的手机框内。

在开发服务器运行于默认预览端口 `4400` 时：

```bash
python3 -m http.server 4410 --directory preview/mobile
```

然后打开 `http://127.0.0.1:4410/`。该预览页只用于本地检查，不参与正式构建。

> 如果 4321 端口已被其他进程占用，Astro 会在启动时选择下一个端口，以终端输出为准。

## 页面路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：主视觉、项目、阶段、榜单/规则入口、赛程与公告精选 |
| `/ranking` | 预选榜单：实时 JSON 成绩、总分/时间排序、手元、三曲成绩与移动端卡片布局 |
| `/rules` | 赛事规则：Markdown 正文、目录、版本与更新时间 |
| `/schedule` | 现场赛程：场地占位、流程结构、晋级/对阵/结果扩展位 |
| `/news` | 公告列表：置顶公告、分类、日期与摘要 |
| `/news/[slug]` | 公告详情：Markdown 正文、目录、前后篇导航 |
| `/404` | 404 页面 |

## 目录结构

```text
.
├── astro.config.mjs               # Astro 配置、正式域名与部署子路径
├── package.json
├── .env.example                   # 实时榜单数据地址示例
├── public/
│   ├── favicon.svg                # 临时品牌图形，可替换
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png
│   ├── og.png / og.svg             # 1200 × 630 社交分享图
│   └── site.webmanifest
└── src/
    ├── config/
    │   ├── event.ts                # 赛事信息唯一维护入口
    │   └── ranking.ts              # 实时榜单接口地址与刷新间隔
    ├── content.config.ts           # 规则与公告的 schema 和集合定义
    ├── content/
    │   ├── rules/main.md           # 规则正文
    │   └── news/*.md               # 公告正文
    ├── data/
    │   ├── ranking.json            # 榜单原始数据（成绩、时间、曲目、手元）
    │   ├── ranking.ts              # 构建时读取并规范化 ranking.json
    │   └── schedule.ts             # 赛程结构化占位数据
    ├── lib/
    │   ├── format.ts               # 日期、分数、阅读时间格式化
    │   ├── ranking.ts              # 榜单校验、排序、排名与状态派生
    │   ├── ranking-render.ts       # 服务端与浏览器共用的三线表 HTML
    │   ├── ranking-client.ts       # 浏览器实时拉取榜单
    │   └── validate.ts             # 赛程等数据校验
    ├── styles/
    │   ├── tokens.css              # 颜色、字体、间距、动效变量
    │   ├── global.css              # 基础样式与共享组件
    │   └── prose.css               # Markdown 长文排版
    ├── layouts/BaseLayout.astro    # HTML 骨架、SEO、OG、导航与页脚
    ├── components/                 # 导航、页脚、榜单、赛程、公告、Hero 等
    └── pages/                      # 页面与动态公告路由
```


## Logo 图片

品牌图像位于 `public/brand/`，包含同一套标识的两种底色版本和透明版本：

- `logo-horizontal.png`：880 × 184，深色背景 PNG，适合直接分享或放在深色页面中；
- `logo-horizontal-transparent.png`：透明背景 + 浅色字，站点导航使用这一版；
- `logo-horizontal-light.png`：透明背景 + 深色字，适合浅色底；
- `logo-horizontal.svg` / `logo-horizontal-transparent.svg` / `logo-horizontal-light.svg`：矢量源文件，文字已转曲，不依赖本机字体。

## 如何更新内容

### 1. 赛事基本信息

编辑 `src/config/event.ts`：

- 活动名称、英文名、届数、赛事代码；
- 当前比赛项目与项目待确认说明；
- 日期、地点、场馆、形式；
- 当前状态与右侧状态信息；
- 四个赛事阶段的标题、说明与状态；
- 主办方、联系人和联系邮箱；
- 默认 SEO 标题、描述和 OG 图片。

带「待」或空字符串的字段是**有意保留的占位**。确认前不要把待定内容替换成未经核实的信息。

### 2. 规则

编辑 `src/content/rules/main.md`：

- frontmatter 中更新 `version`、`updatedAt`、`status`、`statusLabel`；
- 正文使用 Markdown 标题（`##` / `###`），页面目录会自动读取；
- `/rules#ranking-advance` 是榜单页使用的稳定锚点，正文中通过 `<a id="ranking-advance"></a>` 保留；
- 正式确认后将 `status` 改为 `confirmed`，并同步更新页面中的草案提示。

### 3. 公告

在 `src/content/news/` 新增 `.md` 文件即可生成列表项与详情页。文件名会成为 URL slug，例如 `my-news.md` → `/news/my-news`。

Frontmatter 示例：

```yaml
---
title: 公告标题
description: 列表和详情页使用的摘要，最多 220 字
pubDate: 2026-10-20
updatedDate: 2026-10-21
category: 赛事公告 # 赛事公告 / 规则说明 / 筹备日志
pinned: false
author: 赛事筹备组
---
```

- `pinned: true` 的公告会在列表页作为置顶大区块展示；多条置顶时按日期排序。
- 公告均为正式发布内容。未确认的日期、场地等信息应在正文中明确写为「待公布」，不要用示例条目占位。
- 正文中的 `##` / `###` 标题会自动生成详情页目录。

### 4. 榜单（实时 JSON）

榜单数据在 `src/data/ranking.json`。页面会先使用构建时的快照渲染首屏，然后在浏览器中从实时地址拉取新数据，因此**不需要重新构建即可更新成绩**。

实时地址由 `PUBLIC_RANKING_URL` 配置；未配置时使用站点自己的 `/data/ranking.json`。

数据结构：

```json
{
  "schemaVersion": 1,
  "project": "Arcaea",
  "statusLabel": "预选进行中",
  "statusTone": "active",
  "cutoff": 7,
  "notice": "榜单说明",
  "rulesHref": "/rules#ranking-advance",
  "updatedAt": "2026-10-19T03:35:00+08:00",
  "songs": [
    { "id": "arc-01", "title": "曲名 A" },
    { "id": "arc-02", "title": "曲名 B" },
    { "id": "arc-03", "title": "曲名 C" }
  ],
  "entries": [
    {
      "playerId": "HF-0001",
      "playerName": "选手昵称",
      "recordedAt": "2026-10-19T03:30:05+08:00",
      "videoUrl": "https://example.com/video",
      "scores": [10002221, 10002184, 10001450],
      "review": false,
      "note": ""
    }
  ]
}
```

计算规则写死在 `src/lib/ranking.ts`：

1. `total = scores[0] + scores[1] + scores[2]`；
2. 按总分降序；
3. 总分相同时，`recordedAt` 更晚的在前；
4. 仍相同时用 `playerId` 升序保证结果稳定；
5. `rank`、`total`、`status` 全部由程序派生，不需要写进 JSON；
6. `review: true` 显示「审核中」；否则按 `cutoff` 派生「晋级区」，随后 8 名（第 8—15 名）派生「LCQ 资格区」，其余为「未晋级」。

构建和浏览器共享同一套校验：未知 schema、重复 playerId、缺失手元、成绩数量不为 3、时间格式错误等都会直接报错。`entries` 为空时显示空状态。

榜单页的曲绘横幅由 `PUBLIC_RANKING_BANNER` 控制，默认关闭；确认官方素材授权后，构建环境设为 `PUBLIC_RANKING_BANNER=true` 才会输出横幅。

生产环境更新方式：

- 将榜单 JSON 放在对象存储、KV、独立数据接口等**可写地址**，把 `PUBLIC_RANKING_URL` 指向它；
- bot 用「写临时文件 → 校验 → 原子替换」或对象存储单次 PUT 发布；
- 页面每 30 秒检查一次，使用内容签名判断是否重绘，并显示最后同步时间；
- 榜单 JSON 的响应头需允许 CORS，并建议使用 `Cache-Control: no-store` 或在请求中绕过缓存。

> 注意：普通的 Cloudflare Pages / Netlify / Vercel 静态部署是不可变的，直接修改仓库里的 `src/data/ranking.json` 不会自动改变已部署站点。要做到真正不重新构建，必须把实时数据放到独立的可写数据源。

### 5. 赛程

编辑 `src/data/schedule.ts`：

- `overview`：页面顶部的阶段概览；
- `items`：现场流程时间线的编号、时间、标题、说明和状态；
- `qualifiers`、`bracket`、`results`：扩展位是否已发布及空状态文案；
- `notice`、`venueName`、`venueAddress` 和状态文案。

确认时间后替换 `time: '时间待定'`，并把状态改为合适的 `StatusTone`。构建时会校验 id 与 code 是否重复、标题与时间是否为空。

### 6. 视觉样式

- 设计令牌：`src/styles/tokens.css`
- 基础组件：`src/styles/global.css`
- Markdown 正文：`src/styles/prose.css`
- 页面级布局：对应 `src/pages/*.astro` 与组件 `<style>` 块

标题字体为本地打包的 Noto Serif SC Variable（与思源宋体同源，SIL OFL），不再依赖 macOS 的 Songti SC。

临时品牌图形在 `src/components/BrandMark.astro` 与 `public/favicon.svg`。正式 Logo 到位后替换这两个文件即可，其他版式无需改动。

## 需要主办方确认的内容

以下内容在页面中已明确标记为待定，需要主办方逐项确认：

1. 活动正式名称、届数、活动日期与时间；
2. 现场场馆、详细地址、交通与入场方式；
3. 主办方/承办方全称、联系人与官方联系方式；
4. Arcaea 比赛使用的平台、游戏版本、曲目池与设备；
5. 报名资格、报名入口和报名截止时间；
6. 线上预选的重试、成绩提交、凭证与审核流程；
7. 正式晋级人数、同分排序规则和晋级公示期；
8. 现场赛制、轮次、对阵方式、平局规则和颁奖安排；
9. 申诉窗口、受理渠道与反馈时限；
10. 正式品牌 Logo、品牌色、主视觉图片与官方社交渠道；
11. 正式域名与站点部署地址（已在 `astro.config.mjs` 配置，更换时同步修改）。

## 部署到静态托管

项目输出为纯静态文件，构建命令为 `npm run build`，发布目录为 `dist/`。

常见方式：

- **Cloudflare Pages / Netlify / Vercel**：Build command 填 `npm run build`，Output directory 填 `dist`；
- **GitHub Pages**：`main` 保存源码，`gh-pages` 保存 `dist/` 构建产物；在仓库 Settings → Pages 中选择 `gh-pages` 分支根目录即可。产物已包含 `.nojekyll`，确保 `_astro/` 不被 Jekyll 忽略；项目已配置 `base: '/otogefes'`，如更换部署路径，请同步修改 `site` 与 `base`；
- **对象存储 / Nginx**：上传 `dist/`，将 404 页面指向 `404.html`。

当前正式地址配置为 `site: 'https://frigussum.com'`、`base: '/otogefes'`，对应 `https://frigussum.com/otogefes/`。更换域名或子路径时需同时修改这两项；站内链接与 Markdown 链接会通过 `withBase` / Markdown 处理器自动补前缀。

若要让榜单不重新构建即可更新：

1. 准备一个可写的 HTTPS JSON 地址（对象存储、KV、数据接口等）；
2. 配置构建环境变量 `PUBLIC_RANKING_URL`；
3. 确保该地址返回 `application/json` 且允许站点跨域读取；
4. 让 bot 以原子方式整体替换该 JSON；
5. 在构建时的本地 `src/data/ranking.json` 中保留一份可用的兜底快照。

## 参考与视觉说明

设计研究过程中实际访问了：

- `https://www.dotreamexpo.com`：直接抓取到静态壳与构建资源；站点当前受 Anubis 保护，无法在无交互浏览器中完整渲染，因此没有声称完成逐页视觉比对。
- `https://maimai.sega.jp/kop7th/`：成功抓取并检查了页面内容层级、新闻与赛程组织方式、深色底 + 金属色强调的赛事视觉语言。

本项目没有复制参考站点的版式或素材。视觉方向结合了「合肥本地活动」与「音游判定/节拍」的语义：暖纸色与墨黑作为基础，酸性荧光绿作为赛事信号色，朱橙与浅蓝作为辅助，使用宋体大标题、等宽编号和硬边网格建立独立识别度。

除榜单页曲绘横幅（默认关闭，仅在设置 `PUBLIC_RANKING_BANNER=true` 时输出）外，所有图形均为原创 CSS/SVG 图形；没有使用参考站点素材。正式品牌资源确认后应替换临时文字标识与主视觉。

## 已知限制

- 第一阶段没有后端、报名和成绩提交；
- 赛程、规则和公告仍需要重新构建；榜单通过 `PUBLIC_RANKING_URL` 可实时更新；
- 若未配置 `PUBLIC_RANKING_URL`，线上榜单会读取构建产物里的静态快照；
- 实时更新仅支持整份 JSON 原子替换，不处理并发写入；
- 没有搜索、筛选或分页；榜单每 30 秒自动检查一次更新；
- 公告为正式发布文本，未确认信息在正文中标注「待公布」；
- 未接入访问统计、评论、CMS 或邮件订阅；
- 站内链接通过 `import.meta.env.BASE_URL` 适配子路径；新增手写绝对路径时需使用 `withBase`。
