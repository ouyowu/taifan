# ThaiStar Bridge / 泰娱桥 — Claude 全站复查 Brief

项目路径：`/Users/ouyowu/Documents/泰国娱乐圈项目`

## 0. 本次任务速览

- 本次任务：从“整站角度”复查 ThaiStar Bridge / 泰娱桥 当前版本
- 重点不是重写产品，而是判断：
  - 前台视觉是否已经足够像真实运营中的站
  - 内容流和 daily news 机制是否合理
  - 后台审核流是否清楚
  - 上线前还剩哪些最关键的问题
- 这次尤其请关注：
  - 整站是否已经形成统一的“先看什么 / 先做什么”编辑引导
  - 首页、明星页、news 中心、活动日历、服务页、攻略页是否已经像同一套产品
- 这次你可以只给判断，也可以顺带提出下一轮最值得改的 3 个点

## 0.1 本次可直接参考的最新页面截图

如果你当前环境可以访问本机文件，请优先看这 7 张最新截图：

- `/Users/ouyowu/Desktop/thaistar-home-audit.png`
- `/Users/ouyowu/Desktop/thaistar-news-audit.png`
- `/Users/ouyowu/Desktop/thaistar-calendar-audit.png`
- `/Users/ouyowu/Desktop/thaistar-star-audit.png`
- `/Users/ouyowu/Desktop/thaistar-event-audit.png`
- `/Users/ouyowu/Desktop/thaistar-services-audit.png`
- `/Users/ouyowu/Desktop/thaistar-guides-audit.png`

## 1. 你现在接手的是什么

这是一个面向中国大陆粉丝的泰国娱乐信息聚合与服务平台。

它不是泛娱乐资讯站，也不是纯粉圈图站。当前目标更具体：

- 用中文降低追星门槛
- 把活动、动态、票务、预约、品牌活动、粉丝支持整理成中文入口
- 保留原始标题、艺人名、品牌名、场馆名，方便用户继续搜索和核对
- 通过后台 + AI + 审核流，让站点内容可以持续增长

一句话概括：

`这是一个中文追星入口 + 官方来源整理站 + 可持续长内容的 news 内容中心。`

## 2. 当前最重要的语言规则

请不要把整站理解成“全中文直译站”。

当前明确规则是：

- 界面、按钮、说明：简体中文优先
- 明星英文名、活动原始标题、品牌名、商场名、场馆名：原文保留优先
- 页面展示：`中文解释 + 原文保留`

重点参考：

- [language-display-guidelines.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md)

## 3. 当前整体完成度

这不是一个空壳 demo 了。当前已经有：

- 首页
- 活动日历
- 明星动态 news 中心
- 明星详情页
- 活动详情页
- 动态详情页
- 服务支持页
- 新粉攻略页
- 后台内容管理
- AI 抓取与处理入口
- 每日自动 news 候选生成
- 后台审核发布流
- robots / sitemap / metadata / OG 基础 SEO

## 4. 前台当前视觉方向

前台当前已经从早期版本演进到这套方向：

- 娱乐杂志感
- 粉丝应援站气质
- 暖金 + 象牙白 + 炭黑
- 英文标题更有戏剧感
- 海报感更强
- 内容卡更像“编辑整理稿”而不是普通 CMS 列表

### 字体方向

- 英文大标题：衬线、强对比、封面感
- 中文正文：可读性优先
- 不是科技 SaaS，也不是冷淡资讯站

### 当前前台主要页面

- `/src/app/page.tsx`
- `/src/app/calendar/page.tsx`
- `/src/app/news/page.tsx`
- `/src/app/stars/[slug]/page.tsx`
- `/src/app/events/[slug]/page.tsx`
- `/src/app/news/[slug]/page.tsx`
- `/src/app/services/page.tsx`
- `/src/app/guides/page.tsx`

## 5. 前台最近一轮已经做过什么

### 海报和图像层

最明显的一层 demo 感，原本来自通用外部图库图。

这轮已经替换成站内本地海报素材：

- `/public/posters/bright-vachirawit.svg`
- `/public/posters/win-metawin.svg`
- `/public/posters/billkin.svg`
- `/public/posters/pp-krit.svg`
- `/public/posters/gemini-norawit.svg`
- `/public/posters/fourth-nattawat.svg`
- `/public/posters/lingorm.svg`

这些图现在被用于：

- 首页焦点区
- 动态页卡片
- 明星页
- 活动详情页
- 服务页
- 攻略页

### 文字层去 demo 味

最近也清理了一批比较模板化的前台文案，例如：

- 过于空泛的兜底标题
- 生硬的“官方来源优先”兜底写法
- 太像样板项目的说明句

### 整站编辑引导层

最近一轮不是只补内容，而是开始补“有人带路”的体验。

当前已经形成这套入口逻辑：

- 首页：
  - `代表内容精选`
- 明星页：
  - `Must read 3`
  - `Start from these tracks`
  - `What to remember now`
- 动态中心：
  - `Read these first`
- 活动日历：
  - `Watch these first`
- 服务页：
  - `Start with these`
- 新粉攻略页：
  - `Start with these chapters`

请重点判断：

- 这些入口有没有真的形成统一的产品语言
- 还是只是“多加了几个模块”
- 它们有没有让整站更像真实运营中的中文入口站

## 6. News 内容中心当前状态

### 列表页

`/news` 当前不是普通列表，而是更像内容中心：

- `Lead Story`
- `Read these first`
- 来源 / 分类筛选
- 日期分组的 `News Archive`
- 更适合长期新增内容的结构

对应文件：

- `/src/app/news/page.tsx`

### 详情页

`/news/[slug]` 当前已经具备：

- 原始标题
- 中文摘要
- 整理正文
- 来源说明
- 结构化数据 `NewsArticle`

对应文件：

- `/src/app/news/[slug]/page.tsx`

### SEO 层

当前已经有：

- metadata helper
- page-level metadata
- `robots.txt`
- `sitemap.xml`

相关文件：

- `/src/lib/metadata.ts`
- `/src/app/layout.tsx`
- `/src/app/robots.ts`
- `/src/app/sitemap.ts`

## 7. Daily News 自动增长流

这是当前整站最关键的新能力之一。

### 现在已经具备

- 官方来源清单
- 抓取公开页面正文
- AI 生成中文摘要
- 自动分类：
  - `活动速递`
  - `品牌活动`
  - `官宣`
  - `直播`
- 自动生成站内 news 候选
- 最近 3 天去重
- 正文模板生成

核心文件：

- `/src/lib/source-catalog.ts`
- `/src/lib/source-metadata.ts`
- `/src/lib/scrape.ts`
- `/src/lib/ai/pipeline.ts`
- `/src/lib/daily-news.ts`

### 触发方式

当前有两种：

- 后台手动触发：`/api/admin/newsroom/daily`
- 定时触发：`/api/cron/daily-news`

相关文件：

- `/src/app/api/admin/newsroom/daily/route.ts`
- `/src/app/api/cron/daily-news/route.ts`
- `/vercel.json`

## 8. Daily News 审核流现状

这条线目前已经不是“自动生成就直接公开”。

### 当前规则

- 自动生成的 daily news 默认进入：
  - `reviewed`（待发布）
- 不会直接进前台
- 前台只读取：
  - `published`

### 后台可以做的事

在动态内容管理里，运营现在可以：

- 看见 `草稿 / 待发布 / 已发布 / 已驳回`
- 一键 `发布`
- 一键 `驳回`
- 筛选：
  - `只看待发布`
  - `只看自动整理`

对应文件：

- `/src/components/admin/news-list-card.tsx`
- `/src/components/admin-console.tsx`
- `/src/app/api/admin/news/route.ts`
- `/src/app/api/admin/news/[slug]/route.ts`
- `/supabase/migrations/20260517_news_review_status.sql`

## 9. 后台结构状态

后台不是这次唯一重点，但它已经做过系统拆分。

### 主控台

- `/src/components/admin-console.tsx`

### 已拆出的块

- `/src/components/admin/ai-ingestion-card.tsx`
- `/src/components/admin/event-editor-card.tsx`
- `/src/components/admin/event-list-card.tsx`
- `/src/components/admin/ingestion-jobs-table.tsx`
- `/src/components/admin/ingestion-workspace-controls.tsx`
- `/src/components/admin/ingestion-workspace-notices.tsx`
- `/src/components/admin/news-editor-card.tsx`
- `/src/components/admin/news-list-card.tsx`
- `/src/components/admin/official-sources-board.tsx`
- `/src/components/admin/service-request-queue-card.tsx`
- `/src/components/admin/star-editor-card.tsx`
- `/src/components/admin/star-priority-list-card.tsx`

### 已拆出的逻辑层

- `/src/hooks/use-draft-queue-orchestrator.ts`
- `/src/lib/star-priority-content.ts`

当前已被 Hermes / Claude 复查过，结论是：

- `admin-console.tsx` 已经适合阶段性停止继续拆分
- 剩余复杂度主要属于正常业务编排复杂度

## 10. 上线准备现状

上线相关材料已经有：

- [launch-checklist.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/launch-checklist.md)
- [vercel-daily-news-deploy.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/vercel-daily-news-deploy.md)
- [README.md](/Users/ouyowu/Documents/泰国娱乐圈项目/README.md)

当前也已经按 Vercel cron 方式整理了：

- `CRON_SECRET`
- `vercel.json`
- `/api/cron/daily-news`

## 11. 当前你最值得复查的 5 个问题

请你优先从全站角度回答这 5 个问题：

1. 前台现在是否已经足够像一个“真实运营中的娱乐 / 粉丝内容站”，还是仍然有明显的 demo 感？
2. 当前 daily news 的自动增长流，是否已经达到“可用但需人工审核”的合理平衡？
3. 当前 news 中心的 SEO 结构是否足够合理，还是还缺关键层？
4. 当前前台哪些页面已经成熟，哪些页面还只是“完成了结构但内容感不够”？
5. 如果现在只能继续做 3 件事，最值得做的 3 件是什么？
6. 当前这套“先看什么 / 先做什么”的编辑引导是否已经成立？
   - 首页、明星页、活动页、news 中心、服务页、攻略页
   - 是否已经像同一套产品在带路
   - 还是只是各页分别多了一块模块

## 12. 不希望你误判的地方

请不要默认建议这些方向：

- 把整站改回深色科技风
- 把所有专有名词都翻成中文
- 继续无休止拆后台组件
- 让 daily news 自动直接公开到前台
- 为了“更像媒体站”牺牲中文新粉可读性

## 13. 我更希望你给出的输出格式

请优先按这个结构输出：

### A. 先给整站判断

- 当前这版最成功的 3 个地方
- 当前这版最需要修的 3 个问题
- 现在整站是更像“真实产品”，还是仍然明显像 demo

### B. 再按模块判断

- 首页
- 动态中心
- 明星页
- 活动详情
- 服务页 / 攻略页
- 后台 daily news 审核流

### C. 最后给下一步优先级

只给 1 到 3 个真正重要的下一步，不要发散。

## 14. 如果你需要直接看代码

优先看这些文件：

### 前台

1. `/src/app/page.tsx`
2. `/src/app/news/page.tsx`
3. `/src/app/news/[slug]/page.tsx`
4. `/src/app/stars/[slug]/page.tsx`
5. `/src/app/events/[slug]/page.tsx`
6. `/src/app/services/page.tsx`
7. `/src/app/guides/page.tsx`
8. `/src/app/globals.css`

### 内容流 / SEO

9. `/src/lib/data.ts`
10. `/src/lib/daily-news.ts`
11. `/src/lib/metadata.ts`
12. `/src/app/sitemap.ts`
13. `/src/app/robots.ts`

### 后台 / 审核流

14. `/src/components/admin-console.tsx`
15. `/src/components/admin/news-list-card.tsx`
16. `/src/components/admin/official-sources-board.tsx`
17. `/src/app/api/admin/news/route.ts`
18. `/src/app/api/admin/news/[slug]/route.ts`
19. `/src/app/api/admin/newsroom/daily/route.ts`
20. `/src/app/api/cron/daily-news/route.ts`

## 15. 如果你不能直接访问本地文件

如果你当前环境无法直接读取这些本地路径，请把这份 brief 当成“全站复查说明”，并结合：

- 关键页面截图
- 关键代码片段
- 现有部署文档

来给判断。

## 16. 一句话总结

这次我不想让你只看“某个页面漂不漂亮”，也不想让你只看“某个组件要不要继续拆”。  

我希望你从整站角度回答：

`ThaiStar Bridge / 泰娱桥 现在到底是不是一个开始像真实运营中的产品了？如果还差，最该补哪几刀？`
