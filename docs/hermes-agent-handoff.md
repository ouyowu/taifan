# ThaiStar Bridge / 泰娱桥

Hermes agent 交接文档  
项目路径：`/Users/ouyowu/Documents/泰国娱乐圈项目`

## 1. 项目定位

这是一个面向中国大陆粉丝的泰国娱乐信息聚合与服务平台 MVP。

目标不是做泛娱乐资讯站，而是做“降低追星门槛”的中文入口：

- 用中文解释活动、动态、购票、预约、广告应援等内容
- 保留明星名、品牌名、商场名、场馆名、活动官方标题的原始英文或官方写法
- 支持后台抓取、AI 摘要/翻译/活动提取、人工审核、落草稿、发布

当前 UI 和文案方向已经明显偏：

- 中国新粉友好
- 中文解释优先
- 官方来源可信度优先
- 后台运营效率优先

## 2. 技术栈

- Next.js 16.2.6 App Router
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui 风格组件
- Supabase PostgreSQL
- AI SDK + OpenAI / Claude / Gemini
- Cheerio 抓取静态正文

关键依赖见：

- [package.json](/Users/ouyowu/Documents/泰国娱乐圈项目/package.json)

## 3. 非常重要的环境注意事项

### 3.1 Next.js 版本注意

仓库里有 AGENTS.md，明确要求：

- 这个 Next.js 版本不要按旧记忆乱写
- 写代码前要看 `node_modules/next/dist/docs/`

本次开发已确认本地文档路径可用，例如：

- `node_modules/next/dist/docs/index.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md`

### 3.2 构建验证方式

当前环境里：

- `npm run lint` 可正常作为主要 lint 检查
- 默认 `next build` 在本环境曾出现 Turbopack 相关噪音
- 当前稳定验证方式是：
  - `npm run lint`
  - `npx next build --webpack`

如果 Hermes agent 要继续改代码，建议也按这个方式验证。

### 3.3 字体处理

项目已经去掉对在线 Google Fonts 的依赖，改成了本地可用方案，避免受限环境下构建失败。

相关文件：

- [src/app/layout.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/layout.tsx)
- [src/app/globals.css](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/globals.css)

## 4. 数据与领域模型

领域类型在：

- [src/types/domain.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/types/domain.ts)

当前核心类型：

- `Star`
- `Event`
- `NewsItem`
- `ServiceItem`

注意当前数据模型仍然是“单字段 + 展示规范”模式，而不是“官方标题字段 + 中文标题字段”双字段模式。

也就是说，目前主要依靠以下规则工作：

- `title` 里通常放官方原始标题
- `summary` / `excerpt` / `bio` 里放中文说明
- 页面展示层负责强调“原文保留 + 中文解释”

## 5. 数据来源与读取层

主要数据读取层：

- [src/lib/data.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/data.ts)

这里负责：

- 优先走 Supabase
- 无 Supabase 时回退 mock 数据
- 映射 `events / stars / news_posts / service_requests / ingestion_jobs`
- 生成来源标签
- 明星优先级排序
- 详情页拼装关联数据

重要规则：

- `listStars()` 会按 `china_fan_priority` 优先，再按热度排序
- `listEvents()` / `listNews()` 会自动带上 `sourceLabel`
- 详情页数据会拼关联明星 / 相关新闻 / 相关活动 / 前后导航

## 6. 数据库

Supabase 相关文件：

- [supabase/migrations/20260516_init.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/supabase/migrations/20260516_init.sql)
- [supabase/seed.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/supabase/seed.sql)
- [src/lib/supabase/server.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/supabase/server.ts)
- [src/lib/supabase/client.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/supabase/client.ts)

当前重点表方向：

- `stars`
- `events`
- `event_stars`
- `news_posts`
- `service_requests`
- `ingestion_jobs`

重要补充：

- `stars` 已支持 `china_fan_priority`
- 活动与明星关系通过 `event_stars`
- `ingestion_jobs` 已支持保存：
  - `raw_content`
  - `translated_content`
  - `summary`
  - `extracted_payload`

## 7. 当前前台页面状态

### 首页

文件：

- [src/app/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/page.tsx)

当前已实现：

- Hero
- 官方内容数量 / 最近更新时间
- 最近活动
- 最新动态
- 可信来源提示
- Top 热门追踪
- 中文粉丝高关注明星
- 大量新粉引导卡
- 语言规范提示已开始融入首页卡片

注意：

- 首页里已经积累了很多“新粉提示卡”
- 如果 Hermes 继续改，建议优先做收敛和整合，而不是继续无限增加更细碎的提示块

### 活动日历

文件：

- [src/app/calendar/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/calendar/page.tsx)

已实现：

- 活动列表
- 官方来源筛选
- “官方标题保留 + 中文说明”展示规则

### 活动详情页

文件：

- [src/app/events/[slug]/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/events/[slug]/page.tsx)

已实现：

- 官方标题保留
- 中文说明
- 场馆 / 商场原文保留
- 一键搜索官方标题
- 一键搜索场馆原文
- 关联明星
- 相关新闻
- 前后活动导航

### 明星详情页

文件：

- [src/app/stars/[slug]/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/stars/[slug]/page.tsx)

已实现：

- 英文名主展示
- 中文页常用称呼
- 中文简介
- 活动时间线
- 相关新闻 / 关联活动

### 动态列表

文件：

- [src/app/news/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/news/page.tsx)

已实现：

- 动态列表
- 官方来源筛选
- 原始标题 / 官方写法
- 中文摘要

### 动态详情

文件：

- [src/app/news/[slug]/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/news/[slug]/page.tsx)

已实现：

- 原始标题 / 官方写法
- 中文摘要
- 中文整理
- 一键搜索原始标题
- 一键打开原始来源
- 关联明星
- 相关活动
- 相关新闻
- 上一条 / 下一条

### 其他页

- [src/app/services/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/services/page.tsx)
- [src/app/guides/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/guides/page.tsx)

这些页面已具备 MVP 结构，但后续仍可继续优化内容密度和视觉质量。

## 8. 后台状态

后台入口：

- [src/app/admin/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/admin/page.tsx)
- [src/components/admin-console.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx)

这是当前最复杂、最值得 Hermes 重点理解的文件之一。

### 后台已实现的核心模块

#### 8.1 服务需求队列

- 浏览服务请求
- 改状态

#### 8.2 抓取任务队列

已实现：

- 来源筛选
- 状态筛选
- 任务勾选
- 批量状态更新
- 单条建议方向判断
- 单条推荐按钮高亮
- 批量推荐方向处理
- 混合批次提醒
- 自动拆成两批
- 活动批处理完自动切到动态批
- 顶部状态提示：当前批次 / 后续剩余批次
- 会话级记住：
  - 来源筛选
  - 状态筛选
  - 当前勾选任务

#### 8.3 活动管理

已实现：

- 新增活动
- 编辑活动
- 删除活动
- 改状态
- 关联明星
- 中文说明 / 原文标题规则
- 批处理活动草稿

#### 8.4 动态录入

已实现：

- 新增动态
- 编辑动态
- 删除动态
- AI 结果回填动态草稿
- 中文摘要 / 原始标题规则

#### 8.5 明星录入

已实现：

- 新增明星
- 编辑明星
- 删除明星
- 中国粉丝优先级排序
- 上移 / 下移 / 设为 TOP 1 / 重置推荐排序
- 导出顺序与各种运营文案

注意：

- 这里堆了很多“复制某种安利文案”的按钮
- 功能上可用，但从产品整洁度看，可能已经过量
- Hermes 若要整理后台 UX，这里是很好的收敛点

## 9. AI / 抓取流程

### 9.1 抓取

文件：

- [src/lib/scrape.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/scrape.ts)
- [src/app/api/admin/scrape/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/scrape/route.ts)

用于抓页面正文。

### 9.2 AI 处理

文件：

- [src/lib/ai/pipeline.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/ai/pipeline.ts)
- [src/app/api/ai/process/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/ai/process/route.ts)

支持：

- 翻译
- 摘要
- 活动信息提取

### 9.3 入队

文件：

- [src/app/api/admin/ingestion/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/ingestion/route.ts)
- [src/app/api/admin/ingestion/[id]/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/ingestion/[id]/route.ts)
- [src/app/api/admin/ingestion/bulk/route.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/api/admin/ingestion/bulk/route.ts)

### 9.4 当前 AI 草稿回填规则

当前已经不是简单“把结果塞进表单”，而是：

- 活动草稿：
  - `title` 尽量保留官方标题
  - `summary` 自动整理成更像中文活动说明
- 动态草稿：
  - 自动生成 `原始标题 / 官方写法`
  - 自动生成 `中文摘要`
  - 自动拼 `中文整理`
  - 自动补 `原文保留建议`
  - 自动补来源区块

相关逻辑都在：

- [src/components/admin-console.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx)

## 10. 官方来源目录

文件：

- [src/lib/source-catalog.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/source-catalog.ts)
- [src/lib/source-metadata.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/source-metadata.ts)

当前已内置一批泰娱相关官方来源，例如：

- CHANGE ARTIST
- OPEN LABEL
- DOMUNDI TV
- MEMINDY
- Studio Wabi Sabi
- GMMTV
- BeOnCloud

后台支持：

- 选择官方来源
- 回填来源链接
- 批量加入巡检
- 来源识别和来源标签补全

## 11. 语言展示规则

这是项目当前非常重要的产品约定。

文档：

- [docs/language-display-guidelines.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md)

核心原则：

- 界面、导航、说明文案：简体中文
- 专有名词：原文保留
  - 明星名
  - 品牌名
  - 商场名
  - 场馆名
  - 官方活动标题
- 页面展示方式：`中文解释 + 原文保留`

Hermes 不要轻易把它改成“全中文翻译”，否则会破坏搜索、地图、票务和官宣核对体验。

## 12. 中国粉丝优先级逻辑

项目里已经把一批中国粉丝更熟悉的泰星前置：

- Bright
- Win
- Billkin
- PP Krit
- Gemini
- Fourth

实现点：

- 数据字段：`china_fan_priority`
- 后台支持可视调整
- 首页 `Top 热门追踪`

相关文件：

- [src/lib/data.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/data.ts)
- [src/lib/mock-data.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/mock-data.ts)
- [src/components/admin-console.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx)
- [src/app/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/page.tsx)

## 13. 当前已知问题 / 适合 Hermes 接手的方向

### 优先级高

1. 后台 `admin-console.tsx` 过大  
当前单文件承担了太多职责，适合拆：
- 队列卡片
- 批处理控制
- 明星排序工具
- 动态录入
- 活动录入

2. 新粉提示卡过多  
首页已经积累了大量“如果今天只看 1 条 / 3 分钟 / 只刷一眼”之类的提示块。  
这些是可工作的，但产品层面已经开始有“信息噪音”风险，适合做收敛和分组。

3. 队列状态流可以继续优化  
现在已经很强，但还能继续：
- 更清晰的批次概览
- 已处理任务的归档视图
- 拆批后两批之间更强的进度提示

### 优先级中

4. 数据模型仍是“单字段 + 约定”  
如果后面内容量变大，可能值得升级成显式双字段：
- `official_title`
- `cn_summary`
- `official_venue`
- `cn_note`

但这会波及 DB、API、表单和前台，当前还没做。

5. AI 结果结构可以更稳定  
当前 `extracted_payload` 已可用，但若后续要批量化、自动化更强，建议规范字段 schema。

6. 后台“运营文案复制按钮”过多  
功能没错，但可以考虑折叠、分组或改成一个生成器。

## 14. Hermes 建议先读哪些文件

如果 Hermes 要最快接手，建议按这个顺序读：

1. [docs/language-display-guidelines.md](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md)
2. [src/components/admin-console.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx)
3. [src/lib/data.ts](/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/data.ts)
4. [src/app/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/page.tsx)
5. [src/app/events/[slug]/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/events/[slug]/page.tsx)
6. [src/app/news/[slug]/page.tsx](/Users/ouyowu/Documents/泰国娱乐圈项目/src/app/news/[slug]/page.tsx)
7. [supabase/migrations/20260516_init.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/supabase/migrations/20260516_init.sql)

## 15. Hermes 建议优先任务

如果希望 Hermes 帮忙“检查修复补充”，建议优先让他做：

1. 审查 `src/components/admin-console.tsx` 的结构和可维护性  
目标：提出拆分方案或直接重构成多个子组件。

2. 审查首页是否存在信息过载  
目标：保留新粉友好，但减少碎片化提示。

3. 审查 AI 草稿流和批处理流  
目标：查漏补缺，确认有没有状态边界问题、遗漏场景、体验断点。

4. 审查语言展示规则落地是否一致  
目标：找出仍然没按“中文解释 + 原文保留”执行的页面或组件。

5. 审查 DB / API / UI 是否值得演进到双字段模式  
目标：给出是否要升级为显式双字段模型的判断。

## 16. 当前验证状态

交接前最后一次验证结果：

- `npm run lint` 通过
- `npx next build --webpack` 通过

## 17. 给 Hermes 的一句话总结

这个项目当前已经不是“空壳 MVP”，而是一个：

- 前台可读
- 后台可运营
- AI 可入队
- 批处理可连续跑
- 语言策略已明确

的泰娱中文信息平台雏形。

Hermes 最适合接手的不是“从零搭功能”，而是：

- 检查结构问题
- 收敛过度堆叠的 UI
- 修补批处理和 AI 流程边角
- 让这套系统更稳、更清晰、更容易继续扩。
