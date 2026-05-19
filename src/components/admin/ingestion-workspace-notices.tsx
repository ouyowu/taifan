"use client";

import { Button } from "@/components/ui/button";

type IngestionWorkspaceNoticesProps = {
  showRestoredIngestionHint: boolean;
  showSavedIngestionHint: boolean;
  selectedJobCount: number;
  selectedRecommendationStats: {
    event: number;
    news: number;
  };
  selectedRecommendationMix: "none" | "mixed" | "clear";
  onDismissRestoredHint: () => void;
  onResetWorkspace: () => void;
  onSplitRecommendedDrafts: () => void;
};

export function IngestionWorkspaceNotices({
  showRestoredIngestionHint,
  showSavedIngestionHint,
  selectedJobCount,
  selectedRecommendationStats,
  selectedRecommendationMix,
  onDismissRestoredHint,
  onResetWorkspace,
  onSplitRecommendedDrafts,
}: IngestionWorkspaceNoticesProps) {
  return (
    <>
      {showRestoredIngestionHint ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p>已恢复上次工作面：抓取队列的筛选条件和勾选任务已经为你带回来了。</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onDismissRestoredHint}>
              知道了
            </Button>
            <Button size="sm" variant="outline" onClick={onResetWorkspace}>
              恢复默认工作面
            </Button>
          </div>
        </div>
      ) : null}

      {showSavedIngestionHint ? (
        <div className="mb-4 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-sky-100">
          已更新当前工作面：你刚才对抓取队列的筛选或勾选会在这次会话里继续保留。
        </div>
      ) : null}

      {selectedJobCount ? (
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d1425] p-4 text-sm text-white/70">
          当前已勾选 {selectedJobCount} 条。
          <span className="ml-2 text-[#ffd7c9]">
            其中 {selectedRecommendationStats.news} 条更适合转动态，{selectedRecommendationStats.event} 条更适合转活动。
          </span>
          {selectedRecommendationMix === "mixed" ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-xs text-[#ffb39d]">
                这批内容偏混合，建议拆成两批处理，会比一次性走同一条线更稳。
              </p>
              <Button size="sm" variant="outline" onClick={onSplitRecommendedDrafts}>
                自动拆成两批
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
