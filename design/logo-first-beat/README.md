# 合肥「第一」音游祭 · 第一拍

沿用赛事页面的墨黑底、荧光黄绿与暖白宋体。主字标以「第一」作为强调，将“一”改为带菱形落点的判定线；独立符号将“合”字简化为汇聚的屋顶、判定线和开放内腔。

## 文件

- `logo-presentation.png`：整体提案展示，1400 × 1560。
- `logo-stacked-dark.svg` / `.png`：墨黑底叠排主标，PNG 为 1800 × 1560。
- `logo-stacked-transparent.svg` / `.png`：暖白 + 黄绿色字、透明背景的叠排主标。
- `logo-horizontal-dark.svg` / `.png`：墨黑底横排组合，PNG 为 2520 × 540。
- `logo-horizontal-transparent.svg` / `.png`：透明底横排组合，适合深色网站导航和横幅。
- `logo-horizontal-mono.svg` / `.png`、`logo-stacked-mono.svg` / `.png`：透明底墨黑单色版本，适合浅底与单色印刷。
- `logo-symbol.svg` / `.png`：黄绿色独立“合”字图标，透明底，PNG 为 768 × 768。
- `logo-avatar.svg` / `.png`：墨黑底方形头像，PNG 为 1024 × 1024。
- `symbol-32.png`：32 × 32 小尺寸检查图。

所有 SVG 的文字均已转为路径，不依赖本机字体；PNG 直接由 SVG 导出。透明底浅色字版本建议放在深色背景上使用。

## 色彩与使用

- 墨黑：`#171811`
- 荧光黄绿：`#DCFF4F`
- 暖白：`#F3F0E6`

四周建议留出不少于图标宽度 1/5 的空白。横排组合建议显示宽度不低于 280 px；更窄的空间使用独立图标。`VOL. 01` 是可替换届次附标。

## 源文件

`generate.mjs` 包含字标布局、定制“一”、引号、图标与展示板的矢量构造。`glyphs.json` 是已提取的字形轮廓，修改布局和重新导出不需要安装字体。在项目根目录运行：

```sh
node design/logo-first-beat/generate.mjs
```

`extract-glyphs.swift` 在 macOS 下通过 CoreText 从本项目已有字体包提取轮廓。中文使用 Noto Serif SC Black，英文使用 IBM Plex Mono 与 Archivo。字体采用 SIL Open Font License 1.1，许可原文位于 `licenses/`。定制图形与布局为本次原创设计。
