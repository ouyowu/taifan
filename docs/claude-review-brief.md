# ThaiStar Bridge / 泰娱桥

Claude 复查与补充说明  
项目路径：`/Users/ouyowu/Documents/泰国娱乐圈项目`

## 0. 本次任务速览

- 本次任务：做结构复查，判断 `admin-console.tsx` 现在是否还值得继续拆
- 这次不需要直接改代码，优先给出判断与理由
- 关键文件已在第 13 节列出，请按顺序查看

## 1. 你现在接手的是什么

这是一个面向中国大陆粉丝的泰国娱乐信息聚合与服务平台 MVP。

目标不是做泛娱乐资讯站，而是做一个“降低追星门槛”的中文入口：

- 用中文解释活动、动态、票务、预约、广告应援等内容
- 保留明星名、品牌名、商场名、场馆名、活动官方标题的原始写法
- 支持后台抓取、AI 摘要、AI 翻译、活动信息提取、人工审核、保存为草稿、发布

当前方向已经比较明确：

- 中国新粉友好
- 中文解释优先
- 官方来源可信度优先
- 后台运营效率优先

## 2. 先记住这条语言规则

请不要把整个站误改成“全中文直译”。

当前规则是：

- 界面、导航、流程说明：简体中文优先
- 专有名词、官方标题、地点名称：原文保留优先
- 页面展示：中文解释 + 原文保留

重点文件：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md`

一句话总结：

`界面中文化，专有名词原文化，操作说明中文强化。`

## 3. 技术与验证注意事项

- Next.js 16.2.6 App Router
- React 19.2.4
- Tailwind CSS 4
- Supabase PostgreSQL

不要按旧 Next.js 记忆乱改，仓库里有明确提醒。必要时请查：

- `node_modules/next/dist/docs/`

补充说明：

- 这里的版本号不是按公开稳定版记忆写的
- 而是按当前本地项目环境、依赖和构建输出记录的实际值
- 请以当前仓库本地环境为准，不要自行假设“公开稳定版应该是多少”

当前稳定验证方式：

- `npm run lint`
- `npx next build --webpack`

## 4. 路径可访问性说明

这份 brief 里的路径全部使用本机绝对路径。

这意味着：

- 如果 Claude 运行在可直接访问本地工作区的环境里，这些路径可以直接使用
- 如果 Claude 运行在普通网页对话或无法读取本机文件的环境里，这些路径本身不可直接访问

如果是后一种情况，请把这份 brief 当成“复查说明”，并额外提供：

- 关键文件内容
- 或上传关键文件
- 或把需要复查的片段直接贴给 Claude

## 5. 当前最重要的背景

`src/components/admin-console.tsx` 原本是一个超大的后台主组件。  
现在它已经做过一轮系统性拆分。

### 当前状态

`admin-console.tsx` 当前大约 `1852` 行，已经不再是“所有 UI 都堆在一起”的状态。

它现在更接近：

- 顶层状态与少量表单提交逻辑
- 数据过滤与编排
- 批处理 / 草稿队列逻辑的一部分
- 调用已拆分出的子组件与 hook

也就是说：

- 它已经明显健康很多
- 但还值得复查是否已经到了“该停”的点

## 6. 已经拆出去的结构

### 后台 UI 组件

这些已经从 `admin-console.tsx` 里拆出：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/ai-ingestion-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/event-editor-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/event-list-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/ingestion-jobs-table.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/ingestion-workspace-controls.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/ingestion-workspace-notices.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/news-editor-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/news-list-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/official-sources-board.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/service-request-queue-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/star-editor-card.tsx`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/star-priority-list-card.tsx`

### 逻辑 / 内容层

这些也已经拆出：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/hooks/use-draft-queue-orchestrator.ts`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/star-priority-content.ts`

## 7. 批处理与草稿队列现状

这块最容易被误拆坏，请重点理解。

### 已经做过的事情

批处理 / 草稿队列相关状态和操作，已经开始迁入：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/hooks/use-draft-queue-orchestrator.ts`

它现在承接的核心方向包括：

- 草稿队列状态
- 活动 / 动态批处理切换
- 混合批次拆分
- 上一条 / 下一条 / 跳过 / 清空
- 工作面恢复与保存提示

### 仍然要小心的点

不要因为还能看到一些批处理状态被传给子组件，就误以为“还没拆”。  
当前剩余的复杂度，有一部分是正常的业务编排，不一定代表结构坏。

## 8. 前台页面方向

请不要把注意力只放在后台。

前台已经有一套明确的展示逻辑：

- 首页：首页偏中国新粉入口
- 活动：官方标题保留，中文说明补充
- 明星：英文名 / 原文名主展示，中文说明补充
- 动态：原始标题保留，中文摘要与中文整理优先

如果 Claude 要补充页面或调整文案，请先遵守现有语言规范，而不是重新发明一套。

## 9. 你最值得做的不是“继续盲拆”

这次请不要默认继续无休止地往下拆组件。

当前真正需要 Claude 帮忙判断的是：

1. `admin-console.tsx` 现在是否已经足够健康
2. 剩余复杂度主要属于正常业务复杂度，还是坏结构
3. 是否已经适合阶段性停止
4. 如果还值得继续，只能推荐 1 个下一步，而且必须说明收益是否真的足够高

## 10. Claude 这次最适合做的工作

我建议你做的是“结构复查与停止点判断”，不是直接大改代码。

### 请重点回答

1. 当前 `admin-console.tsx` 是否已经收敛成合理的顶层编排层
2. 剩余复杂度是否主要来自正常的批处理业务逻辑
3. 现在更适合：
   - `阶段性停止`
   - 或 `继续拆 1 刀`
4. 如果建议继续，只能推荐 1 个下一步，并说明：
   - 收益
   - 风险
   - 为什么不是现在停下

## 11. 如果你决定改代码，请遵守这些边界

- 不要回头重复拆已经拆出去的 UI 块
- 不要破坏现有“中文解释 + 原文保留”规则
- 不要无必要改动前台页面文案方向
- 不要把批处理队列逻辑拆得比现在更难追
- 每次只做一个很小的、可验证的改动

## 12. 当前验证标准

如果你有代码改动，至少需要通过：

- `npm run lint`
- `npx next build --webpack`

## 13. 你现在最该看的文件

按优先顺序看：

1. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx`
2. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/hooks/use-draft-queue-orchestrator.ts`
3. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/star-priority-content.ts`
4. `/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md`
5. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/`

## 14. 我希望你输出什么

请优先输出一份简短但明确的判断：

- `建议阶段性停止`
或
- `建议继续拆`

如果建议继续：

- 只能给 1 个下一步
- 必须说清楚为什么值得
- 最好补充“为什么现在继续拆比停下更划算”

如果建议停止：

- 请明确说明为什么当前结构已经足够健康
- 为什么剩余复杂度是正常业务复杂度，而不是坏结构
- 请顺带补充“下次在什么触发条件下再考虑重新开拆”，例如：
  - 某个主文件或 hook 再次明显膨胀
  - 某块逻辑开始被多个模块重复实现
  - 新需求导致 `admin-console.tsx` 需要同时管理跨多个子模块的共享状态
