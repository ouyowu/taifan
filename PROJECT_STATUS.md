# Project Status

## 项目名称

- 泰饭网
- `taifan.club`

## 当前定位

这是一个面向中文用户的泰娱追星入口站。  
当前站点已经不只是设计稿或纯 demo，而是具备了：

- 前台展示
- 后台人工运营
- 官方来源试抓
- 真实数据库连接
- 正式线上部署

## 当前线上状态

正式站：

- [https://www.taifan.club](https://www.taifan.club)

健康检查：

- [https://www.taifan.club/api/health](https://www.taifan.club/api/health)

当前更适合的模式是：

- 先人工运营
- 先不开 AI 自动生成
- 先不开自动 cron

## 当前已经完成的部分

### 前台

- 首页
- 艺人库
- 活动日历
- 动态页
- 艺人详情页
- 活动详情页
- 服务页
- 商城页

### 后台

- 来源板试抓预览
- 动态管理
- 活动管理
- 艺人管理
- 服务请求队列
- 审核发布流

### 数据

- Supabase 项目已接通
- 首发数据已导入
- 公开读取权限已配置
- 前台已可读真实数据

### 来源层

当前已接入多条真实来源适配，包括：

- 官网新闻
- 官网活动
- YouTube 视频
- Facebook 动态

并且已支持：

- 先试抓
- 打开原始页面
- 复制标题和链接
- 判断是否已进系统

## 当前内容状态

当前首发内容已经包含：

- 艺人
- 活动
- 动态稿

首页、艺人库、动态页、活动页都已经可以显示真实内容，不再是空站。

## 当前最稳的运营方式

### 有 AI key 之前

建议使用人工模式：

1. 后台来源板先试抓
2. 看标题和链接值不值得发
3. 手动新增动态
4. 手动补活动
5. 审核后发布

这套模式已经能正常运行，而且成本最低。

## 当前还没做或故意没开的

- AI 自动摘要 / 自动正文
- 自动批量 daily news 候选
- cron 定时自动跑

这些不是坏掉，而是当前为了省钱、先稳住人工运营而暂时不开。

## 当前最值得继续做的事

### 产品层

- 继续补更多艺人资料和图库
- 继续补 6 月到 10 月的活动和对应动态稿
- 继续做内容密度和前台一致性优化

### 运维层

- 配置 AI key（如果要打开自动候选）
- 再决定是否开启 cron
- 持续检查 `/api/health`

## 关键文件和文档

### 先看这些

- [README.md](README.md)
- [docs/deploy-readiness-now.md](docs/deploy-readiness-now.md)
- [docs/manual-ops-no-ai.md](docs/manual-ops-no-ai.md)
- [docs/day-one-ops-plan.md](docs/day-one-ops-plan.md)
- [docs/daily-ops-cheatsheet.md](docs/daily-ops-cheatsheet.md)

### 数据相关

- [docs/supabase-first-launch-import-guide.md](docs/supabase-first-launch-import-guide.md)
- [docs/supabase-first-launch-seed.sql](docs/supabase-first-launch-seed.sql)
- [supabase/migrations/20260516_init.sql](supabase/migrations/20260516_init.sql)

### 审查相关

- [docs/claude-full-review-refresh.md](docs/claude-full-review-refresh.md)
- [docs/claude-codebase-bundle.xml](docs/claude-codebase-bundle.xml)

## 给 Claude 或合作者的一句话

这不是一个“从零开始”的项目了。  
现在更准确的状态是：

**前台和后台都已经在线，真实数据库也接通了，当前阶段重点是人工运营、内容继续做厚，以及决定何时打开 AI 自动整理。**
