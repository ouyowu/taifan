# 任务：创建抓取任务队列控制组件

工作目录
/Users/ouyowu/Documents/泰国娱乐圈项目

本轮只允许动的文件或区域
- 新建 src/components/IngestionQueueControl.tsx
- 只能修改此新文件
- 不能修改现有的 src/components/admin-console.tsx 或其他文件

必须参考的上下文文件
- docs/language-display-guidelines.md
- src/types/domain.ts
- src/lib/data.ts
- src/components/admin-console.tsx（参考抓取任务队列相关逻辑，特别是行1700-1822之间的"抓取任务队列"卡片内容）
- supabase/migrations/20260516_init.sql

必须保留的现有能力
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
- 会话级记住：来源筛选、状态筛选、当前勾选任务

输出要求
1. 直接修改代码（创建新文件）
2. 说明改了哪些文件
3. 说明为什么这样做
4. 给出验证结果

验证要求
- npm run lint
- npx next build --webpack