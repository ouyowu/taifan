# ThaiStar Bridge / 泰娱桥

面向中国大陆粉丝的泰国娱乐信息聚合与服务平台 MVP。  
当前重点能力：

- 泰国明星活动中文日历
- 明星动态 news 中心
- 官方来源巡检与 AI 整理
- 后台内容管理与审核发布
- 每日自动 news 候选生成

## 当前技术栈

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Supabase
- OpenAI / Claude / Gemini（按环境变量选择）
- Vercel（部署与 cron）

## 本地运行

先准备环境变量：

```bash
cp .env.example .env.local
```

然后启动：

```bash
npm install
npm run dev
```

构建验证：

```bash
npm run lint
npx next build --webpack
```

## 关键文档

- [语言展示规则](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md>)
- [Vercel 每日 News 自动化部署说明](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/vercel-daily-news-deploy.md>)
- [上线操作清单](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/launch-checklist.md>)
- [当前上线缺项](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/deploy-readiness-now.md>)
- [taifan.club 上线顺序](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/taifan-club-launch-plan.md>)
- [第一天试运营方案](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/day-one-ops-plan.md>)
- [日常值班清单](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/daily-ops-cheatsheet.md>)
- [cron 首次开启前检查](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/cron-first-run-preflight.md>)
- [Claude 最新整站复查包](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/claude-full-review-refresh.md>)
- [四周执行计划](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/week-plan.md>)

## 当前内容流

1. 官方来源巡检
2. 抓取正文
3. AI 生成中文摘要 / 提取内容
4. 自动写入 daily news 候选
5. 后台审核
6. 发布到前台 news 板块

## 每日自动 News

当前支持两种触发方式：

- 后台手动触发：`/api/admin/newsroom/daily`
- Vercel 定时触发：`/api/cron/daily-news`

上线前健康检查入口：

- `/api/health`

自动生成内容默认会进入：

- `待发布`

不会直接公开到前台，需要后台确认后再发布。

## 部署前最重要的事

不要只看代码是否能跑，还要确认：

- Supabase migration 已执行
- `SUPABASE_SERVICE_ROLE_KEY` 已配置
- 至少一个 AI key 已配置
- `CRON_SECRET` 已配置
- Vercel production 部署成功
- 后台能筛到 `只看待发布` + `只看自动整理`

完整步骤见：

- [上线操作清单](</Users/ouyowu/Documents/泰国娱乐圈项目/docs/launch-checklist.md>)
