"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const INGESTION_UI_STATE_KEY = "thaistar-admin-ingestion-ui";

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
};

type UseDraftQueueOrchestratorArgs = {
  ingestionJobs: IngestionJob[];
  filteredIngestionJobs: IngestionJob[];
  selectedJobIds: string[];
  ingestionSourceFilter: string;
  ingestionStatusFilter: string;
  initialHasSavedContext: boolean;
  deriveQueueRecommendation: (job: IngestionJob) => QueueRecommendation;
  hydrateEventDraftFromPayload: (payload: Record<string, unknown> | null | undefined) => void;
  hydrateNewsDraftFromJob: (job: IngestionJob) => void;
  onResetWorkspaceState: () => void;
};

export function useDraftQueueOrchestrator({
  ingestionJobs,
  filteredIngestionJobs,
  selectedJobIds,
  ingestionSourceFilter,
  ingestionStatusFilter,
  initialHasSavedContext,
  deriveQueueRecommendation,
  hydrateEventDraftFromPayload,
  hydrateNewsDraftFromJob,
  onResetWorkspaceState,
}: UseDraftQueueOrchestratorArgs) {
  const [draftQueueJobIds, setDraftQueueJobIds] = useState<string[]>([]);
  const [draftQueueMode, setDraftQueueMode] = useState<"news" | "event" | null>(null);
  const [draftQueueIndex, setDraftQueueIndex] = useState(0);
  const [pendingSplitNewsJobIds, setPendingSplitNewsJobIds] = useState<string[]>([]);
  const [showRestoredIngestionHint, setShowRestoredIngestionHint] = useState(initialHasSavedContext);
  const [showSavedIngestionHint, setShowSavedIngestionHint] = useState(false);
  const lastSavedWorkspaceSignatureRef = useRef("");

  const currentDraftQueueJobs = useMemo(
    () =>
      draftQueueJobIds
        .map((id) => ingestionJobs.find((job) => job.id === id))
        .filter(Boolean) as IngestionJob[],
    [draftQueueJobIds, ingestionJobs],
  );

  const currentDraftQueueJob = currentDraftQueueJobs[draftQueueIndex] ?? null;
  const pendingSplitNewsCount = pendingSplitNewsJobIds.length;

  const ingestionWorkspaceSignature = useMemo(
    () => JSON.stringify([ingestionSourceFilter, ingestionStatusFilter, [...selectedJobIds].sort()]),
    [ingestionSourceFilter, ingestionStatusFilter, selectedJobIds],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        INGESTION_UI_STATE_KEY,
        JSON.stringify({
          sourceFilter: ingestionSourceFilter,
          statusFilter: ingestionStatusFilter,
          selectedJobIds,
        }),
      );
    } catch {
      // Ignore storage write failures and keep the UI usable.
    }
  }, [ingestionSourceFilter, ingestionStatusFilter, selectedJobIds]);

  useEffect(() => {
    if (!lastSavedWorkspaceSignatureRef.current) {
      lastSavedWorkspaceSignatureRef.current = ingestionWorkspaceSignature;
      return;
    }

    if (lastSavedWorkspaceSignatureRef.current === ingestionWorkspaceSignature) return;

    lastSavedWorkspaceSignatureRef.current = ingestionWorkspaceSignature;
    setShowSavedIngestionHint(true);
    const timer = window.setTimeout(() => setShowSavedIngestionHint(false), 2200);
    return () => window.clearTimeout(timer);
  }, [ingestionWorkspaceSignature]);

  function resetWorkspace(options?: { silent?: boolean }) {
    onResetWorkspaceState();
    setShowRestoredIngestionHint(false);
    setShowSavedIngestionHint(false);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(INGESTION_UI_STATE_KEY);
      } catch {
        // Ignore storage write failures and keep the UI usable.
      }
    }
    if (!options?.silent) {
      toast.success("已恢复默认工作面");
    }
  }

  function bulkHydrateNewsDrafts() {
    const jobs = filteredIngestionJobs.filter((job) => selectedJobIds.includes(job.id));
    if (!jobs.length) {
      toast.error("请先选择任务");
      return;
    }
    setDraftQueueJobIds(jobs.map((job) => job.id));
    setDraftQueueMode("news");
    setDraftQueueIndex(0);
    hydrateNewsDraftFromJob(jobs[0]);
    toast.success(`已进入动态草稿批处理，第 1 条 / 共 ${jobs.length} 条`);
  }

  function bulkHydrateEventDrafts() {
    const jobs = filteredIngestionJobs.filter((job) => selectedJobIds.includes(job.id) && job.extracted_payload);
    if (!jobs.length) {
      toast.error("所选任务里没有可转活动的提取结果");
      return;
    }
    setDraftQueueJobIds(jobs.map((job) => job.id));
    setDraftQueueMode("event");
    setDraftQueueIndex(0);
    hydrateEventDraftFromPayload(jobs[0].extracted_payload);
    toast.success(`已进入活动草稿批处理，第 1 条 / 共 ${jobs.length} 条`);
  }

  function bulkHydrateRecommendedDrafts() {
    const jobs = filteredIngestionJobs.filter((job) => selectedJobIds.includes(job.id));
    if (!jobs.length) {
      toast.error("请先选择任务");
      return;
    }

    const recommendedEventJobs = jobs.filter(
      (job) => job.extracted_payload && deriveQueueRecommendation(job).action === "event",
    );
    const recommendedNewsJobs = jobs.filter((job) => deriveQueueRecommendation(job).action === "news");

    if (recommendedEventJobs.length >= recommendedNewsJobs.length && recommendedEventJobs.length > 0) {
      setDraftQueueJobIds(recommendedEventJobs.map((job) => job.id));
      setDraftQueueMode("event");
      setDraftQueueIndex(0);
      hydrateEventDraftFromPayload(recommendedEventJobs[0].extracted_payload);
      toast.success(`已按推荐方向进入活动批处理，第 1 条 / 共 ${recommendedEventJobs.length} 条`);
      return;
    }

    if (recommendedNewsJobs.length > 0) {
      setDraftQueueJobIds(recommendedNewsJobs.map((job) => job.id));
      setDraftQueueMode("news");
      setDraftQueueIndex(0);
      hydrateNewsDraftFromJob(recommendedNewsJobs[0]);
      toast.success(`已按推荐方向进入动态批处理，第 1 条 / 共 ${recommendedNewsJobs.length} 条`);
      return;
    }

    toast.error("当前所选任务暂时无法判断推荐方向");
  }

  function bulkSplitRecommendedDrafts() {
    const jobs = filteredIngestionJobs.filter((job) => selectedJobIds.includes(job.id));
    if (!jobs.length) {
      toast.error("请先选择任务");
      return;
    }

    const recommendedEventJobs = jobs.filter(
      (job) => job.extracted_payload && deriveQueueRecommendation(job).action === "event",
    );
    const recommendedNewsJobs = jobs.filter((job) => deriveQueueRecommendation(job).action === "news");

    if (!recommendedEventJobs.length || !recommendedNewsJobs.length) {
      toast.error("当前勾选内容并不混合，直接按推荐方向批量处理会更合适");
      return;
    }

    setPendingSplitNewsJobIds(recommendedNewsJobs.map((job) => job.id));
    setDraftQueueJobIds(recommendedEventJobs.map((job) => job.id));
    setDraftQueueMode("event");
    setDraftQueueIndex(0);
    hydrateEventDraftFromPayload(recommendedEventJobs[0].extracted_payload);
    toast.success(
      `已自动拆成两批：活动 ${recommendedEventJobs.length} 条，动态 ${recommendedNewsJobs.length} 条。先进入活动批处理，完成后会自动切到动态批处理。`,
    );
  }

  function startPendingSplitNewsQueue(options?: { silent?: boolean }) {
    if (!pendingSplitNewsJobIds.length) return false;
    const newsJobs = pendingSplitNewsJobIds
      .map((id) => ingestionJobs.find((job) => job.id === id))
      .filter(Boolean) as IngestionJob[];
    if (!newsJobs.length) {
      setPendingSplitNewsJobIds([]);
      return false;
    }
    setDraftQueueJobIds(newsJobs.map((job) => job.id));
    setDraftQueueMode("news");
    setDraftQueueIndex(0);
    setPendingSplitNewsJobIds([]);
    hydrateNewsDraftFromJob(newsJobs[0]);
    if (!options?.silent) {
      toast.success(`活动批处理已完成，已自动切换到动态批处理：第 1 条 / 共 ${newsJobs.length} 条`);
    }
    return true;
  }

  function advanceDraftQueue(options?: { silent?: boolean }) {
    if (!draftQueueMode || !currentDraftQueueJobs.length) {
      toast.error("当前没有进行中的批处理草稿");
      return;
    }

    const nextIndex = draftQueueIndex + 1;
    if (nextIndex >= currentDraftQueueJobs.length) {
      const switchedToNews = draftQueueMode === "event" ? startPendingSplitNewsQueue(options) : false;
      if (!switchedToNews) {
        if (!options?.silent) {
          toast.success("批处理草稿已经全部处理完");
        }
        setDraftQueueJobIds([]);
        setDraftQueueMode(null);
        setDraftQueueIndex(0);
      }
      return;
    }

    const nextJob = currentDraftQueueJobs[nextIndex];
    setDraftQueueIndex(nextIndex);
    if (draftQueueMode === "news") {
      hydrateNewsDraftFromJob(nextJob);
    } else if (nextJob.extracted_payload) {
      hydrateEventDraftFromPayload(nextJob.extracted_payload);
    }
    if (!options?.silent) {
      toast.success(`已切换到第 ${nextIndex + 1} 条，共 ${currentDraftQueueJobs.length} 条`);
    }
  }

  function retreatDraftQueue() {
    if (!draftQueueMode || !currentDraftQueueJobs.length) {
      toast.error("当前没有进行中的批处理草稿");
      return;
    }

    const previousIndex = draftQueueIndex - 1;
    if (previousIndex < 0) {
      toast.error("已经是第一条了");
      return;
    }

    const previousJob = currentDraftQueueJobs[previousIndex];
    setDraftQueueIndex(previousIndex);
    if (draftQueueMode === "news") {
      hydrateNewsDraftFromJob(previousJob);
    } else if (previousJob.extracted_payload) {
      hydrateEventDraftFromPayload(previousJob.extracted_payload);
    }
    toast.success(`已回到第 ${previousIndex + 1} 条，共 ${currentDraftQueueJobs.length} 条`);
  }

  function skipCurrentDraftQueueItem() {
    if (!draftQueueMode || !currentDraftQueueJobs.length) {
      toast.error("当前没有进行中的批处理草稿");
      return;
    }

    const isLast = draftQueueIndex + 1 >= currentDraftQueueJobs.length;
    if (isLast) {
      clearDraftQueue();
      toast.success("当前已是最后一条，批处理已结束");
      return;
    }

    advanceDraftQueue();
    toast.success("已跳过当前条");
  }

  function clearDraftQueue(options?: { silent?: boolean }) {
    setDraftQueueJobIds([]);
    setDraftQueueMode(null);
    setDraftQueueIndex(0);
    setPendingSplitNewsJobIds([]);
    if (!options?.silent) {
      toast.success("已退出批处理草稿模式");
    }
  }

  return {
    draftQueueJobIds,
    draftQueueMode,
    draftQueueIndex,
    pendingSplitNewsJobIds,
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
  };
}
