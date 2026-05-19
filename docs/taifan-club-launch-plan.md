# taifan.club 上线顺序

这份清单只做一件事：

- 让 `ThaiStar Bridge / 泰娱桥` 先安全上预览
- 再绑定正式域名 `taifan.club`
- 最后打开每日自动 news

适合你现在这种状态：

- 前台页面已经基本定稿
- 后台审核流已经接好
- daily news 自动整理已经能跑
- 但正式域名还没买，线上项目也还没单独建

## 推荐顺序

最稳的方式不是“买域名后一次全上”，而是分 3 步：

1. 先建 Vercel 项目并拿到预览地址
2. 再绑定 `taifan.club`
3. 最后再打开 cron，让 daily news 每天自动跑

这样好处是：

- 页面问题可以先在预览地址上看
- 域名和 SEO 设置不会和页面调试搅在一起
- 自动 news 不会在你还没确认后台审核流时就开始跑

## 第 1 步：先上一个临时正式预览

先在 Vercel 新建这个项目，建议项目名直接用：

- `taifan-club`

先不要急着配域名，先把这些环境变量配上：

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

### 这一步 `NEXT_PUBLIC_SITE_URL` 先写什么

在还没买 `taifan.club` 之前，先写 Vercel 给你的正式项目域名，例如：

- `https://taifan-club.vercel.app`

不要留空，也不要先写错域名。

## 第 2 步：先做首轮线上验证

先别急着把站给别人看，先自己查这几项：

### 前台

- 首页正常打开
- `/news` 正常打开
- `/calendar` 正常打开
- `/stars/...` 有内容
- `/events/...` 有内容
- 手机版首屏不乱

### 后台

- `/admin` 能打开
- 能看到动态列表
- 能看到服务需求列表
- 能筛 `只看待发布`
- 能筛 `只看自动整理`

### SEO

- `/robots.txt` 正常
- `/sitemap.xml` 正常
- 分享链接时标题、描述、图片不是 localhost

### 健康检查

- `/api/health` 正常打开
- 站点地址不是 localhost
- Supabase 前后台状态正常
- AI key 和 cron secret 状态正常

## 第 3 步：买域名后绑定 taifan.club

域名买好后，在 Vercel 项目里加：

- `taifan.club`

建议同时加：

- `www.taifan.club`

然后把主域设成：

- `taifan.club`

### 域名绑定完成后，要立刻改这件事

把环境变量：

- `NEXT_PUBLIC_SITE_URL`

改成：

- `https://taifan.club`

然后重新部署一次。

这一步很重要，因为它会影响：

- canonical
- Open Graph
- Twitter 卡片
- 结构化数据里的页面地址
- sitemap 里的链接

## 第 4 步：域名切好后再开自动 news

建议不要在第一次部署就直接让 cron 开始跑。

更稳的顺序是：

1. 后台先手动点一次 `生成今日 news 候选`
2. 看候选是否正常进入待发布
3. 手动发布 1 到 3 条
4. 前台确认 news 展示正常
5. 再让 cron 每天自动跑

## 第 5 步：cron 打开后的每日动作

每天只要做这几步：

1. 打开后台
2. 去动态管理
3. 筛：
   - `只看待发布`
   - `只看自动整理`
4. 快速看一遍标题和摘要
5. 值得上的就发布
6. 重复或价值低的就驳回

## 上线当天最容易忘的 5 件事

1. `NEXT_PUBLIC_SITE_URL` 还是旧的 Vercel 地址
2. Supabase migration 没跑全
3. `SUPABASE_SERVICE_ROLE_KEY` 没配
4. `CRON_SECRET` 没配
5. 买了域名但没把 `www` 和裸域都处理好

## 如果你想最稳

最推荐的实际上线节奏：

- Day 1：预览地址上线，后台和前台自测
- Day 2：绑定 `taifan.club`
- Day 3：手动跑 daily news，人工审核
- Day 4：打开每日 cron

这样基本不会因为一个地方没配好，就把全部流程一起卡住。
