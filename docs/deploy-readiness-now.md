# 泰饭网当前上线缺项

Last updated: 2026-05-18

这份清单只回答一件事：

> 现在距离真正上线，还差什么？

请先打开：

- `/api/health`

如果你现在看到的仍然和本地一致，那么当前最主要缺项就是下面这些。

## 1. 站点地址还没正式接好

当前健康检查会提示：

- `siteUrl = warning`

这代表：

- 还没有明确配置 `NEXT_PUBLIC_SITE_URL`
- 当前站点仍可能回退到 `localhost` 或临时 Vercel 地址

上线前必须改成：

- `https://taifan.club`

## 2. Supabase 还没真正连通

当前健康检查会提示：

- `publicSupabase = error`
- `adminSupabase = error`

这代表这些变量还没完整配置或没权限：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

上线前必须确认：

- 前台能读
- 后台能写
- migration 已跑
- 至少已经有一些真实数据

## 3. AI 可以后补，不阻塞首发

如果你准备先走“省钱上线”模式，当前健康检查会提示：

- `ai = warning`

这代表至少还没配这三家中的任意一家：

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

没有 AI key 的情况下：

- `daily news` 自动候选不会正常生成
- 但前台网站、Supabase、后台审核、艺人库、活动日历都可以先上线
- 推荐先用人工试抓 + 人工审核模式运营

## 4. cron 先保留手动模式

在未配置 AI key 的情况下，健康检查会提示：

- `cron = warning`

这通常代表：

- `CRON_SECRET` 已配置，但当前建议保持人工模式

在 AI key 没接通之前：

- 不要依赖自动跑
- 先完成一次手动试抓 → 人工筛选 → 审核 → 发布

## 5. 真实数据要先过一遍人工检查

现在页面结构、艺人页、活动页和动态页都已经有足够厚度。

但上线前还要再做一次人工核查：

- 首页是不是已经显示真实活动，而不是只靠示例内容
- `/news` 有没有真实发布稿
- `/artists` 里主追艺人的资料是不是够用
- `/calendar` 看起来是不是像真实未来几个月行程

## 上线前最稳顺序

1. 配 `NEXT_PUBLIC_SITE_URL`
2. 配 Supabase 三个关键变量
3. 配 `CRON_SECRET`
4. 再看一次 `/api/health`
5. 先用人工模式上线
6. 手动试抓并发布 `2 到 5` 条
7. 以后再补 AI key
8. 最后才开自动 daily news

## 通过标准

只有当下面这些都成立，才算真正接近可上线：

- `siteUrl = ok`
- `publicSupabase = ok`
- `adminSupabase = ok`
- `ai = warning` 或 `ok`
- `cron = warning` 或 `ok`

如果 `siteUrl / publicSupabase / adminSupabase` 里还有红色，不建议直接对外开放。
