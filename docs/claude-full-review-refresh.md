# taifan.club / 泰饭网 — Claude 全站复查包

项目路径：`/Users/ouyowu/Documents/泰国娱乐圈项目`

## 0. 本次任务速览

这不是一份“从零理解项目”的文档，而是一份给 Claude 做**当前最新版整站复查**的复查包。

请重点判断：

1. 这版前台是不是已经更像真实在运营的粉丝入口站，而不是 demo
2. 当前前台页面里，哪些已经足够稳定，哪些还最值得继续修
3. `daily news + 后台审核流 + 来源适配层` 是否已经像一条可试运营的内容流水线
4. 如果现在要往 `taifan.club` 部署，还剩哪些真正重要的问题

请不要只讲抽象设计语言。  
请尽量结合页面结构、内容流、审核流、上线风险来判断。

---

## 1. 当前新基线：以后以 `taifan.club` handoff 为准

这次前台方向已经换过一次。

请不要再按旧版“暖金媒体风”理解当前目标。  
当前最高优先级设计基线来自：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/taifan-club-source-of-truth.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/taifan-club-source-of-truth.md)

### 当前默认设计方向

- 品牌名：`泰饭网 taifan.club`
- 用户对象：中文用户的泰娱追星入口
- 页面风格：
  - 白底
  - 浅彩卡片
  - 粗黑英文标题
  - 大量明星照片和宣传海报
  - 信息密度高，但要比普通资讯站更好看

### 当前重点不是

- 不是纯资讯站
- 不是科技 SaaS
- 不是冷静极简媒体页
- 不是只会堆卡片的 CMS

### 当前想做成的感觉

- 粉丝入口站
- 内容导览站
- 追星服务入口
- 看图、看海报、再看中文整理和下一步行动

---

## 2. 当前语言规则

仍然保持：

- 界面、按钮、说明：简体中文优先
- 英文名、官方标题、品牌名、场馆名：原文保留
- 页面逻辑：`中文解释 + 原文保留`

参考：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md)

请判断这条规则现在是否还执行得稳定，尤其是：

- 首页
- 明星页
- 活动详情页
- 动态详情页

---

## 3. 当前前台已经成型的页面

当前前台主线页：

- 首页：`/src/app/page.tsx`
- 动态中心：`/src/app/news/page.tsx`
- 动态详情：`/src/app/news/[slug]/page.tsx`
- 明星页：`/src/app/stars/[slug]/page.tsx`
- 活动详情：`/src/app/events/[slug]/page.tsx`
- 活动日历：`/src/app/calendar/page.tsx`
- 服务页：`/src/app/services/page.tsx`
- 新粉攻略页：`/src/app/guides/page.tsx`

当前我对前台状态的自我判断是：

- 首页：最成熟
- 动态详情页：当前最顺的一页之一
- 活动详情页：已向动态详情页靠拢，但仍值得继续看
- 明星页：信息完整，但容易因为信息块太多而显满
- 服务页 / 攻略页：已经统一到主风格，但不是最强页

---

## 4. 当前前台最近完成过的关键调整

### 4.1 版式方向

前台已经从旧版的其他风格收回到这条方向：

- 白底
- 浅彩卡片
- 粗黑英文标题
- 大量艺人图 / 宣传海报
- 更紧凑的版式，不要太散

### 4.2 图片与海报

现在已经专门补过一轮：

- 海报墙 / 图阵
- 详情页次级卡片图文混排
- 试图解决“人脸裁切太难看”的问题

但请重点判断：

- 现在图片和海报的占比是不是已经舒服
- 有没有还在“图虽然多，但版式还是丑”的地方
- 手机端是否还有被图压过内容的问题

### 4.3 细节统一

已经统一过：

- 小字颜色
- 按钮气质
- 页脚收尾风格
- 详情页右侧信息块不再太空

### 4.4 编辑引导语言

当前几条主线已经都补了“先看什么 / 先做什么”：

- 首页：代表内容精选
- 动态中心：`Read these first`
- 明星页：`Must read 3`
- 活动日历：`Watch these first`
- 服务页：`Start with these`
- 攻略页：`Start with these chapters`

请判断：

- 这是不是已经形成统一产品语言
- 还是只是多加了几个模块

---

## 5. 当前后台与内容流

这个项目已经不是纯前台壳子了。

### 当前后台已有能力

- 内容录入
- 活动录入 / 编辑
- 动态录入 / 编辑
- 明星管理
- 服务需求队列
- 官方来源巡查板
- `daily news` 候选生成
- 审核 / 发布 / 驳回

### 当前后台主控台

- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx)

这个大文件已经做过结构拆分，不再是早期那种单块巨型 UI 文件，但仍然是后台总编排层。

---

## 6. 当前 `daily news` 流水线

### 已经接通的能力

- 来源适配
- 抓取
- AI 摘要
- AI 分类
- 候选写库
- 默认进入待发布
- 前台只读已发布
- 后台可一键发布 / 驳回

核心文件：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/daily-news.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/daily-news.ts)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/scrape.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/scrape.ts)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/ai/pipeline.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/ai/pipeline.ts)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/data.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/data.ts)

### 当前审核闭环

- 自动候选默认 `reviewed`
- `/news` 和 `/news/[slug]` 只读取 `published`
- 后台可筛：
  - `只看待发布`
  - `只看自动整理`

这条线现在已经像一条真实编辑流，而不是 demo。

---

## 7. 当前真实来源适配层

这是这版项目里最重要的新进展之一。

现在已经不只是“抓几个主页碰碰运气”，而是有一层真正的来源适配。

### 已接好的 9 条真实来源

1. `GMMTV` → 官网新闻  
2. `CHANGE ARTIST / CHANGE2561` → 官网活动  
3. `DOMUNDI TV` → YouTube 视频  
4. `OPEN LABEL` → YouTube 视频  
5. `BeOnCloud` → YouTube 视频  
6. `MEMINDY` → YouTube 视频  
7. `Studio Wabi Sabi` → Facebook 动态  
8. `Billkin Entertainment` → YouTube 视频  
9. `PP Krit Entertainment` → YouTube 视频

来源目录在：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/source-catalog.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/source-catalog.ts)

状态文档在：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ingestion-status.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ingestion-status.md)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ops-checklist.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ops-checklist.md)

请判断：

- 这层来源适配设计是否合理
- 是否已经足够成为第一版试运营来源层
- 还缺哪类来源才会更稳

---

## 8. 当前后台来源板工作流

这块也已经从“能抓”变成“能运营”。

### 现在每条来源可做的动作

- `载入链接`
- `先试抓`
- `打开原始页面`
- `复制标题和链接`
- `用这条内容生成候选`
- 如果已进系统：`去后台看这条候选`

### 预览卡还能显示

- 当前抓取模式
- 标题
- 链接
- 摘要
- 这条内容是不是已经进过系统
- 是草稿 / 待发布 / 已发布 / 已驳回

相关文件：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/official-sources-board.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/official-sources-board.tsx)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/newsroom/preview/[slug]/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/newsroom/preview/[slug]/route.ts)

请判断：

- 这个后台来源工作流是否已经够“人类编辑可用”
- 还缺不缺很关键的一步

---

## 9. 当前值班 / 试运营文档

我已经补了这几份实用文档：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/day-one-ops-plan.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/day-one-ops-plan.md)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/daily-ops-cheatsheet.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/daily-ops-cheatsheet.md)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ops-checklist.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/source-ops-checklist.md)

这意味着项目已经不只是“功能能跑”，而是开始有：

- 第一日试运营方案
- 日常值班清单
- 来源优先级和 run order

请判断：

- 这些文档是否已经足够支撑第一版人工运营
- 还需要补什么关键的 runbook

---

## 10. 上线准备状态

当前已经有：

- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/launch-checklist.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/launch-checklist.md)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/vercel-daily-news-deploy.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/vercel-daily-news-deploy.md)
- [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/taifan-club-launch-plan.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/taifan-club-launch-plan.md)

当前状态是：

- 域名 `taifan.club` 已经买好
- 但还没有完成正式线上切换
- 所以后续重点已经不是改更多页面，而是：
  - 线上部署
  - 环境变量
  - 首轮自测
  - cron 打开顺序

请重点判断：

- 现在还剩哪些真正阻塞上线的问题
- 哪些是“可以上线后再慢慢补”的

---

## 11. 当前我自己认为最值得警惕的点

请特别帮忙审这几个风险：

### 前台层
- 首页虽然是当前最成熟页，但是否已经太满
- 明星页是否信息块过多
- 手机端图片密度是否仍压过内容

### 内容层
- `daily news` 的 YouTube 类来源，标题虽然清楚，但正文天然偏短，这会不会长期让内容中心显得太“轻”
- `Studio Wabi Sabi` 这类 Facebook 预售帖是否应该独立于普通 news 对待

### 上线层
- 当前是否还存在“本地看起来很好，线上实际会掉链子”的环节
- 例如：
  - 环境变量依赖
  - Supabase 真实数据空时的表现
  - cron / 审核流 / 预览流之间的衔接

---

## 12. 希望 Claude 输出什么

请直接按下面结构回答：

1. 这版是不是已经像一个真实在跑的产品，而不是 demo
2. 前台最强的 3 个部分
3. 前台最弱的 3 个部分
4. `daily news + 来源层 + 审核流` 是否已经像一条可运营内容流水线
5. 当前最值得先修的 5 个问题（按影响力排序）
6. 现在是否已经适合开始正式部署到 `taifan.club`
7. 如果可以开始部署，最稳的上线顺序是什么

请尽量具体、务实，不要只给抽象设计评价。
