"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type IngestionJob = {
  id: string;
  source_url: string;
  source_type: string;
  model_vendor: string;
  status: string;
  raw_content?: string | null;
  translated_content?: string | null;
  summary?: string | null;
  extracted_payload?: Record<string, unknown> | null;
  created_at: string;
};

type QueueRecommendation = {
  action: "event" | "news";
  label: string;
  reason: string;
};

type IngestionJobsTableProps = {
  jobs: IngestionJob[];
  selectedJobIds: string[];
  processingJobId: string | null;
  onToggleJobSelection: (id: string) => void;
  onHydrateEventDraft: (payload: Record<string, unknown>) => void;
  onHydrateNewsDraft: (job: IngestionJob) => void;
  onPrepareEventDraftForPublish: (payload: Record<string, unknown>) => void;
  onPrepareNewsDraftForPublish: (job: IngestionJob) => void;
  onUpdateIngestionStatus: (id: string, status: "reviewed" | "published" | "rejected") => void;
  readPayloadString: (payload: Record<string, unknown> | null | undefined, key: string) => string;
  deriveQueuePreviewTitle: (job: IngestionJob) => string;
  deriveQueuePreviewSummary: (job: IngestionJob) => string;
  deriveQueueRecommendation: (job: IngestionJob) => QueueRecommendation;
  statusPillClassName: (status: string) => string;
  formatIngestionStatus: (status: string) => string;
};

export function IngestionJobsTable({
  jobs,
  selectedJobIds,
  processingJobId,
  onToggleJobSelection,
  onHydrateEventDraft,
  onHydrateNewsDraft,
  onPrepareEventDraftForPublish,
  onPrepareNewsDraftForPublish,
  onUpdateIngestionStatus,
  readPayloadString,
  deriveQueuePreviewTitle,
  deriveQueuePreviewSummary,
  deriveQueueRecommendation,
  statusPillClassName,
  formatIngestionStatus,
}: IngestionJobsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10">
          <TableHead>选择</TableHead>
          <TableHead>来源</TableHead>
          <TableHead>模型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>时间</TableHead>
          <TableHead>审核</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length ? (
          jobs.map((row) => {
            const recommendation = deriveQueueRecommendation(row);
            const recommendEvent = recommendation.action === "event";
            const recommendNews = recommendation.action === "news";

            return (
              <TableRow key={row.id} className="border-white/10">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedJobIds.includes(row.id)}
                    onChange={() => onToggleJobSelection(row.id)}
                  />
                </TableCell>
                <TableCell className="max-w-[180px]">
                  <p className="truncate">{row.source_url}</p>
                  <p className="mt-1 text-xs text-white/45">{row.source_type}</p>
                  {row.extracted_payload?.sourceCompany ? (
                    <p className="mt-1 text-xs text-[#ffb39d]">
                      {String(row.extracted_payload.sourceCompany)}
                      {row.extracted_payload.sourceHandle ? ` · ${String(row.extracted_payload.sourceHandle)}` : ""}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>{row.model_vendor}</TableCell>
                <TableCell>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className={statusPillClassName(row.status)}>{formatIngestionStatus(row.status)}</span>
                      {row.extracted_payload?.sourceCompany ? (
                        <span className="rounded-full border border-[#ffb39d]/30 px-2 py-0.5 text-xs text-[#ffd7c9]">
                          官方来源
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 max-w-[260px] space-y-2 rounded-2xl border border-white/8 bg-white/5 p-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#ffb39d]/85">原始标题 / 官方写法</p>
                        <p className="mt-1 text-xs text-white/75">
                          {readPayloadString(row.extracted_payload, "title") || deriveQueuePreviewTitle(row)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">中文摘要</p>
                        <p className="mt-1 text-xs text-white/60">{deriveQueuePreviewSummary(row)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">来源提示</p>
                        <p className="mt-1 text-xs text-white/50">
                          {readPayloadString(row.extracted_payload, "sourceLabel") ||
                            readPayloadString(row.extracted_payload, "sourceCompany") ||
                            "待补充来源标签"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">建议下一步</p>
                        <p className="mt-1 text-xs text-[#ffd7c9]">{recommendation.label}</p>
                        <p className="mt-1 text-xs text-white/50">{recommendation.reason}</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-end gap-2">
                    <span>{format(new Date(row.created_at), "MM-dd HH:mm")}</span>
                    {row.extracted_payload ? (
                      <Button
                        size="sm"
                        variant={recommendEvent ? "default" : "outline"}
                        className={recommendEvent ? "bg-[#ff7a59] text-[#0f1729] hover:bg-[#ff8c70]" : undefined}
                        onClick={() => onHydrateEventDraft(row.extracted_payload!)}
                      >
                        {recommendEvent ? "推荐转活动" : "转活动草稿"}
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant={recommendNews ? "default" : "outline"}
                      className={recommendNews ? "bg-[#ff7a59] text-[#0f1729] hover:bg-[#ff8c70]" : undefined}
                      onClick={() => onHydrateNewsDraft(row)}
                    >
                      {recommendNews ? "推荐转动态" : "转动态草稿"}
                    </Button>
                    {row.extracted_payload ? (
                      <Button size="sm" variant="outline" onClick={() => onPrepareEventDraftForPublish(row.extracted_payload!)}>
                        活动待发布
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => onPrepareNewsDraftForPublish(row)}>
                      动态待发布
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingJobId === row.id}
                      onClick={() => onUpdateIngestionStatus(row.id, "reviewed")}
                    >
                      已审
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingJobId === row.id}
                      onClick={() => onUpdateIngestionStatus(row.id, "published")}
                    >
                      已发布
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={processingJobId === row.id}
                      onClick={() => onUpdateIngestionStatus(row.id, "rejected")}
                    >
                      驳回
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow className="border-white/10">
            <TableCell colSpan={6} className="text-white/50">
              暂无 AI 入队任务
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
