# 泰饭网 · taifan.club

面向中文用户的泰娱追星入口站。  
这个项目把 3 条主线放到同一个站里：

- 艺人库
- 活动日历
- 动态内容与官方来源追踪

现在这套站点已经支持：

- 前台网站展示
- 后台人工录入和审核
- 官方来源试抓预览
- Supabase 真实数据读取
- 低成本人工运营模式

## 现在的运营模式

当前最稳的上线方式是：

- 网站先上线
- Supabase 接通
- 后台人工运营
- 先不开 AI 自动生成
- 先不开 cron 自动跑

也就是说，现在可以先用它做：

- 手动新增艺人
- 手动新增活动
- 手动新增动态
- 在后台先试抓官方来源
- 审核后再发布到前台

如果以后要打开自动候选生成，再补 AI key 就可以。

## 主要能力

### 前台

- 首页内容导流
- 艺人库 `/artists`
- 活动日历 `/calendar`
- 动态页 `/news`
- 艺人详情页
- 活动详情页
- 服务页 `/services`
- 商城页 `/shop`

### 后台

- 来源板试抓预览
- 动态管理
- 活动管理
- 艺人管理
- 服务请求队列
- 候选内容审核

### 数据与部署

- Supabase
- Vercel
- `/api/health` 健康检查
- 首发 SQL 建表与导入脚本

## 技术栈

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Supabase
- Vercel

可选 AI 提供方：

- OpenAI
- Anthropic
- Gemini

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

构建检查：

```bash
npm run lint
npx next build --webpack
```

## 上线前最关键的几件事

1. Supabase 表结构已创建
2. 首发内容已导入
3. Vercel 环境变量已配置
4. `/api/health` 至少 `siteUrl / publicSupabase / adminSupabase` 为 `ok`
5. 前台首页、艺人库、动态页已经能读到真实数据

## 推荐阅读顺序

### 如果你要上线

- [当前上线缺项](docs/deploy-readiness-now.md)
- [上线操作清单](docs/launch-checklist.md)
- [taifan.club 上线顺序](docs/taifan-club-launch-plan.md)
- [cron 首次开启前检查](docs/cron-first-run-preflight.md)

### 如果你要人工运营

- [没有 AI key 时的后台日常流程](docs/manual-ops-no-ai.md)
- [第一天试运营方案](docs/day-one-ops-plan.md)
- [日常值班清单](docs/daily-ops-cheatsheet.md)
- [来源层巡检清单](docs/source-ops-checklist.md)

### 如果你要导入数据库

- [Supabase 首发导入说明](docs/supabase-first-launch-import-guide.md)
- [Supabase 首发 SQL 数据包](docs/supabase-first-launch-seed.sql)
- [初始化 migration](supabase/migrations/20260516_init.sql)

### 如果你要继续审查前台或交接给别人

- [Claude 最新整站复查包](docs/claude-full-review-refresh.md)
- [Claude 最新代码总包](docs/claude-codebase-bundle.xml)
- [语言展示规则](docs/language-display-guidelines.md)

## 当前项目状态

目前项目已经不是纯 demo：

- 前台结构已成型
- 真实 Supabase 已接通
- 首发艺人 / 活动 / 动态已入库
- 后台人工运营链路可用

当前仍然属于更稳的阶段：

- 先人工运营
- 再决定是否开启 AI 自动整理

## 备注

这个仓库里同时包含：

- 前台页面
- 后台页面
- 来源适配逻辑
- 上线文档
- 首发 SQL

如果你只是想继续改前台视觉，优先看：

- `src/app/`
- `src/components/layout/`
- `src/components/artist-search.tsx`
- `src/components/calendar-filter.tsx`
