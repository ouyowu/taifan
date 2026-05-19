# Vercel 每日 News 自动化部署说明

这条线已经具备两种触发方式：

- 后台手动触发：`/api/admin/newsroom/daily`
- Vercel 定时触发：`/api/cron/daily-news`

## 当前配置

项目根目录已经新增：

- [vercel.json](/Users/ouyowu/Documents/泰国娱乐圈项目/vercel.json)

当前 cron 配置为：

- 每天 `01:05 UTC`
- 对应曼谷时间 `08:05`

也就是每天早上会自动跑一轮“官方来源 → 自动整理 news 候选”。

## 环境变量

在 Vercel 项目里至少配置这些变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
或
- `ANTHROPIC_API_KEY`
或
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `CRON_SECRET`
- `DAILY_NEWS_DISABLED_SOURCES`（可选，用逗号分隔来源 slug，比如 `gmmtv-instagram,beoncloud-instagram`）

兼容保留：

- `DAILY_NEWS_CRON_SECRET`

但推荐直接使用 Vercel 官方文档建议的 `CRON_SECRET`。

## 自动运行逻辑

定时任务命中 `/api/cron/daily-news` 后，会：

1. 遍历官方来源清单
   - 会自动跳过已在 `DAILY_NEWS_DISABLED_SOURCES` 里停用的来源
2. 抓取公开页面正文
3. 用 AI 生成中文摘要
4. 自动分类为：
   - `活动速递`
   - `品牌活动`
   - `官宣`
   - `直播`
5. 生成站内 `news_posts`
6. 默认写入 `review_status = reviewed`
7. 不会直接进入前台公开列表

也就是说：

- 自动生成内容会先进入“待发布”
- 需要你在后台确认后再公开

## 后台审核路径

在后台内容管理里：

1. 打开“内容录入”
2. 在动态列表里把筛选切到：
   - `只看待发布`
   - `只看自动整理`
3. 审核后：
   - 点 `发布`
   - 或点 `驳回`

前台 `news` 列表和详情页只读取 `published` 的新闻，所以不会把未确认内容直接暴露出去。

## 如果你想改时间

只需要改 [vercel.json](/Users/ouyowu/Documents/泰国娱乐圈项目/vercel.json) 里的 cron 表达式，然后重新部署。

当前值：

```json
{
  "path": "/api/cron/daily-news",
  "schedule": "5 1 * * *"
}
```

## 参考

我这次按 Vercel 官方文档对齐了两个点：

- `vercel.json` 里的 `crons`
- `CRON_SECRET` 会作为 `Authorization: Bearer ...` 自动带给 cron 路由

官方文档：

- [Vercel Cron Jobs Quickstart](https://vercel.com/docs/cron-jobs/quickstart)
- [Managing Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- [vercel.json Configuration](https://vercel.com/docs/project-configuration/vercel-json)
