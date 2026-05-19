"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IngestionWorkspaceNotices } from "@/components/admin/ingestion-workspace-notices";
import type { SourceCatalogItem } from "@/lib/source-catalog";

type IngestionWorkspaceControlsProps = {
  queueStats: {
    queued: number;
    processed: number;
    reviewed: number;
    published: number;
  };
  allFilteredJobsSelected: boolean;
  processingJobId: string | null;
  ingestionSourceFilter: string;
  ingestionStatusFilter: string;
  officialSources: SourceCatalogItem[];
  showRestoredIngestionHint: boolean;
  showSavedIngestionHint: boolean;
  selectedJobCount: number;
  selectedRecommendationStats: {
    event: number;
    news: number;
  };
  selectedRecommendationMix: "none" | "mixed" | "clear";
  onToggleAllFilteredJobs: () => void;
  onBulkHydrateRecommendedDrafts: () => void;
  onBulkHydrateNewsDrafts: () => void;
  onBulkHydrateEventDrafts: () => void;
  onBulkUpdateReviewed: () => void;
  onBulkUpdatePublished: () => void;
  onBulkUpdateRejected: () => void;
  onDismissRestoredHint: () => void;
  onResetWorkspace: () => void;
  onSplitRecommendedDrafts: () => void;
  onIngestionSourceFilterChange: (value: string) => void;
  onIngestionStatusFilterChange: (value: string) => void;
};

export function IngestionWorkspaceControls({
  queueStats,
  allFilteredJobsSelected,
  processingJobId,
  ingestionSourceFilter,
  ingestionStatusFilter,
  officialSources,
  showRestoredIngestionHint,
  showSavedIngestionHint,
  selectedJobCount,
  selectedRecommendationStats,
  selectedRecommendationMix,
  onToggleAllFilteredJobs,
  onBulkHydrateRecommendedDrafts,
  onBulkHydrateNewsDrafts,
  onBulkHydrateEventDrafts,
  onBulkUpdateReviewed,
  onBulkUpdatePublished,
  onBulkUpdateRejected,
  onDismissRestoredHint,
  onResetWorkspace,
  onSplitRecommendedDrafts,
  onIngestionSourceFilterChange,
  onIngestionStatusFilterChange,
}: IngestionWorkspaceControlsProps) {
  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-[#0d1425] p-3">
          <p className="text-xs text-white/45">待处理</p>
          <p className="mt-1 text-xl font-semibold">{queueStats.queued}</p>
        </div>
        <div className="rounded-2xl bg-[#0d1425] p-3">
          <p className="text-xs text-white/45">已提取</p>
          <p className="mt-1 text-xl font-semibold">{queueStats.processed}</p>
        </div>
        <div className="rounded-2xl bg-[#0d1425] p-3">
          <p className="text-xs text-white/45">待发布</p>
          <p className="mt-1 text-xl font-semibold">{queueStats.reviewed}</p>
        </div>
        <div className="rounded-2xl bg-[#0d1425] p-3">
          <p className="text-xs text-white/45">已发布</p>
          <p className="mt-1 text-xl font-semibold">{queueStats.published}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onToggleAllFilteredJobs}>
          {allFilteredJobsSelected ? "取消全选" : "全选当前筛选"}
        </Button>
        <Button
          size="sm"
          onClick={onBulkHydrateRecommendedDrafts}
          className="bg-[#ff7a59] text-[#0f1729] hover:bg-[#ff8c70]"
        >
          按推荐方向批量处理
        </Button>
        <Button size="sm" variant="outline" onClick={onBulkHydrateNewsDrafts}>
          批量转动态草稿
        </Button>
        <Button size="sm" variant="outline" onClick={onBulkHydrateEventDrafts}>
          批量转活动草稿
        </Button>
        <Button size="sm" variant="outline" disabled={processingJobId === "bulk"} onClick={onBulkUpdateReviewed}>
          批量已审
        </Button>
        <Button size="sm" variant="outline" disabled={processingJobId === "bulk"} onClick={onBulkUpdatePublished}>
          批量发布
        </Button>
        <Button size="sm" variant="destructive" disabled={processingJobId === "bulk"} onClick={onBulkUpdateRejected}>
          批量驳回
        </Button>
      </div>

      <IngestionWorkspaceNotices
        showRestoredIngestionHint={showRestoredIngestionHint}
        showSavedIngestionHint={showSavedIngestionHint}
        selectedJobCount={selectedJobCount}
        selectedRecommendationStats={selectedRecommendationStats}
        selectedRecommendationMix={selectedRecommendationMix}
        onDismissRestoredHint={onDismissRestoredHint}
        onResetWorkspace={onResetWorkspace}
        onSplitRecommendedDrafts={onSplitRecommendedDrafts}
      />

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <Select value={ingestionSourceFilter} onValueChange={(value) => onIngestionSourceFilterChange(value ?? "all")}>
          <SelectTrigger>
            <SelectValue placeholder="来源公司" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            {officialSources.map((source) => (
              <SelectItem key={source.slug} value={source.company}>
                {source.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ingestionStatusFilter} onValueChange={(value) => onIngestionStatusFilterChange(value ?? "all")}>
          <SelectTrigger>
            <SelectValue placeholder="处理状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="unprocessed">仅看未处理</SelectItem>
            <SelectItem value="queued">已入队</SelectItem>
            <SelectItem value="processed">已处理</SelectItem>
            <SelectItem value="reviewed">仅看待发布</SelectItem>
            <SelectItem value="published">仅看已发布</SelectItem>
            <SelectItem value="rejected">仅看已驳回</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
