"use client";

import { Loader2, Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EventEditorValues = {
  slug: string;
  title: string;
  type: string;
  city: string;
  venue: string;
  startsAt: string;
  summary: string;
  starSlugs?: string;
};

type EventEditorCardProps = {
  editingEventSlug: string | null;
  draftQueueMode: "news" | "event" | null;
  currentDraftQueueJob: { source_url: string } | null;
  currentDraftQueueJobsLength: number;
  draftQueueIndex: number;
  pendingSplitNewsCount: number;
  submittingEvent: boolean;
  eventForm: UseFormReturn<EventEditorValues>;
  onSubmit: (values: EventEditorValues) => void | Promise<void>;
  onSetPublishAfterSave: (value: boolean) => void;
  onCancelEdit: () => void;
  onRetreatDraftQueue: () => void;
  onAdvanceDraftQueue: () => void;
  onSkipCurrentDraftQueueItem: () => void;
  onClearDraftQueue: () => void;
};

export function EventEditorCard({
  editingEventSlug,
  draftQueueMode,
  currentDraftQueueJob,
  currentDraftQueueJobsLength,
  draftQueueIndex,
  pendingSplitNewsCount,
  submittingEvent,
  eventForm,
  onSubmit,
  onSetPublishAfterSave,
  onCancelEdit,
  onRetreatDraftQueue,
  onAdvanceDraftQueue,
  onSkipCurrentDraftQueueItem,
  onClearDraftQueue,
}: EventEditorCardProps) {
  const currentDraftQueueSourceUrl = currentDraftQueueJob?.source_url ?? null;

  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>{editingEventSlug ? "编辑活动" : "快速创建活动"}</CardTitle>
      </CardHeader>
      <CardContent>
        {draftQueueMode === "event" && currentDraftQueueJob ? (
          <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            活动草稿批处理进行中：第 {draftQueueIndex + 1} 条 / 共 {currentDraftQueueJobsLength} 条
            <p className="mt-2 text-xs text-emerald-50/90">
              当前批次：活动批
              {pendingSplitNewsCount ? ` · 后面还剩动态批 ${pendingSplitNewsCount} 条` : " · 后面没有待切换批次"}
            </p>
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
        <div className="rounded-2xl border border-white/10 bg-[#0d1425] p-4 text-sm text-white/70 md:col-span-2">
          录活动时建议用这套规则：活动官方标题、商场名、场馆名尽量保留原文；`摘要` 用中文说明活动到底是什么、怎么买票、值不值得去。
        </div>
        <div className="mt-4 rounded-2xl border border-[#ff7a59]/15 bg-[#ff7a59]/6 p-4 text-xs text-white/65 md:col-span-2">
          <p className="text-[#ffd7c9]">示例写法</p>
          <p className="mt-2">标题：`PP Krit The Touch Fan Meeting 2026`</p>
          <p className="mt-1">场馆：`Paragon Hall, Siam Paragon`</p>
          <p className="mt-1">摘要：`PP Krit 见面会，适合新粉补公开行程和现场互动信息，重点关注开票时间与入场规则。`</p>
        </div>
        <form onSubmit={eventForm.handleSubmit(onSubmit)} className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" disabled={Boolean(editingEventSlug)} {...eventForm.register("slug")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">标题（建议填官方原文标题）</Label>
            <Input id="title" placeholder="例如：Billkin & PP Krit Fan Meeting 2026" {...eventForm.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">类型</Label>
            <Input id="type" {...eventForm.register("type")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">城市</Label>
            <Input id="city" {...eventForm.register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">场馆 / 商场（保留原文更自然）</Label>
            <Input id="venue" placeholder="例如：Paragon Hall / ICONSIAM" {...eventForm.register("venue")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startsAt">开始时间</Label>
            <Input id="startsAt" type="datetime-local" {...eventForm.register("startsAt")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="starSlugs">关联明星</Label>
            <Input id="starSlugs" placeholder="例如：bright-vaid, pp-krit" {...eventForm.register("starSlugs")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">摘要（中文说明，给中国用户快速看懂）</Label>
            <Textarea
              id="summary"
              rows={4}
              placeholder="用中文解释这是什么活动、适合谁去、要不要抢票、有没有公开行程价值。"
              {...eventForm.register("summary")}
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex gap-3">
              <Button type="submit" disabled={submittingEvent} onClick={() => onSetPublishAfterSave(false)}>
                {submittingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingEventSlug ? "保存活动" : "写入活动"}
              </Button>
              <Button type="submit" variant="outline" disabled={submittingEvent} onClick={() => onSetPublishAfterSave(true)}>
                保存并发布
              </Button>
              {editingEventSlug ? (
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
