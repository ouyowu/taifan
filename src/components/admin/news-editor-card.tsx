"use client";

import { Loader2, Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type NewsEditorValues = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  bodyMd?: string;
  sourceUrl?: string;
  relatedStars?: string;
};

type DraftQueueJob = {
  source_url: string;
};

type NewsEditorCardProps = {
  editingNewsSlug: string | null;
  draftQueueMode: "news" | "event" | null;
  currentDraftQueueJob: DraftQueueJob | null;
  currentDraftQueueJobsLength: number;
  draftQueueIndex: number;
  submittingNews: boolean;
  newsForm: UseFormReturn<NewsEditorValues>;
  onSubmit: (values: NewsEditorValues) => void | Promise<void>;
  onSetPublishAfterSave: (value: boolean) => void;
  onCancelEdit: () => void;
  onRetreatDraftQueue: () => void;
  onAdvanceDraftQueue: () => void;
  onSkipCurrentDraftQueueItem: () => void;
  onClearDraftQueue: () => void;
};

export function NewsEditorCard({
  editingNewsSlug,
  draftQueueMode,
  currentDraftQueueJob,
  currentDraftQueueJobsLength,
  draftQueueIndex,
  submittingNews,
  newsForm,
  onSubmit,
  onSetPublishAfterSave,
  onCancelEdit,
  onRetreatDraftQueue,
  onAdvanceDraftQueue,
  onSkipCurrentDraftQueueItem,
  onClearDraftQueue,
}: NewsEditorCardProps) {
  const currentDraftQueueSourceUrl = currentDraftQueueJob?.source_url ?? null;

  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">动态录入</CardTitle>
      </CardHeader>
      <CardContent>
        {draftQueueMode === "news" && currentDraftQueueJob ? (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            动态草稿批处理进行中：第 {draftQueueIndex + 1} 条 / 共 {currentDraftQueueJobsLength} 条
            <p className="mt-2 text-xs text-emerald-50/90">当前批次：动态批 · 这是当前拆分流程的最后一批</p>
            {currentDraftQueueSourceUrl ? (
              <p className="mt-2 break-all text-xs text-emerald-50/90">当前来源：{currentDraftQueueSourceUrl}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3">
              <Button type="button" size="sm" variant="outline" onClick={onRetreatDraftQueue}>
                上一条
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onAdvanceDraftQueue}>
                下一条
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onSkipCurrentDraftQueueItem}>
                跳过当前条
              </Button>
              {currentDraftQueueSourceUrl ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(currentDraftQueueSourceUrl, "_blank", "noopener,noreferrer")}
                >
                  查看来源
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="outline" onClick={onClearDraftQueue}>
                退出批处理
              </Button>
            </div>
          </div>
        ) : null}
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d1425] p-4 text-sm text-white/70">
          录动态时建议保留官方原始标题、品牌名和活动名；`摘要` 和 `正文` 用中文整理，让用户先看懂，再决定要不要去核对原文来源。
        </div>
        <div className="mb-4 rounded-2xl border border-[#ff7a59]/15 bg-[#ff7a59]/6 p-4 text-xs text-white/65">
          <p className="text-[#ffd7c9]">示例写法</p>
          <p className="mt-2">标题：`GMMTV FANDAY 12 in Bangkok`</p>
          <p className="mt-1">摘要：`GMMTV 公布新一场粉丝活动安排，重点看出席艺人、预约时间和场地信息。`</p>
          <p className="mt-1">正文：中文整理活动重点，但把 `GMMTV`、场馆名、艺人名保留原文，方便用户继续去搜原始官宣。</p>
        </div>
        <form onSubmit={newsForm.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="slug" disabled={Boolean(editingNewsSlug)} {...newsForm.register("slug")} />
            <Input placeholder="分类" {...newsForm.register("category")} />
          </div>
          <Input placeholder="标题（保留官方原始标题）" {...newsForm.register("title")} />
          <Textarea rows={3} placeholder="摘要（中文快读，先告诉用户发生了什么）" {...newsForm.register("excerpt")} />
          <Input placeholder="来源链接（建议保留原始来源）" {...newsForm.register("sourceUrl")} />
          <Textarea rows={5} placeholder="正文 Markdown（中文整理，可保留专有名词原文）" {...newsForm.register("bodyMd")} />
          <Input placeholder="关联明星 slug，逗号分隔" {...newsForm.register("relatedStars")} />
          <div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submittingNews} onClick={() => onSetPublishAfterSave(false)}>
                {submittingNews ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingNewsSlug ? "保存动态" : "新增动态"}
              </Button>
              <Button type="submit" variant="outline" disabled={submittingNews} onClick={() => onSetPublishAfterSave(true)}>
                保存并发布
              </Button>
              {editingNewsSlug ? (
                <Button type="button" variant="outline" onClick={onCancelEdit}>
                  取消编辑
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
