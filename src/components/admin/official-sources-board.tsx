"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSourceIngestionLabel, type SourceCatalogItem } from "@/lib/source-catalog";

type OfficialSourcesBoardProps = {
  sources: SourceCatalogItem[];
  batchQueueing: boolean;
  dailyNewsGenerating: boolean;
  creatingPreviewCandidate: boolean;
  previewingSourceSlug: string | null;
  sourcePreview: {
    slug: string;
    label: string;
    ingestionLabel: string;
    feedUrl: string;
    latest: {
      title: string;
      url: string;
      excerpt: string;
      sourceCompany?: string | null;
      sourceHandle?: string | null;
      sourceLabel?: string | null;
    };
    recentCandidate: {
      slug: string;
      title: string;
      reviewStatus: string | null;
      publishedAt: string | null;
      createdAt: string;
    } | null;
  } | null;
  previewCandidateSlug: string | null;
  onQueueBatchOfficialSources: () => void;
  onGenerateDailyNews: () => void;
  onLoadSource: (slug: string) => void;
  onStartSourceScan: (slug: string) => void;
  onPreviewSource: (slug: string) => void;
  onClearPreview: () => void;
  onCreatePreviewCandidate: (slug: string) => void;
  onCopyPreviewHeadlineLink: () => void;
  onOpenPreviewSource: () => void;
  onOpenPreviewCandidate: () => void;
};

export function OfficialSourcesBoard({
  sources,
  batchQueueing,
  dailyNewsGenerating,
  creatingPreviewCandidate,
  previewingSourceSlug,
  sourcePreview,
  previewCandidateSlug,
  onQueueBatchOfficialSources,
  onGenerateDailyNews,
  onLoadSource,
  onStartSourceScan,
  onPreviewSource,
  onClearPreview,
  onCreatePreviewCandidate,
  onCopyPreviewHeadlineLink,
  onOpenPreviewSource,
  onOpenPreviewCandidate,
}: OfficialSourcesBoardProps) {
  const candidateHint = sourcePreview?.recentCandidate
    ? sourcePreview.recentCandidate.reviewStatus === "published"
      ? "这条链接已经正式发布过"
      : sourcePreview.recentCandidate.reviewStatus === "reviewed"
        ? "这条链接已经有待发布候选"
        : sourcePreview.recentCandidate.reviewStatus === "draft"
          ? "这条链接已经有草稿"
          : sourcePreview.recentCandidate.reviewStatus === "rejected"
            ? "这条链接之前被驳回过"
            : "这条链接之前已经进过系统"
    : null;

  return (
    <Card className="mt-6 border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>官方来源巡查板</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onGenerateDailyNews} disabled={dailyNewsGenerating}>
              {dailyNewsGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              生成今日 news 候选
            </Button>
            <Button size="sm" onClick={onQueueBatchOfficialSources} disabled={batchQueueing}>
              {batchQueueing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              批量加入巡检
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sourcePreview ? (
          <div className="rounded-2xl border border-white/10 bg-[#0d1425] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">先试抓结果</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{sourcePreview.label}</h3>
                <p className="mt-1 text-sm text-white/55">
                  当前模式：{sourcePreview.ingestionLabel}
                </p>
              </div>
              <div className="flex gap-2">
                {sourcePreview.recentCandidate || previewCandidateSlug ? (
                  <Button size="sm" variant="outline" onClick={onOpenPreviewCandidate}>
                    去后台看这条候选
                  </Button>
                ) : null}
                <Button size="sm" variant="outline" onClick={onOpenPreviewSource}>
                  打开原始页面
                </Button>
                <Button size="sm" variant="outline" onClick={onCopyPreviewHeadlineLink}>
                  复制标题和链接
                </Button>
                <Button size="sm" onClick={() => onCreatePreviewCandidate(sourcePreview.slug)} disabled={creatingPreviewCandidate}>
                  {creatingPreviewCandidate ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  用这条内容生成候选
                </Button>
                <Button size="sm" variant="outline" onClick={onClearPreview}>
                  关闭预览
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">最新抓到的标题</p>
                <p className="mt-2 text-base font-medium leading-[1.6] text-white">{sourcePreview.latest.title}</p>
                <p className="mt-3 text-sm leading-[1.8] text-white/70">{sourcePreview.latest.excerpt}</p>
                {candidateHint ? (
                  <div className="mt-4 rounded-2xl bg-[#16213d] px-3 py-2 text-sm leading-[1.7] text-[#d7e6ff]">
                    {candidateHint}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-[#16213d] p-4 text-sm leading-[1.8] text-white/72">
                <p><span className="text-white/45">入口：</span>{sourcePreview.feedUrl}</p>
                <p className="mt-2 break-all"><span className="text-white/45">最新链接：</span>{sourcePreview.latest.url}</p>
                <p className="mt-2"><span className="text-white/45">来源：</span>{sourcePreview.latest.sourceLabel ?? sourcePreview.label}</p>
                <p className="mt-2"><span className="text-white/45">账号：</span>{sourcePreview.latest.sourceHandle ?? "未识别"}</p>
                {sourcePreview.recentCandidate ? (
                  <p className="mt-2"><span className="text-white/45">系统记录：</span>{sourcePreview.recentCandidate.slug}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => (
          <div key={source.slug} className="rounded-2xl bg-[#0d1425] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{source.label}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${
                  source.active === false ? "bg-[#3b2230] text-[#ffb2c6]" : "bg-[#183026] text-[#9ef0aa]"
                }`}
              >
                {source.active === false ? "Paused" : "Active"}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/55">{source.handle}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70">
                {getSourceIngestionLabel(source)}
              </span>
              {source.ingestion?.feedUrl ? (
                <span className="rounded-full bg-[#16213d] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#b8d2ff]">
                  Feed connected
                </span>
              ) : null}
            </div>
            <p className="mt-2 break-all text-xs text-white/45">{source.profileUrl}</p>
            {source.active === false ? (
              <p className="mt-3 text-xs leading-[1.7] text-white/55">
                这个来源当前已停用。要恢复自动整理，请把它从环境变量 <span className="font-mono">DAILY_NEWS_DISABLED_SOURCES</span> 里移除后重新部署。
              </p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onLoadSource(source.slug)} disabled={source.active === false}>
                载入链接
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreviewSource(source.slug)}
                disabled={source.active === false || previewingSourceSlug === source.slug}
              >
                {previewingSourceSlug === source.slug ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                先试抓
              </Button>
              <Button size="sm" onClick={() => onStartSourceScan(source.slug)} disabled={source.active === false}>
                开始巡查
              </Button>
            </div>
          </div>
        ))}
        </div>
      </CardContent>
    </Card>
  );
}
