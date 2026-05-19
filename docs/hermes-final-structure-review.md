# ThaiStar Bridge / 泰娱桥

Hermes 最终结构复查简报  
项目路径：`/Users/ouyowu/Documents/泰国娱乐圈项目`

## 0. 本次任务速览

- 本次任务：对 `admin-console.tsx` 做最终结构复查
- 这次不要直接改代码，先判断现在是否已经适合阶段性停止继续拆分
- 如果你认为还值得继续，只允许推荐 1 个下一步，而且要明确说明收益是否真的足够高

## 1. 这次复查的核心问题

最初的后台主文件 `src/components/admin-console.tsx` 是一个非常大的 UI + 状态 + 流程混合文件。  
经过多轮重构后，它现在已经不是“所有东西都堆在一起”的状态了。

现在需要 Hermes 回答的不是“还能不能继续拆”，而是：

1. 它现在是否已经收敛成合理的顶层编排层
2. 剩余复杂度是否主要来自正常的业务编排复杂度
3. 现在是否适合阶段性停止结构重构

## 2. 当前已完成的拆分

### 2.1 UI 组件层

这些已经从 `admin-console.tsx` 中拆出：

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

### 2.2 逻辑 / 内容层

这些也已经从主文件中拆出：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/hooks/use-draft-queue-orchestrator.ts`
- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/star-priority-content.ts`

## 3. 这次最关键的新变化

这轮最重要的不是又拆了几个卡片，而是：

### 3.1 草稿队列与批处理编排已经进 Hook

当前以下状态与流程，已经迁入：

- `src/hooks/use-draft-queue-orchestrator.ts`

承接的方向包括：

- 草稿队列状态
- 活动 / 动态批处理切换
- 混合批次拆分
- 上一条 / 下一条 / 跳过 / 清空
- 工作面恢复与保存提示
- 工作面重置

也就是说，`admin-console.tsx` 已经不再直接承载这些队列状态的 `useState` / `useEffect` / 推进函数主体。

### 3.2 热门明星文案生成已下沉

热门明星导出、安利文案、超短推荐等生成逻辑，已经迁入：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/star-priority-content.ts`

主文件只保留：

- 调用生成函数
- 复制到剪贴板
- success / error toast

## 4. 当前 `admin-console.tsx` 的角色

现在它更接近一个真正的顶层编排层，主要负责：

- 顶层状态
- 表单提交
- 数据过滤
- 子组件调用
- hook 调用
- 少量跨模块协调

而不是：

- 大块页面 UI
- 大串重复文案拼接
- 草稿队列状态机本体

## 5. 你这次最该判断的点

请重点判断下面这些问题：

1. 现在的 `admin-console.tsx` 是否已经达到“合理的顶层编排层”状态
2. 剩余复杂度是否主要是正常业务复杂度，而不是结构问题
3. 是否已经适合阶段性停止继续拆分
4. 如果还值得继续，只允许推荐 1 个下一步，而且要解释：
   - 为什么收益足够大
   - 风险是否值得
   - 为什么不是现在停下

## 6. 不要误判的几个点

请不要把下面这些情况误判成“还没拆干净”：

- 子组件仍然需要从父组件接收很多 props  
  这在顶层编排层中是正常的，不代表结构一定坏。

- 队列相关状态仍然会被传给事件 / 动态编辑卡  
  这属于批处理业务本身的正常耦合，不一定意味着还要继续拆。

- `admin-console.tsx` 仍然不是一个很短的文件  
  现在剩下的长度不一定说明结构坏，更可能只是业务编排天然复杂。

## 7. 语言展示规则不要被破坏

项目仍然遵守这条规则：

- 界面与说明：中文优先
- 明星名、品牌名、商场名、场馆名、官方活动标题：原文保留
- 展示方式：中文解释 + 原文保留

重点文件：

- `/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md`

## 8. 如果你需要看文件，优先顺序如下

1. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin-console.tsx`
2. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/hooks/use-draft-queue-orchestrator.ts`
3. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/lib/star-priority-content.ts`
4. `/Users/ouyowu/Documents/泰国娱乐圈项目/src/components/admin/`
5. `/Users/ouyowu/Documents/泰国娱乐圈项目/docs/language-display-guidelines.md`

## 9. 当前验证方式

当前稳定验证方式：

- `npm run lint`
- `npx next build --webpack`

## 10. 希望你的输出格式

请优先输出一个明确结论：

- `建议阶段性停止`
或
- `建议继续拆`

如果建议继续：

- 只能给 1 个下一步
- 必须写明为什么这个下一步真的值得

如果建议停止：

- 请明确说明为什么当前结构已经足够健康
- 请明确说明为什么剩余复杂度属于正常业务复杂度
- 请顺带补充“下次在什么触发条件下再重新开拆”，例如：
  - 某个主文件或 hook 再次明显膨胀
  - 某块逻辑开始被多个模块重复实现
  - 新需求导致 `admin-console.tsx` 需要同时管理跨多个子模块的共享状态

## 11. 这次不要直接做的事

- 不要默认继续盲拆 UI 卡片
- 不要回头重复拆已经拆出去的区域
- 不要改前台语言规则
- 不要把批处理逻辑拆得更难追

这次最重要的是：  
`判断是不是该停，而不是继续为了“更干净”而重构。`
