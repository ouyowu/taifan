# 泰饭网 taifan.club 上线操作清单

这份清单默认你要把站点正式放到线上，并启用：

- 前台公开页面
- 后台管理
- 每日自动 news 候选

## 1. 先做数据库准备

在 Supabase 里确认这些 migration 都已经执行：

- [20260516_init.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/supabase/migrations/20260516_init.sql)
- [20260517_news_review_status.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/supabase/migrations/20260517_news_review_status.sql)

重点确认：

- `stars`
- `events`
- `news_posts`
- `ingestion_jobs`
- `service_requests`

都已经存在。

另外确认 `news_posts` 里已经有：

- `review_status`

## 2. 准备 Vercel 环境变量

至少配置这些：

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

AI 供应商至少配一个：

- `OPENAI_API_KEY`
或
- `ANTHROPIC_API_KEY`
或
- `GOOGLE_GENERATIVE_AI_API_KEY`

兼容保留：

- `DAILY_NEWS_CRON_SECRET`

但如果你已经配置了 `CRON_SECRET`，优先用它。

## 3. 部署前本地自查

先在本地确认这两项都通过：

- `npm run lint`
- `npx next build --webpack`

如果这里都不过，不要先上 Vercel。

## 4. 确认 cron 配置存在

项目根目录必须有：

- [vercel.json](/Users/ouyowu/Documents/泰国娱乐圈项目/vercel.json)

当前默认每天执行时间：

- `01:05 UTC`
- 曼谷时间约 `08:05`

如果你想改，就改 `vercel.json` 里的 `schedule` 再重新部署。

## 5. 首次生产部署

首次部署后，先不要立刻相信“它应该会跑”。

你需要检查 3 件事：

1. Vercel 项目已经是 production 部署成功
2. `Cron Jobs` 页面里能看到：
   - `/api/cron/daily-news`
3. 环境变量已经全部注入到 production

另外请先打开：

- `/api/health`

确认至少这些状态是正常的：

- 站点地址
- 前台 Supabase 读取
- 后台 Supabase 连接
- AI key
- cron secret

## 6. 手动验证 daily news 流程

在后台先手动跑一次：

1. 打开后台
2. 进入 AI / 官方来源巡查区
3. 点：
   - `生成今日 news 候选`

预期结果：

- 能成功生成候选
- 不会直接出现在前台
- 会进入后台动态列表

## 7. 验证后台审核流

在内容管理里，把动态筛选切到：

- `只看待发布`
- `只看自动整理`

然后确认：

- 能看到今日自动整理的条目
- 点 `发布` 后，状态变成已发布
- 点 `驳回` 后，状态变成已驳回

## 8. 验证前台只读正式稿

发布前：

- `/news`
- `/news/[slug]`

都不应该出现待发布自动稿。

发布后：

- `/news` 能看到新条目
- `/news/[slug]` 能正常打开
- 页面会显示：
  - 原始标题
  - 来源
  - 中文整理结构

## 9. 验证搜索层

上线后检查：

- `/robots.txt`
- `/sitemap.xml`

要确认：

- robots 正常返回
- sitemap 里包含：
  - 首页
  - news 列表
  - news 详情
  - 明星页
  - 活动页

## 10. 第一天上线建议

建议不要一上来完全放手自动跑。

更稳的做法：

1. 先手动触发一次 daily news
2. 审核并发布 1 到 3 条
3. 看前台展示和 SEO 信息是否正常
4. 再等 Vercel cron 到时间自动跑

## 11. 如果 cron 没跑，先查这些

先查最常见的 5 个点：

1. `vercel.json` 是否已随最新代码部署
2. `CRON_SECRET` 是否已配置
3. `/api/cron/daily-news` 是否返回 401
4. `SUPABASE_SERVICE_ROLE_KEY` 是否缺失
5. AI key 是否缺失，导致生成流程失败

如果你不确定是环境问题还是代码问题，先看：

- `/api/health`

## 12. 当前默认运营节奏

最推荐的日常动作：

每天早上：

1. 看自动生成候选
2. 筛 `只看待发布`
3. 再筛 `只看自动整理`
4. 快速发布值得上的条目
5. 驳回明显重复或价值不高的条目

这样会比全部手工录入轻很多，又不会把自动内容直接裸发出去。
