# taifan.club 新基线说明

> 来源：`/Users/ouyowu/Downloads/TAIFAN_CODEX_HANDOFF.md`
> 用途：作为后续 Codex 修改前台与产品信息架构时的优先参考。

## 1. 以后默认遵守的方向

- 产品名与对外定位：`泰饭网 taifan.club`
- 目标用户：中文用户、泰国艺人追星入口站
- 产品气质：`顶级艺人一站式追星平台`，不是普通资讯站，也不是偏技术感的产品官网
- 首页与各频道页要更像“内容平台 + 追星服务入口”，不是单页展示站

## 2. 设计系统优先级

后续修改前台时，默认优先遵守这套视觉规则：

- 英文主字体：`Plus Jakarta Sans`
- 英文衬线辅助：`Lora`
- 中文字体：`Noto Sans SC`
- 品牌主色：橘黄色体系
  - `--orange: #f07030`
  - `--orange-deep: #d95820`
  - `--orange-light: #ff9050`
  - `--orange-pale: #fff4ee`
  - `--orange-pale2: #ffeade`
- 页面底色：浅白 / 米白
- 主文字：深 charcoal
- 圆角、阴影、导航、页脚风格，优先参考 handoff 中那套系统

## 3. 页面与信息架构基线

以后规划页面时，优先按这套栏目理解，而不是按旧的临时页面思路：

- 首页
- 艺人库
- 活动日历
- 代办服务
- 周边商城
- 资讯
- about / contact / faq 等补充页

## 4. 当前项目如何对接这份 handoff

这份 handoff 是以静态 HTML 站结构写的：

- `index.html`
- `artists.html`
- `shop.html`
- `calendar.html`
- `services.html`
- `news.html`

但当前仓库是 Next.js App Router 项目，所以后续实现时要做“语义迁移”，不是逐字照搬：

- `index.html` → `src/app/page.tsx`
- `artists.html` → `src/app/stars/[slug]/page.tsx` + 艺人列表入口
- `calendar.html` → `src/app/calendar/page.tsx`
- `services.html` → `src/app/services/page.tsx`
- `news.html` → `src/app/news/page.tsx`
- `shop.html` → 当前若未完整存在，后续按 handoff 补

## 5. 以后修改时的硬规则

- 不再把整站往旧的“暖金媒体风”拉回去
- 不再随意发散成另一套 pastel / Lattice 风格，除非用户再次明确改方向
- 新页面、新模块、新组件，优先对齐：
  - 橘黄色品牌主色
  - Plus Jakarta Sans / Lora / Noto Sans SC
  - handoff 里的导航栏、页脚、响应式断点、动效语气
- 如果现有页面与这份 handoff 冲突，以 handoff 为新基线，逐步重做

## 6. 我后面要特别注意的点

- 用户现在明确说：`以后按照这个修改`
- 所以这份 handoff 应视为当前最高优先级设计与产品参考
- 后续每次较大的前台改动前，先对照这份文档判断是否偏离
