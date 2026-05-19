"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { IngestionJobsTable } from "@/components/admin/ingestion-jobs-table";
import { IngestionWorkspaceControls } from "@/components/admin/ingestion-workspace-controls";
import { EventEditorCard } from "@/components/admin/event-editor-card";
import { EventListCard } from "@/components/admin/event-list-card";
import { AiIngestionCard } from "@/components/admin/ai-ingestion-card";
import { NewsEditorCard } from "@/components/admin/news-editor-card";
import { NewsListCard } from "@/components/admin/news-list-card";
import { OfficialSourcesBoard } from "@/components/admin/official-sources-board";
import { ServiceRequestQueueCard } from "@/components/admin/service-request-queue-card";
import { StarEditorCard } from "@/components/admin/star-editor-card";
import { StarPriorityListCard } from "@/components/admin/star-priority-list-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDraftQueueOrchestrator } from "@/hooks/use-draft-queue-orchestrator";
import type { SourceCatalogItem } from "@/lib/source-catalog";
import {
  buildActivityOrNewsChoicePitch,
  buildHeadlineOnlyPitch,
  buildMinimumEffortPitch,
  buildNewFanSingleParagraphPitch,
  buildNewFanThreeLinePitch,
  buildNoTimePitch,
  buildOneClickPitch,
  buildOneGlancePitch,
  buildOneNamePitch,
  buildSingleUpdatePitch,
  buildStarPriorityListJson,
  buildStarPriorityPlainText,
  buildThreeMinutePitch,
  buildTopOneBrandPitch,
  buildTopOneCpPitch,
  buildTopOneEventPitch,
  buildTopOneFashionPitch,
  buildTopOneRecommendation,
  buildTopOneShortPitch,
  buildTopThreeBrief,
  buildTopThreeChatBrief,
  buildTopThreeNewFanPitch,
  buildUltraShortActivityPitch,
  buildUltraShortNewsPitch,
  buildUltraShortPitch,
} from "@/lib/star-priority-content";
import type { Event, NewsItem, Star } from "@/types/domain";

const eventSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  type: z.string().min(2),
  city: z.string().min(2),
  venue: z.string().min(2),
  startsAt: z.string().min(5),
  summary: z.string().min(10),
  starSlugs: z.string().optional(),
});

const ingestSchema = z.object({
  sourceUrl: z.string().url(),
  rawContent: z.string().min(20),
  task: z.enum(["translate", "summarize", "extract-event"]),
  vendor: z.enum(["openai", "anthropic", "google"]),
});

const starSchema = z.object({
  slug: z.string().min(3),
  nameCn: z.string().min(2),
  nameEn: z.string().min(2),
  fandomName: z.string().optional(),
  agency: z.string().optional(),
  baseCity: z.string().optional(),
  bio: z.string().optional(),
  tags: z.string().optional(),
  chinaFanPriority: z.string().optional(),
});

const newsSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  category: z.string().min(2),
  bodyMd: z.string().optional(),
  sourceUrl: z.string().optional(),
  relatedStars: z.string().optional(),
});

const INGESTION_UI_STATE_KEY = "thaistar-admin-ingestion-ui";

function readAdminSearchState() {
  if (typeof window === "undefined") {
    return {
      tab: "ops",
      newsQuery: "",
      newsStatus: "all",
      newsEditorial: "all",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");

  return {
    tab: tab && ["ops", "event", "ai", "content"].includes(tab) ? tab : "ops",
    newsQuery: params.get("newsQuery") ?? "",
    newsStatus: params.get("newsStatus") ?? "all",
    newsEditorial: params.get("newsEditorial") ?? "all",
  };
}

type AdminConsoleProps = {
  events: Event[];
  newsItems: NewsItem[];
  stars: Star[];
  serviceRequests: Array<{
    id: string;
    fan_name: string;
    service_type: string;
    status: string;
    created_at: string;
  }>;
  ingestionJobs: Array<{
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
  }>;
  officialSources: SourceCatalogItem[];
};

export function AdminConsole({
  events,
  newsItems,
  stars,
  serviceRequests,
  ingestionJobs,
  officialSources,
}: AdminConsoleProps) {
  const router = useRouter();
  const savedIngestionUiState = useMemo(() => loadSavedIngestionUiState(), []);
  const initialAdminSearchState = useMemo(() => readAdminSearchState(), []);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [submittingIngest, setSubmittingIngest] = useState(false);
  const [submittingStar, setSubmittingStar] = useState(false);
  const [submittingNews, setSubmittingNews] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [processingEventSlug, setProcessingEventSlug] = useState<string | null>(null);
  const [processingStarSlug, setProcessingStarSlug] = useState<string | null>(null);
  const [processingNewsSlug, setProcessingNewsSlug] = useState<string | null>(null);
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);
  const [ingestResult, setIngestResult] = useState<string>("");
  const [draftCreated, setDraftCreated] = useState(false);
  const [editingEventSlug, setEditingEventSlug] = useState<string | null>(null);
  const [editingStarSlug, setEditingStarSlug] = useState<string | null>(null);
  const [editingNewsSlug, setEditingNewsSlug] = useState<string | null>(null);
  const [eventQuery, setEventQuery] = useState("");
  const [newsQuery, setNewsQuery] = useState(initialAdminSearchState.newsQuery);
  const [newsStatusFilter, setNewsStatusFilter] = useState(initialAdminSearchState.newsStatus);
  const [newsEditorialFilter, setNewsEditorialFilter] = useState(initialAdminSearchState.newsEditorial);
  const [requestQuery, setRequestQuery] = useState("");
  const [starAgencyFilter, setStarAgencyFilter] = useState("all");
  const [starTagFilter, setStarTagFilter] = useState("all");
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");
  const [selectedOfficialSource, setSelectedOfficialSource] = useState("custom");
  const [batchQueueing, setBatchQueueing] = useState(false);
  const [dailyNewsGenerating, setDailyNewsGenerating] = useState(false);
  const [creatingPreviewCandidate, setCreatingPreviewCandidate] = useState(false);
  const [previewingSourceSlug, setPreviewingSourceSlug] = useState<string | null>(null);
  const [previewCandidateSlug, setPreviewCandidateSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(initialAdminSearchState.tab);
  const [sourcePreview, setSourcePreview] = useState<{
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
  } | null>(null);
  const [ingestionSourceFilter, setIngestionSourceFilter] = useState(savedIngestionUiState.sourceFilter);
  const [ingestionStatusFilter, setIngestionStatusFilter] = useState(savedIngestionUiState.statusFilter);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>(savedIngestionUiState.selectedJobIds);
  const [publishEventAfterSave, setPublishEventAfterSave] = useState(false);
  const [publishNewsAfterSave, setPublishNewsAfterSave] = useState(false);

  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      slug: "",
      title: "",
      type: "fanmeeting",
      city: "",
      venue: "",
      startsAt: "",
      summary: "",
      starSlugs: "",
    },
  });

  const ingestForm = useForm<z.infer<typeof ingestSchema>>({
    resolver: zodResolver(ingestSchema),
    defaultValues: {
      sourceUrl: "",
      rawContent: "",
      task: "extract-event",
      vendor: "openai",
    },
  });

  const starForm = useForm<z.infer<typeof starSchema>>({
    resolver: zodResolver(starSchema),
    defaultValues: {
      slug: "",
      nameCn: "",
      nameEn: "",
      fandomName: "",
      agency: "",
      baseCity: "",
      bio: "",
      tags: "",
      chinaFanPriority: "",
    },
  });

  const newsForm = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      category: "活动速递",
      bodyMd: "",
      sourceUrl: "",
      relatedStars: "",
    },
  });

  const pendingCount = useMemo(
    () => serviceRequests.filter((request) => request.status === "new").length,
    [serviceRequests],
  );

  const filteredEvents = useMemo(() => {
    const query = eventQuery.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.slug.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.starSlugs.join(" ").toLowerCase().includes(query);
      const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter;
      const matchesStatus = eventStatusFilter === "all" || event.status === eventStatusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [eventQuery, eventStatusFilter, eventTypeFilter, events]);

  const filteredNews = useMemo(() => {
    const query = newsQuery.trim().toLowerCase();
    return newsItems.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      const matchesStatus = newsStatusFilter === "all" || item.reviewStatus === newsStatusFilter;
      const matchesEditorial =
        newsEditorialFilter === "all" ||
        (newsEditorialFilter === "daily-auto" ? item.editorialMode === "daily-auto" : item.editorialMode !== "daily-auto");
      return matchesQuery && matchesStatus && matchesEditorial;
    });
  }, [newsEditorialFilter, newsItems, newsQuery, newsStatusFilter]);

  const filteredRequests = useMemo(() => {
    const query = requestQuery.trim().toLowerCase();
    if (!query) return serviceRequests;
    return serviceRequests.filter(
      (item) =>
        item.fan_name.toLowerCase().includes(query) ||
        item.service_type.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query),
    );
  }, [requestQuery, serviceRequests]);

  const filteredStars = useMemo(() => {
    return stars.filter((star) => {
      const matchesAgency = starAgencyFilter === "all" || star.agency === starAgencyFilter;
      const matchesTag = starTagFilter === "all" || star.tags.includes(starTagFilter);
      const matchesPriority = !highPriorityOnly || (star.chinaFanPriority ?? 999) <= 10;
      return matchesAgency && matchesTag && matchesPriority;
    });
  }, [highPriorityOnly, starAgencyFilter, starTagFilter, stars]);

  const filteredIngestionJobs = useMemo(() => {
    return ingestionJobs.filter((job) => {
      const sourceCompany =
        typeof job.extracted_payload?.sourceCompany === "string" ? job.extracted_payload.sourceCompany : "";
      const matchesSource =
        ingestionSourceFilter === "all" ||
        sourceCompany.toLowerCase() === ingestionSourceFilter.toLowerCase();
      const matchesStatus =
        ingestionStatusFilter === "all" ||
        (ingestionStatusFilter === "unprocessed"
          ? job.status !== "processed"
          : job.status === ingestionStatusFilter);
      return matchesSource && matchesStatus;
    });
  }, [ingestionJobs, ingestionSourceFilter, ingestionStatusFilter]);

  const allFilteredJobsSelected =
    filteredIngestionJobs.length > 0 && filteredIngestionJobs.every((job) => selectedJobIds.includes(job.id));
  const selectedIngestionJobs = useMemo(
    () => filteredIngestionJobs.filter((job) => selectedJobIds.includes(job.id)),
    [filteredIngestionJobs, selectedJobIds],
  );
  const selectedRecommendationStats = useMemo(() => {
    return selectedIngestionJobs.reduce(
      (acc, job) => {
        const action = deriveQueueRecommendation(job).action;
        if (action === "event") acc.event += 1;
        if (action === "news") acc.news += 1;
        return acc;
      },
      { event: 0, news: 0 },
    );
  }, [selectedIngestionJobs]);
  const selectedRecommendationMix = useMemo(() => {
    const total = selectedRecommendationStats.event + selectedRecommendationStats.news;
    if (!total) return "none" as const;

    const dominant = Math.max(selectedRecommendationStats.event, selectedRecommendationStats.news);
    const dominantRatio = dominant / total;

    if (selectedRecommendationStats.event > 0 && selectedRecommendationStats.news > 0 && dominantRatio <= 0.7) {
      return "mixed" as const;
    }

    return "clear" as const;
  }, [selectedRecommendationStats]);
  const sortedStars = useMemo(
    () =>
      [...filteredStars].sort((a, b) => {
        const aPriority = a.chinaFanPriority ?? Number.MAX_SAFE_INTEGER;
        const bPriority = b.chinaFanPriority ?? Number.MAX_SAFE_INTEGER;
        return aPriority - bPriority || a.nameCn.localeCompare(b.nameCn);
      }),
    [filteredStars],
  );
  const starAgencyOptions = useMemo(
    () => Array.from(new Set(stars.map((star) => star.agency).filter(Boolean))),
    [stars],
  );
  const starTagOptions = useMemo(
    () => Array.from(new Set(stars.flatMap((star) => star.tags))).filter(Boolean),
    [stars],
  );
  const queueStats = useMemo(
    () => ({
      queued: ingestionJobs.filter((job) => job.status === "queued").length,
      processed: ingestionJobs.filter((job) => job.status === "processed").length,
      reviewed: ingestionJobs.filter((job) => job.status === "reviewed").length,
      published: ingestionJobs.filter((job) => job.status === "published").length,
    }),
    [ingestionJobs],
  );

  function resetIngestionWorkspaceState() {
    setIngestionSourceFilter("all");
    setIngestionStatusFilter("all");
    setSelectedJobIds([]);
  }

  const {
    draftQueueMode,
    draftQueueIndex,
    currentDraftQueueJobs,
    currentDraftQueueJob,
    pendingSplitNewsCount,
    showRestoredIngestionHint,
    showSavedIngestionHint,
    setShowRestoredIngestionHint,
    bulkHydrateNewsDrafts,
    bulkHydrateEventDrafts,
    bulkHydrateRecommendedDrafts,
    bulkSplitRecommendedDrafts,
    startPendingSplitNewsQueue,
    advanceDraftQueue,
    retreatDraftQueue,
    skipCurrentDraftQueueItem,
    clearDraftQueue,
    resetWorkspace,
  } = useDraftQueueOrchestrator({
    ingestionJobs,
    filteredIngestionJobs,
    selectedJobIds,
    ingestionSourceFilter,
    ingestionStatusFilter,
    initialHasSavedContext: savedIngestionUiState.hasSavedContext,
    deriveQueueRecommendation,
    hydrateEventDraftFromPayload,
    hydrateNewsDraftFromJob,
    onResetWorkspaceState: resetIngestionWorkspaceState,
  });

  async function submitEvent(values: z.infer<typeof eventSchema>) {
    setSubmittingEvent(true);
    try {
      const response = await fetch(
        editingEventSlug ? `/api/admin/events/${editingEventSlug}` : "/api/admin/events",
        {
          method: editingEventSlug ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            status: publishEventAfterSave ? "scheduled" : undefined,
            starSlugs: values.starSlugs
              ? values.starSlugs
                  .split(",")
                  .map((slug) => slug.trim())
                  .filter(Boolean)
              : [],
          }),
        },
      );
      if (!response.ok) throw new Error();
      toast.success(publishEventAfterSave ? "活动已保存并发布" : editingEventSlug ? "活动已更新" : "活动已写入数据库");
      if (draftQueueMode === "event" && currentDraftQueueJob) {
        void markIngestionJobReviewed(currentDraftQueueJob.id);
      }
      setPublishEventAfterSave(false);
      eventForm.reset();
      setEditingEventSlug(null);
      setDraftCreated(false);
      if (draftQueueMode === "event" && currentDraftQueueJobs.length) {
        const hasNext = draftQueueIndex + 1 < currentDraftQueueJobs.length;
        if (hasNext) {
          const nextIndex = draftQueueIndex + 1;
          advanceDraftQueue({ silent: true });
          toast.success(`已自动切换到下一条活动草稿：第 ${nextIndex + 1} 条 / 共 ${currentDraftQueueJobs.length} 条`);
        } else {
          const switchedToNews = startPendingSplitNewsQueue({ silent: true });
          if (!switchedToNews) {
            clearDraftQueue({ silent: true });
            toast.success("活动草稿批处理已完成");
          } else {
            toast.success(`活动批处理已完成，已自动切换到动态批处理：第 1 条 / 共 ${pendingSplitNewsCount} 条`);
          }
        }
      }
      router.refresh();
    } catch {
      toast.error(editingEventSlug ? "活动更新失败" : "活动创建失败，请先检查 Supabase 环境变量");
    } finally {
      setPublishEventAfterSave(false);
      setSubmittingEvent(false);
    }
  }

  async function submitIngestion(values: z.infer<typeof ingestSchema>) {
    setSubmittingIngest(true);
    setIngestResult("");
    try {
      const queueResponse = await fetch("/api/admin/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl: values.sourceUrl,
          sourceType: "manual-paste",
          vendor: values.vendor,
          rawContent: values.rawContent,
          task: values.task,
        }),
      });
      if (!queueResponse.ok) throw new Error();
      const queueResult = (await queueResponse.json()) as { id?: string };

      const processResponse = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, jobId: queueResult.id }),
      });
      const result = await processResponse.json();
      setIngestResult(JSON.stringify(result, null, 2));

      if (values.task === "extract-event" && result && typeof result === "object") {
        eventForm.setValue("slug", slugify(String(result.title ?? "thai-event-draft")));
        eventForm.setValue("title", String(result.title ?? ""));
        eventForm.setValue("city", String(result.city ?? ""));
        eventForm.setValue("venue", String(result.venue ?? ""));
        eventForm.setValue("summary", String(result.summary ?? ""));
        eventForm.setValue("starSlugs", "");
        if (result.startsAt) {
          const startsAt = toDatetimeLocal(String(result.startsAt));
          if (startsAt) eventForm.setValue("startsAt", startsAt);
        }
        setDraftCreated(true);
      }

      toast.success("AI 任务已入队并返回结果");
      router.refresh();
    } catch {
      toast.error("AI 处理失败，请检查模型密钥");
    } finally {
      setSubmittingIngest(false);
    }
  }

  async function queueBatchOfficialSources() {
    setBatchQueueing(true);
    try {
      const response = await fetch("/api/admin/ingestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: officialSources.filter((source) => source.active !== false).map((source) => ({
            sourceUrl: source.profileUrl,
            sourceType: "official-instagram-profile",
            vendor: "openai",
            task: "summarize",
          })),
        }),
      });
      if (!response.ok) throw new Error();
      toast.success("官方来源已批量加入巡检队列");
      router.refresh();
    } catch {
      toast.error("批量巡检入队失败");
    } finally {
      setBatchQueueing(false);
    }
  }

  async function generateDailyNewsCandidates() {
    setDailyNewsGenerating(true);
    try {
      const response = await fetch("/api/admin/newsroom/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor: ingestForm.getValues("vendor") }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "生成今日 news 候选失败");
      }

      const createdCount = Array.isArray(payload.created) ? payload.created.length : 0;
      const skippedCount = Array.isArray(payload.skipped) ? payload.skipped.length : 0;
      const failedCount = Array.isArray(payload.failed) ? payload.failed.length : 0;

      toast.success(
        `今日 news 候选已跑完：新增 ${createdCount} 条，跳过 ${skippedCount} 条，失败 ${failedCount} 条。`,
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "生成今日 news 候选失败");
    } finally {
      setDailyNewsGenerating(false);
    }
  }

  async function previewOfficialSource(slug: string) {
    setPreviewingSourceSlug(slug);
    try {
      const response = await fetch(`/api/admin/newsroom/preview/${slug}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "试抓失败");
      }

      setSourcePreview(payload);
      setPreviewCandidateSlug(payload.recentCandidate?.slug ?? null);
      toast.success(`已抓到 ${payload.label} 的最新内容预览`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "试抓失败");
    } finally {
      setPreviewingSourceSlug(null);
    }
  }

  async function createPreviewCandidate(slug: string) {
    setCreatingPreviewCandidate(true);
    try {
      const response = await fetch("/api/admin/newsroom/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceSlugs: [slug],
          vendor: ingestForm.getValues("vendor"),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "生成候选失败");
      }

      const createdCount = Array.isArray(payload.created) ? payload.created.length : 0;
      const skippedCount = Array.isArray(payload.skipped) ? payload.skipped.length : 0;
      const failedCount = Array.isArray(payload.failed) ? payload.failed.length : 0;

      if (createdCount > 0) {
        setPreviewCandidateSlug(payload.created[0]?.slug ?? null);
        toast.success(`已根据当前试抓内容生成 ${createdCount} 条候选稿`);
      } else if (skippedCount > 0) {
        toast.success(`这条来源这次没有新候选：${payload.skipped[0]?.reason ?? "已跳过"}`);
      } else if (failedCount > 0) {
        throw new Error(payload.failed[0]?.reason ?? "生成候选失败");
      } else {
        toast.success("试抓内容已处理完成");
      }

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "生成候选失败");
    } finally {
      setCreatingPreviewCandidate(false);
    }
  }

  async function copyPreviewHeadlineLink() {
    if (!sourcePreview) {
      toast.error("现在还没有可复制的试抓结果");
      return;
    }

    try {
      await navigator.clipboard.writeText(`${sourcePreview.latest.title}\n${sourcePreview.latest.url}`);
      toast.success("标题和链接已复制");
    } catch {
      toast.error("复制失败，请稍后再试");
    }
  }

  function openPreviewSource() {
    if (!sourcePreview) {
      toast.error("现在还没有可打开的试抓结果");
      return;
    }

    window.open(sourcePreview.latest.url, "_blank", "noopener,noreferrer");
  }

  function openPreviewCandidate() {
    const slug = sourcePreview?.recentCandidate?.slug ?? previewCandidateSlug;
    const query = slug ?? sourcePreview?.latest.title ?? "";
    window.location.assign(
      `/admin?tab=content&newsStatus=reviewed&newsEditorial=daily-auto&newsQuery=${encodeURIComponent(query)}`,
    );
  }

  async function updateRequestStatus(id: string, status: string) {
    setProcessingRequestId(id);
    try {
      const response = await fetch(`/api/admin/service-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      toast.success("需求状态已更新");
      router.refresh();
    } catch {
      toast.error("状态更新失败");
    } finally {
      setProcessingRequestId(null);
    }
  }

  async function deleteEvent(slug: string) {
    setProcessingEventSlug(slug);
    try {
      const response = await fetch(`/api/admin/events/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      toast.success("活动已删除");
      router.refresh();
    } catch {
      toast.error("活动删除失败");
    } finally {
      setProcessingEventSlug(null);
    }
  }

  async function updateEventStatus(slug: string, status: string) {
    setProcessingEventSlug(slug);
    try {
      const response = await fetch(`/api/admin/events/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      toast.success("活动状态已更新");
      router.refresh();
    } catch {
      toast.error("活动状态更新失败");
    } finally {
      setProcessingEventSlug(null);
    }
  }

  async function scrapeSource() {
    const url = ingestForm.getValues("sourceUrl");
    if (!url) {
      toast.error("请先填写来源链接");
      return;
    }

    setScraping(true);
    try {
      const response = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error();
      const result = (await response.json()) as { text: string };
      ingestForm.setValue("rawContent", result.text);
      toast.success("网页正文已抓取到表单");
    } catch {
      toast.error("抓取失败，请检查目标页面是否可访问");
    } finally {
      setScraping(false);
    }
  }

  function applyOfficialSource(value: string | null) {
    if (!value) return;
    setSelectedOfficialSource(value);
    if (value === "custom") return;
    const source = officialSources.find((item) => item.slug === value);
    if (!source) return;
    ingestForm.setValue("sourceUrl", source.profileUrl);
    toast.success(`已选中来源：${source.label}`);
  }

  async function submitStar(values: z.infer<typeof starSchema>) {
    setSubmittingStar(true);
    try {
      const response = await fetch(
        editingStarSlug ? `/api/admin/stars/${editingStarSlug}` : "/api/admin/stars",
        {
          method: editingStarSlug ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            tags: values.tags
              ? values.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : [],
            chinaFanPriority: values.chinaFanPriority ? Number(values.chinaFanPriority) : undefined,
          }),
        },
      );
      if (!response.ok) throw new Error();
      toast.success(editingStarSlug ? "明星资料已更新" : "明星资料已写入数据库");
      starForm.reset();
      setEditingStarSlug(null);
      router.refresh();
    } catch {
      toast.error(editingStarSlug ? "明星更新失败" : "明星创建失败");
    } finally {
      setSubmittingStar(false);
    }
  }

  async function submitNews(values: z.infer<typeof newsSchema>) {
    setSubmittingNews(true);
    try {
      const response = await fetch(
        editingNewsSlug ? `/api/admin/news/${editingNewsSlug}` : "/api/admin/news",
        {
          method: editingNewsSlug ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            sourceUrl: values.sourceUrl ?? "",
            status: publishNewsAfterSave ? "published" : undefined,
            relatedStars: values.relatedStars
              ? values.relatedStars
                  .split(",")
                  .map((slug) => slug.trim())
                  .filter(Boolean)
              : [],
          }),
        },
      );
      if (!response.ok) throw new Error();
      toast.success(publishNewsAfterSave ? "动态已保存并发布" : editingNewsSlug ? "动态已更新" : "动态已写入数据库");
      if (draftQueueMode === "news" && currentDraftQueueJob) {
        void markIngestionJobReviewed(currentDraftQueueJob.id);
      }
      setPublishNewsAfterSave(false);
      newsForm.reset();
      setEditingNewsSlug(null);
      if (draftQueueMode === "news" && currentDraftQueueJobs.length) {
        const hasNext = draftQueueIndex + 1 < currentDraftQueueJobs.length;
        if (hasNext) {
          const nextIndex = draftQueueIndex + 1;
          advanceDraftQueue({ silent: true });
          toast.success(`已自动切换到下一条动态草稿：第 ${nextIndex + 1} 条 / 共 ${currentDraftQueueJobs.length} 条`);
        } else {
          clearDraftQueue({ silent: true });
          toast.success("动态草稿批处理已完成");
        }
      }
      router.refresh();
    } catch {
      toast.error(editingNewsSlug ? "动态更新失败" : "动态创建失败");
    } finally {
      setPublishNewsAfterSave(false);
      setSubmittingNews(false);
    }
  }

  async function updateNewsStatus(slug: string, status: "reviewed" | "published" | "rejected") {
    setProcessingNewsSlug(slug);
    try {
      const response = await fetch(`/api/admin/news/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      toast.success(
        status === "published" ? "动态已发布" : status === "rejected" ? "动态已驳回" : "动态已转为待发布",
      );
      router.refresh();
    } catch {
      toast.error("动态状态更新失败");
    } finally {
      setProcessingNewsSlug(null);
    }
  }

  function editEvent(event: Event) {
    setEditingEventSlug(event.slug);
    eventForm.reset({
      slug: event.slug,
      title: event.title,
      type: event.type,
      city: event.city,
      venue: event.venue,
      startsAt: toDatetimeLocal(event.startsAt),
      summary: event.summary,
      starSlugs: event.starSlugs.join(", "),
    });
  }

  function editStar(star: Star) {
    setEditingStarSlug(star.slug);
    starForm.reset({
      slug: star.slug,
      nameCn: star.nameCn,
      nameEn: star.nameEn,
      fandomName: star.fandomName,
      agency: star.agency,
      baseCity: star.baseCity,
      bio: star.bio,
      tags: star.tags.join(", "),
      chinaFanPriority: star.chinaFanPriority ? String(star.chinaFanPriority) : "",
    });
  }

  function editNews(item: NewsItem) {
    setEditingNewsSlug(item.slug);
    newsForm.reset({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      bodyMd: "",
      sourceUrl: item.sourceUrl ?? "",
      relatedStars: item.relatedStars.join(", "),
    });
  }

  function hydrateEventDraftFromPayload(payload: Record<string, unknown> | null | undefined) {
    if (!payload) return;
    const officialTitle = String(payload.title ?? "");
    const venue = String(payload.venue ?? "");
    const city = String(payload.city ?? "");
    eventForm.setValue("slug", slugify(officialTitle || "thai-event-draft"));
    eventForm.setValue("title", officialTitle);
    eventForm.setValue("city", String(payload.city ?? ""));
    eventForm.setValue("venue", venue);
    eventForm.setValue("summary", buildEventSummaryDraft(String(payload.summary ?? ""), officialTitle, venue, city));
    eventForm.setValue("starSlugs", "");
    if (payload.startsAt) {
      const startsAt = toDatetimeLocal(String(payload.startsAt));
      if (startsAt) eventForm.setValue("startsAt", startsAt);
    }
    setDraftCreated(true);
  }

  function prepareEventDraftForPublish(payload: Record<string, unknown> | null | undefined) {
    hydrateEventDraftFromPayload(payload);
    setPublishEventAfterSave(true);
    toast.success("已载入活动草稿，下一次保存会直接按发布处理");
  }

  function hydrateNewsDraftFromJob(job: AdminConsoleProps["ingestionJobs"][number]) {
    const suggestedStars = suggestRelatedStars({
      stars,
      sourceUrl: job.source_url,
      text: [job.translated_content, job.summary, job.raw_content, JSON.stringify(job.extracted_payload ?? {})]
        .filter(Boolean)
        .join("\n"),
      sourceHints: job.extracted_payload,
      officialSources,
    });

    const title =
      readPayloadString(job.extracted_payload, "title") ||
      buildNewsTitle(job.summary, job.translated_content, job.source_url, job.extracted_payload);

    const excerpt = buildNewsExcerpt(job.summary, job.translated_content, job.raw_content);
    const sourceLabel = readPayloadString(job.extracted_payload, "sourceLabel");
    const bodyMd = buildNewsDraftBody({
      translatedContent: job.translated_content,
      summary: job.summary,
      sourceUrl: job.source_url,
      sourceLabel,
      title,
    });

    newsForm.reset({
      slug: slugify(title || `news-${new Date().toISOString()}`),
      title: title || "泰娱官方动态更新",
      excerpt,
      category: readPayloadString(job.extracted_payload, "startsAt") ? "活动速递" : "官宣",
      bodyMd,
      sourceUrl: job.source_url,
      relatedStars: suggestedStars.join(", "),
    });
    setEditingNewsSlug(null);
    toast.success("已从抓取任务生成动态草稿");
  }

  function prepareNewsDraftForPublish(job: AdminConsoleProps["ingestionJobs"][number]) {
    hydrateNewsDraftFromJob(job);
    setPublishNewsAfterSave(true);
    toast.success("已载入动态草稿，下一次保存会直接按发布处理");
  }

  async function deleteStar(slug: string) {
    setProcessingStarSlug(slug);
    try {
      const response = await fetch(`/api/admin/stars/${slug}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("明星已删除");
      router.refresh();
    } catch {
      toast.error("明星删除失败");
    } finally {
      setProcessingStarSlug(null);
    }
  }

  async function moveStarPriority(star: Star, direction: "up" | "down") {
    const currentIndex = sortedStars.findIndex((item) => item.slug === star.slug);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetStar = sortedStars[targetIndex];
    if (!targetStar) {
      toast.error(direction === "up" ? "已经在最前面了" : "已经在最后面了");
      return;
    }

    setProcessingStarSlug(star.slug);
    try {
      const currentPriority = star.chinaFanPriority ?? 999;
      const targetPriority = targetStar.chinaFanPriority ?? 999;

      const first = await fetch(`/api/admin/stars/${star.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinaFanPriority: targetPriority }),
      });
      if (!first.ok) throw new Error();

      const second = await fetch(`/api/admin/stars/${targetStar.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinaFanPriority: currentPriority }),
      });
      if (!second.ok) throw new Error();

      toast.success("明星优先级已调整");
      router.refresh();
    } catch {
      toast.error("优先级调整失败");
    } finally {
      setProcessingStarSlug(null);
    }
  }

  async function setStarAsTopOne(star: Star) {
    const currentTopStar = sortedStars[0];
    if (!currentTopStar || currentTopStar.slug === star.slug) {
      toast.error("当前已经是 TOP 1");
      return;
    }

    setProcessingStarSlug(star.slug);
    try {
      const currentPriority = star.chinaFanPriority ?? 999;
      const topPriority = currentTopStar.chinaFanPriority ?? 1;

      const first = await fetch(`/api/admin/stars/${star.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinaFanPriority: topPriority }),
      });
      if (!first.ok) throw new Error();

      const second = await fetch(`/api/admin/stars/${currentTopStar.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinaFanPriority: currentPriority }),
      });
      if (!second.ok) throw new Error();

      toast.success("已设为 TOP 1");
      router.refresh();
    } catch {
      toast.error("设为 TOP 1 失败");
    } finally {
      setProcessingStarSlug(null);
    }
  }

  async function resetRecommendedStarOrder() {
    if (!sortedStars.length) {
      toast.error("当前没有可调整的明星");
      return;
    }

    setProcessingStarSlug("reset-order");
    try {
      const updates = sortedStars.map((star, index) =>
        fetch(`/api/admin/stars/${star.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chinaFanPriority: index + 1 }),
        }),
      );

      const responses = await Promise.all(updates);
      if (responses.some((response) => !response.ok)) throw new Error();

      toast.success("已恢复为当前推荐排序");
      router.refresh();
    } catch {
      toast.error("恢复推荐排序失败");
    } finally {
      setProcessingStarSlug(null);
    }
  }

  async function exportStarPriorityList() {
    try {
      await navigator.clipboard.writeText(buildStarPriorityListJson(sortedStars));
      toast.success("当前热门明星顺序已复制到剪贴板");
    } catch {
      toast.error("导出失败，请稍后重试");
    }
  }

  async function exportStarPriorityPlainText() {
    try {
      await navigator.clipboard.writeText(buildStarPriorityPlainText(sortedStars));
      toast.success("纯文本顺序已复制到剪贴板");
    } catch {
      toast.error("纯文本导出失败，请稍后重试");
    }
  }

  async function copyTopThreeBrief() {
    try {
      const content = buildTopThreeBrief({ stars: sortedStars, events, newsItems });
      if (!content) {
        toast.error("当前没有可导出的热门明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("TOP 1-3 简报已复制到剪贴板");
    } catch {
      toast.error("TOP 1-3 简报导出失败，请稍后重试");
    }
  }

  async function copyTopThreeChatBrief() {
    try {
      const content = buildTopThreeChatBrief({ stars: sortedStars, events, newsItems });
      if (!content) {
        toast.error("当前没有可导出的热门明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("发群版 TOP 1-3 简报已复制到剪贴板");
    } catch {
      toast.error("发群版简报导出失败，请稍后重试");
    }
  }

  async function copyTopOneRecommendation() {
    try {
      const content = buildTopOneRecommendation({ stars: sortedStars, events, newsItems });
      if (!content) {
        toast.error("当前没有可导出的 TOP 1 明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("TOP 1 单人推荐文案已复制到剪贴板");
    } catch {
      toast.error("TOP 1 推荐文案导出失败，请稍后重试");
    }
  }

  async function copyTopThreeNewFanPitch() {
    try {
      const content = buildTopThreeNewFanPitch({ stars: sortedStars, events, newsItems });
      if (!content) {
        toast.error("当前没有可导出的热门明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("TOP 1-3 新粉安利版已复制到剪贴板");
    } catch {
      toast.error("新粉安利版导出失败，请稍后重试");
    }
  }

  async function copyTopOneShortPitch() {
    try {
      const content = buildTopOneShortPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的 TOP 1 明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("单人短安利版已复制到剪贴板");
    } catch {
      toast.error("单人短安利版导出失败，请稍后重试");
    }
  }

  async function copyTopOneEventPitch() {
    try {
      const content = buildTopOneEventPitch({ stars: sortedStars, events });
      if (!content) {
        toast.error("当前没有可导出的 TOP 1 明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("TOP 1 活动向安利版已复制到剪贴板");
    } catch {
      toast.error("活动向安利版导出失败，请稍后重试");
    }
  }

  async function copyTopOneCpPitch() {
    try {
      const content = buildTopOneCpPitch({ stars: sortedStars, newsItems });
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("TOP 1 CP 向安利版已复制到剪贴板");
    } catch {
      toast.error("CP 向安利版导出失败，请稍后重试");
    }
  }

  async function copyTopOneBrandPitch() {
    try {
      const content = buildTopOneBrandPitch({ stars: sortedStars, events });
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("品牌向安利版已复制到剪贴板");
    } catch {
      toast.error("品牌向安利版导出失败，请稍后重试");
    }
  }

  async function copyTopOneFashionPitch() {
    try {
      const content = buildTopOneFashionPitch({ stars: sortedStars, newsItems });
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("时尚向安利版已复制到剪贴板");
    } catch {
      toast.error("时尚向安利版导出失败，请稍后重试");
    }
  }

  async function copyNewFanThreeLinePitch() {
    try {
      const content = buildNewFanThreeLinePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的热门明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("新粉三句话推荐版已复制到剪贴板");
    } catch {
      toast.error("新粉三句话推荐版导出失败，请稍后重试");
    }
  }

  async function copyNewFanSingleParagraphPitch() {
    try {
      const content = buildNewFanSingleParagraphPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的热门明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("一段式新粉总安利已复制到剪贴板");
    } catch {
      toast.error("一段式新粉总安利导出失败，请稍后重试");
    }
  }

  async function copyActivityOrNewsChoicePitch() {
    try {
      const content = buildActivityOrNewsChoicePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("活动党 / 动态党二选一推荐版已复制到剪贴板");
    } catch {
      toast.error("二选一推荐版导出失败，请稍后重试");
    }
  }

  async function copyUltraShortPitch() {
    try {
      const content = buildUltraShortPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("超短一句话安利已复制到剪贴板");
    } catch {
      toast.error("超短一句话安利导出失败，请稍后重试");
    }
  }

  async function copyUltraShortActivityPitch() {
    try {
      const content = buildUltraShortActivityPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("超短活动党版已复制到剪贴板");
    } catch {
      toast.error("超短活动党版导出失败，请稍后重试");
    }
  }

  async function copyUltraShortNewsPitch() {
    try {
      const content = buildUltraShortNewsPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("超短动态党版已复制到剪贴板");
    } catch {
      toast.error("超短动态党版导出失败，请稍后重试");
    }
  }

  async function copyThreeMinutePitch() {
    try {
      const content = buildThreeMinutePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("3 分钟入门版已复制到剪贴板");
    } catch {
      toast.error("3 分钟入门版导出失败，请稍后重试");
    }
  }

  async function copySingleUpdatePitch() {
    try {
      const content = buildSingleUpdatePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("1 条更新版已复制到剪贴板");
    } catch {
      toast.error("1 条更新版导出失败，请稍后重试");
    }
  }

  async function copyHeadlineOnlyPitch() {
    try {
      const content = buildHeadlineOnlyPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("只看标题版已复制到剪贴板");
    } catch {
      toast.error("只看标题版导出失败，请稍后重试");
    }
  }

  async function copyNoTimePitch() {
    try {
      const content = buildNoTimePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("完全没时间版已复制到剪贴板");
    } catch {
      toast.error("完全没时间版导出失败，请稍后重试");
    }
  }

  async function copyOneNamePitch() {
    try {
      const content = buildOneNamePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("只记一个名字版已复制到剪贴板");
    } catch {
      toast.error("只记一个名字版导出失败，请稍后重试");
    }
  }

  async function copyOneClickPitch() {
    try {
      const content = buildOneClickPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("只点 1 次版已复制到剪贴板");
    } catch {
      toast.error("只点 1 次版导出失败，请稍后重试");
    }
  }

  async function copyOneGlancePitch() {
    try {
      const content = buildOneGlancePitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("只刷一眼版已复制到剪贴板");
    } catch {
      toast.error("只刷一眼版导出失败，请稍后重试");
    }
  }

  async function copyMinimumEffortPitch() {
    try {
      const content = buildMinimumEffortPitch(sortedStars);
      if (!content) {
        toast.error("当前没有可导出的明星");
        return;
      }
      await navigator.clipboard.writeText(content);
      toast.success("最低限度版已复制到剪贴板");
    } catch {
      toast.error("最低限度版导出失败，请稍后重试");
    }
  }

  async function deleteNews(slug: string) {
    setProcessingNewsSlug(slug);
    try {
      const response = await fetch(`/api/admin/news/${slug}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("动态已删除");
      router.refresh();
    } catch {
      toast.error("动态删除失败");
    } finally {
      setProcessingNewsSlug(null);
    }
  }

  async function updateIngestionStatus(id: string, status: "reviewed" | "rejected" | "published") {
    setProcessingJobId(id);
    try {
      const response = await fetch(`/api/admin/ingestion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      toast.success("任务状态已更新");
      router.refresh();
    } catch {
      toast.error("任务状态更新失败");
    } finally {
      setProcessingJobId(null);
    }
  }

  async function markIngestionJobReviewed(id: string) {
    try {
      await fetch(`/api/admin/ingestion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "reviewed" }),
      });
    } catch {
      // Silent best-effort update to keep batch processing smooth.
    }
  }

  async function bulkUpdateIngestionStatus(status: "reviewed" | "rejected" | "published") {
    if (!selectedJobIds.length) {
      toast.error("请先选择任务");
      return;
    }
    setProcessingJobId("bulk");
    try {
      const response = await fetch("/api/admin/ingestion/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedJobIds, status }),
      });
      if (!response.ok) throw new Error();
      toast.success("批量状态已更新");
      setSelectedJobIds([]);
      router.refresh();
    } catch {
      toast.error("批量更新失败");
    } finally {
      setProcessingJobId(null);
    }
  }

  function toggleJobSelection(id: string) {
    setSelectedJobIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAllFilteredJobs() {
    if (allFilteredJobsSelected) {
      setSelectedJobIds((current) => current.filter((id) => !filteredIngestionJobs.some((job) => job.id === id)));
      return;
    }
    setSelectedJobIds((current) => Array.from(new Set([...current, ...filteredIngestionJobs.map((job) => job.id)])));
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
      <TabsList className="grid w-full grid-cols-4 bg-[#0d1425]">
        <TabsTrigger value="ops">运营队列</TabsTrigger>
        <TabsTrigger value="event">活动管理</TabsTrigger>
        <TabsTrigger value="ai">AI 内容处理</TabsTrigger>
        <TabsTrigger value="content">内容录入</TabsTrigger>
      </TabsList>

      <TabsContent value="ops" className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ServiceRequestQueueCard
          pendingCount={pendingCount}
          requestQuery={requestQuery}
          requests={filteredRequests}
          processingRequestId={processingRequestId}
          onRequestQueryChange={setRequestQuery}
          onUpdateRequestStatus={updateRequestStatus}
        />

        <Card className="border-[#26324b] bg-[#10182c] text-white">
          <CardHeader>
            <CardTitle>抓取任务队列</CardTitle>
          </CardHeader>
          <CardContent>
            <IngestionWorkspaceControls
              queueStats={queueStats}
              allFilteredJobsSelected={allFilteredJobsSelected}
              processingJobId={processingJobId}
              ingestionSourceFilter={ingestionSourceFilter}
              ingestionStatusFilter={ingestionStatusFilter}
              officialSources={officialSources}
              showRestoredIngestionHint={showRestoredIngestionHint}
              showSavedIngestionHint={showSavedIngestionHint}
              selectedJobCount={selectedJobIds.length}
              selectedRecommendationStats={selectedRecommendationStats}
              selectedRecommendationMix={selectedRecommendationMix}
              onToggleAllFilteredJobs={toggleAllFilteredJobs}
              onBulkHydrateRecommendedDrafts={bulkHydrateRecommendedDrafts}
              onBulkHydrateNewsDrafts={bulkHydrateNewsDrafts}
              onBulkHydrateEventDrafts={bulkHydrateEventDrafts}
              onBulkUpdateReviewed={() => bulkUpdateIngestionStatus("reviewed")}
              onBulkUpdatePublished={() => bulkUpdateIngestionStatus("published")}
              onBulkUpdateRejected={() => bulkUpdateIngestionStatus("rejected")}
              onDismissRestoredHint={() => setShowRestoredIngestionHint(false)}
              onResetWorkspace={() => resetWorkspace()}
              onSplitRecommendedDrafts={bulkSplitRecommendedDrafts}
              onIngestionSourceFilterChange={setIngestionSourceFilter}
              onIngestionStatusFilterChange={setIngestionStatusFilter}
            />
            <IngestionJobsTable
              jobs={filteredIngestionJobs}
              selectedJobIds={selectedJobIds}
              processingJobId={processingJobId}
              onToggleJobSelection={toggleJobSelection}
              onHydrateEventDraft={hydrateEventDraftFromPayload}
              onHydrateNewsDraft={hydrateNewsDraftFromJob}
              onPrepareEventDraftForPublish={prepareEventDraftForPublish}
              onPrepareNewsDraftForPublish={prepareNewsDraftForPublish}
              onUpdateIngestionStatus={updateIngestionStatus}
              readPayloadString={readPayloadString}
              deriveQueuePreviewTitle={deriveQueuePreviewTitle}
              deriveQueuePreviewSummary={deriveQueuePreviewSummary}
              deriveQueueRecommendation={deriveQueueRecommendation}
              statusPillClassName={statusPillClassName}
              formatIngestionStatus={formatIngestionStatus}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="event" className="mt-6">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <EventEditorCard
            editingEventSlug={editingEventSlug}
            draftQueueMode={draftQueueMode}
            currentDraftQueueJob={draftQueueMode === "event" ? currentDraftQueueJob : null}
            currentDraftQueueJobsLength={currentDraftQueueJobs.length}
            draftQueueIndex={draftQueueIndex}
            pendingSplitNewsCount={pendingSplitNewsCount}
            submittingEvent={submittingEvent}
            eventForm={eventForm}
            onSubmit={submitEvent}
            onSetPublishAfterSave={setPublishEventAfterSave}
            onCancelEdit={() => {
              setEditingEventSlug(null);
              setDraftCreated(false);
              eventForm.reset({
                slug: "",
                title: "",
                type: "fanmeeting",
                city: "",
                venue: "",
                startsAt: "",
                summary: "",
                starSlugs: "",
              });
            }}
            onRetreatDraftQueue={retreatDraftQueue}
            onAdvanceDraftQueue={advanceDraftQueue}
            onSkipCurrentDraftQueueItem={skipCurrentDraftQueueItem}
            onClearDraftQueue={clearDraftQueue}
          />

          <EventListCard
            events={filteredEvents}
            eventQuery={eventQuery}
            eventTypeFilter={eventTypeFilter}
            eventStatusFilter={eventStatusFilter}
            processingEventSlug={processingEventSlug}
            onEventQueryChange={setEventQuery}
            onEventTypeFilterChange={setEventTypeFilter}
            onEventStatusFilterChange={setEventStatusFilter}
            onEditEvent={editEvent}
            onUpdateEventStatus={updateEventStatus}
            onDeleteEvent={deleteEvent}
          />
        </div>
      </TabsContent>

      <TabsContent value="ai" className="mt-6">
        <AiIngestionCard
          officialSources={officialSources}
          selectedOfficialSource={selectedOfficialSource}
          scraping={scraping}
          draftCreated={draftCreated}
          submittingIngest={submittingIngest}
          ingestResult={ingestResult}
          ingestForm={ingestForm}
          onSubmit={submitIngestion}
          onApplyOfficialSource={applyOfficialSource}
          onScrapeSource={scrapeSource}
        />

        <OfficialSourcesBoard
          sources={officialSources}
          batchQueueing={batchQueueing}
          dailyNewsGenerating={dailyNewsGenerating}
          creatingPreviewCandidate={creatingPreviewCandidate}
          previewingSourceSlug={previewingSourceSlug}
          sourcePreview={sourcePreview}
          previewCandidateSlug={previewCandidateSlug}
          onQueueBatchOfficialSources={queueBatchOfficialSources}
          onGenerateDailyNews={generateDailyNewsCandidates}
          onLoadSource={applyOfficialSource}
          onPreviewSource={previewOfficialSource}
          onClearPreview={() => setSourcePreview(null)}
          onCreatePreviewCandidate={createPreviewCandidate}
          onCopyPreviewHeadlineLink={copyPreviewHeadlineLink}
          onOpenPreviewSource={openPreviewSource}
          onOpenPreviewCandidate={openPreviewCandidate}
          onStartSourceScan={(slug) => {
            applyOfficialSource(slug);
            ingestForm.setValue("rawContent", "");
          }}
        />
      </TabsContent>

      <TabsContent value="content" className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <StarEditorCard
            editingStarSlug={editingStarSlug}
            submittingStar={submittingStar}
            starForm={starForm}
            onSubmit={submitStar}
            onCancelEdit={() => {
              setEditingStarSlug(null);
              starForm.reset({
                slug: "",
                nameCn: "",
                nameEn: "",
                fandomName: "",
                agency: "",
                baseCity: "",
                bio: "",
                tags: "",
                chinaFanPriority: "",
              });
            }}
          />

          <NewsEditorCard
            editingNewsSlug={editingNewsSlug}
            draftQueueMode={draftQueueMode}
            currentDraftQueueJob={draftQueueMode === "news" ? currentDraftQueueJob : null}
            currentDraftQueueJobsLength={currentDraftQueueJobs.length}
            draftQueueIndex={draftQueueIndex}
            submittingNews={submittingNews}
            newsForm={newsForm}
            onSubmit={submitNews}
            onSetPublishAfterSave={setPublishNewsAfterSave}
            onCancelEdit={() => {
              setEditingNewsSlug(null);
              newsForm.reset({
                slug: "",
                title: "",
                excerpt: "",
                category: "活动速递",
                bodyMd: "",
                sourceUrl: "",
                relatedStars: "",
              });
            }}
            onRetreatDraftQueue={retreatDraftQueue}
            onAdvanceDraftQueue={advanceDraftQueue}
            onSkipCurrentDraftQueueItem={skipCurrentDraftQueueItem}
            onClearDraftQueue={clearDraftQueue}
          />
        </div>

        <div className="space-y-6">
          <StarPriorityListCard
            stars={sortedStars}
            processingStarSlug={processingStarSlug}
            starAgencyFilter={starAgencyFilter}
            starTagFilter={starTagFilter}
            highPriorityOnly={highPriorityOnly}
            starAgencyOptions={starAgencyOptions}
            starTagOptions={starTagOptions}
            onExportStarPriorityList={exportStarPriorityList}
            onExportStarPriorityPlainText={exportStarPriorityPlainText}
            onCopyTopThreeBrief={copyTopThreeBrief}
            onCopyTopThreeChatBrief={copyTopThreeChatBrief}
            onCopyTopOneRecommendation={copyTopOneRecommendation}
            onCopyTopThreeNewFanPitch={copyTopThreeNewFanPitch}
            onCopyTopOneShortPitch={copyTopOneShortPitch}
            onCopyTopOneEventPitch={copyTopOneEventPitch}
            onCopyTopOneCpPitch={copyTopOneCpPitch}
            onCopyTopOneBrandPitch={copyTopOneBrandPitch}
            onCopyTopOneFashionPitch={copyTopOneFashionPitch}
            onCopyNewFanThreeLinePitch={copyNewFanThreeLinePitch}
            onCopyNewFanSingleParagraphPitch={copyNewFanSingleParagraphPitch}
            onCopyActivityOrNewsChoicePitch={copyActivityOrNewsChoicePitch}
            onCopyUltraShortPitch={copyUltraShortPitch}
            onCopyUltraShortActivityPitch={copyUltraShortActivityPitch}
            onCopyUltraShortNewsPitch={copyUltraShortNewsPitch}
            onCopyThreeMinutePitch={copyThreeMinutePitch}
            onCopySingleUpdatePitch={copySingleUpdatePitch}
            onCopyHeadlineOnlyPitch={copyHeadlineOnlyPitch}
            onCopyNoTimePitch={copyNoTimePitch}
            onCopyOneNamePitch={copyOneNamePitch}
            onCopyOneClickPitch={copyOneClickPitch}
            onCopyOneGlancePitch={copyOneGlancePitch}
            onCopyMinimumEffortPitch={copyMinimumEffortPitch}
            onResetRecommendedOrder={resetRecommendedStarOrder}
            onClearFilters={() => {
              setStarAgencyFilter("all");
              setStarTagFilter("all");
              setHighPriorityOnly(false);
            }}
            onToggleHighPriorityOnly={() => setHighPriorityOnly((current) => !current)}
            onStarAgencyFilterChange={setStarAgencyFilter}
            onStarTagFilterChange={setStarTagFilter}
            onSetStarAsTopOne={setStarAsTopOne}
            onMoveStarPriorityUp={(star) => moveStarPriority(star, "up")}
            onMoveStarPriorityDown={(star) => moveStarPriority(star, "down")}
            onEditStar={editStar}
            onDeleteStar={deleteStar}
          />

          <NewsListCard
            newsItems={filteredNews}
            newsQuery={newsQuery}
            newsStatusFilter={newsStatusFilter}
            newsEditorialFilter={newsEditorialFilter}
            processingNewsSlug={processingNewsSlug}
            onNewsQueryChange={setNewsQuery}
            onNewsStatusFilterChange={setNewsStatusFilter}
            onNewsEditorialFilterChange={setNewsEditorialFilter}
            onEditNews={editNews}
            onUpdateNewsStatus={updateNewsStatus}
            onDeleteNews={deleteNews}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function loadSavedIngestionUiState() {
  if (typeof window === "undefined") {
    return {
      sourceFilter: "all",
      statusFilter: "all",
      selectedJobIds: [] as string[],
      hasSavedContext: false,
    };
  }

  try {
    const raw = window.sessionStorage.getItem(INGESTION_UI_STATE_KEY);
    if (!raw) {
      return {
        sourceFilter: "all",
        statusFilter: "all",
        selectedJobIds: [] as string[],
        hasSavedContext: false,
      };
    }

    const parsed = JSON.parse(raw) as {
      sourceFilter?: string;
      statusFilter?: string;
      selectedJobIds?: string[];
    };

    return {
      sourceFilter: parsed.sourceFilter ?? "all",
      statusFilter: parsed.statusFilter ?? "all",
      selectedJobIds: Array.isArray(parsed.selectedJobIds) ? parsed.selectedJobIds : [],
      hasSavedContext: Boolean(
        (parsed.sourceFilter && parsed.sourceFilter !== "all") ||
          (parsed.statusFilter && parsed.statusFilter !== "all") ||
          (Array.isArray(parsed.selectedJobIds) && parsed.selectedJobIds.length > 0),
      ),
    };
  } catch {
    return {
      sourceFilter: "all",
      statusFilter: "all",
      selectedJobIds: [] as string[],
      hasSavedContext: false,
    };
  }
}

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildNewsTitle(
  summary?: string | null,
  translatedContent?: string | null,
  sourceUrl?: string,
  payload?: Record<string, unknown> | null,
) {
  const payloadTitle = readPayloadString(payload, "title");
  if (payloadTitle) return payloadTitle;

  const candidate = firstSentence(summary) || firstSentence(translatedContent);
  if (candidate) return candidate.slice(0, 48);

  const domain = sourceUrl ? safeDomain(sourceUrl) : "official-source";
  return `${domain} 官方动态更新`;
}

function buildNewsExcerpt(summary?: string | null, translatedContent?: string | null, rawContent?: string | null) {
  const cleaned = (summary || translatedContent || rawContent || "待补充摘要").replace(/\s+/g, " ").trim();
  const normalized = cleaned.replace(/^(摘要|总结|中文整理)[:：]\s*/i, "");
  return normalized.slice(0, 140);
}

function buildEventSummaryDraft(summary: string, title: string, venue: string, city: string) {
  const cleaned = summary.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    const venueText = [venue, city].filter(Boolean).join(" · ");
    return `这是一场与「${title || "待确认活动"}」相关的活动草稿，建议用中文补充活动看点、是否值得抢票，以及${venueText ? `${venueText} 的到场价值` : "到场价值"}。`;
  }

  const normalized = cleaned.replace(/^(摘要|总结|中文说明|中文整理)[:：]\s*/i, "");
  if (/[。！？!?]$/.test(normalized)) return normalized;
  return `${normalized}。`;
}

function buildNewsDraftBody({
  translatedContent,
  summary,
  sourceUrl,
  sourceLabel,
  title,
}: {
  translatedContent?: string | null;
  summary?: string | null;
  sourceUrl: string;
  sourceLabel?: string | null;
  title: string;
}) {
  const cleanedSummary = (summary ?? "").trim().replace(/^(摘要|总结)[:：]\s*/i, "");
  const cleanedTranslation = (translatedContent ?? "").trim();

  return [
    "## 原始标题 / 官方写法",
    title || "待补充官方标题",
    cleanedSummary ? `## 中文摘要\n\n${cleanedSummary}` : "",
    cleanedTranslation ? `## 中文整理\n\n${cleanedTranslation}` : "",
    "## 原文保留建议",
    "艺人名、品牌名、活动名、商场名和场馆名建议继续保留官方原文，方便用户后续搜索官宣、地图和票务信息。",
    `## 来源\n\n${sourceUrl}`,
    sourceLabel ? `\n${sourceLabel}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function deriveQueuePreviewTitle(job: AdminConsoleProps["ingestionJobs"][number]) {
  return (
    buildNewsTitle(job.summary, job.translated_content, job.source_url, job.extracted_payload) ||
    "待补充官方标题"
  );
}

function deriveQueuePreviewSummary(job: AdminConsoleProps["ingestionJobs"][number]) {
  const eventSummary = readPayloadString(job.extracted_payload, "summary");
  if (eventSummary) return buildEventSummaryDraft(eventSummary, "", "", "");
  return buildNewsExcerpt(job.summary, job.translated_content, job.raw_content);
}

function deriveQueueRecommendation(job: AdminConsoleProps["ingestionJobs"][number]) {
  const payloadHasEventSignals =
    Boolean(readPayloadString(job.extracted_payload, "startsAt")) ||
    Boolean(readPayloadString(job.extracted_payload, "venue")) ||
    Boolean(readPayloadString(job.extracted_payload, "city"));

  if (payloadHasEventSignals) {
    return {
      action: "event" as const,
      label: "更适合转活动草稿",
      reason: "这条内容已经带有时间、场馆或城市信息，更像可落成活动日历的排期内容。",
    };
  }

  const summaryText = [job.summary, job.translated_content, job.raw_content]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const containsAnnouncementSignals =
    /announce|launch|poster|campaign|update|official|coming soon|直播|官宣|预告|海报|公开|品牌/.test(summaryText);

  if (containsAnnouncementSignals) {
    return {
      action: "news" as const,
      label: "更适合转动态草稿",
      reason: "这条更像官宣、预告或品牌内容，先做中文动态快读会更顺。",
    };
  }

  return {
    action: "news" as const,
    label: "建议先转动态草稿",
    reason: "如果还看不出明确排期字段，先整理成动态更稳，后续再决定是否补成活动。",
  };
}

function readPayloadString(payload: Record<string, unknown> | null | undefined, key: string) {
  const value = payload?.[key];
  return typeof value === "string" ? value : "";
}

function firstSentence(value?: string | null) {
  if (!value) return "";
  return value.split(/[\n。！？!?.]/).map((item) => item.trim()).find(Boolean) ?? "";
}

function safeDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "official-source";
  }
}

function suggestRelatedStars({
  stars,
  sourceUrl,
  text,
  sourceHints,
  officialSources,
}: {
  stars: Star[];
  sourceUrl: string;
  text: string;
  sourceHints?: Record<string, unknown> | null;
  officialSources: SourceCatalogItem[];
}) {
  const haystack = `${sourceUrl}\n${text}\n${JSON.stringify(sourceHints ?? {})}`.toLowerCase();
  const officialMatch = officialSources.find((item) =>
    item.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );

  const matched = stars.filter((star) => {
    const nameEn = star.nameEn.toLowerCase();
    const nameCn = star.nameCn.toLowerCase();
    const slug = star.slug.toLowerCase();
    const agency = star.agency.toLowerCase();
    const spotlight = star.spotlight.join(" ").toLowerCase();
    const sourceCompany = readPayloadString(sourceHints, "sourceCompany").toLowerCase();

    return (
      haystack.includes(nameEn) ||
      haystack.includes(nameCn) ||
      haystack.includes(slug) ||
      (agency && haystack.includes(agency)) ||
      (sourceCompany && agency && sourceCompany.includes(agency)) ||
      (spotlight && haystack.includes(spotlight))
    );
  });

  const explicit = officialMatch?.commonStarSlugs?.filter((slug) => stars.some((star) => star.slug === slug)) ?? [];
  return Array.from(new Set([...explicit, ...matched.map((star) => star.slug)])).slice(0, 4);
}

function formatIngestionStatus(status: string) {
  switch (status) {
    case "queued":
      return "待处理";
    case "processed":
      return "已提取";
    case "reviewed":
      return "待发布";
    case "published":
      return "已发布";
    case "rejected":
      return "已驳回";
    default:
      return status;
  }
}

function statusPillClassName(status: string) {
  switch (status) {
    case "queued":
      return "rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/75";
    case "processed":
      return "rounded-full border border-sky-400/30 px-2 py-0.5 text-xs text-sky-200";
    case "reviewed":
      return "rounded-full border border-amber-400/30 px-2 py-0.5 text-xs text-amber-200";
    case "published":
      return "rounded-full border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-200";
    case "rejected":
      return "rounded-full border border-rose-400/30 px-2 py-0.5 text-xs text-rose-200";
    default:
      return "rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/75";
  }
}
