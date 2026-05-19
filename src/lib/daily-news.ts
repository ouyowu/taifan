import { scrapeSourceForDailyNews } from "@/lib/scrape";
import { officialSourceCatalog } from "@/lib/source-catalog";
import { runIngestionPipeline } from "@/lib/ai/pipeline";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type DailyNewsRunOptions = {
  sourceSlugs?: string[];
  vendor?: "openai" | "anthropic" | "google";
};

type DailyNewsRunResult = {
  created: Array<{ slug: string; title: string; source: string }>;
  skipped: Array<{ source: string; reason: string }>;
  failed: Array<{ source: string; reason: string }>;
};

function resolveDailyNewsVendor(preferred?: DailyNewsRunOptions["vendor"]) {
  if (preferred) return preferred;
  if (process.env.OPENAI_API_KEY) return "openai" as const;
  if (process.env.ANTHROPIC_API_KEY) return "anthropic" as const;
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google" as const;
  return "openai" as const;
}

function resolveSourceType(source: (typeof officialSourceCatalog)[number]) {
  if (source.ingestion?.mode === "gmmtv-news") return "website-news";
  if (source.ingestion?.mode === "change2561-activity") return "website-activity";
  if (source.ingestion?.mode === "youtube-videos") return "youtube-videos";
  if (source.ingestion?.mode === "facebook-posts") return "facebook-page";
  return "instagram-profile";
}

export async function runDailyNewsPipeline(
  options: DailyNewsRunOptions = {},
): Promise<DailyNewsRunResult> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase service role 未配置");
  }

  const vendor = resolveDailyNewsVendor(options.vendor);
  const sources = (options.sourceSlugs?.length
    ? officialSourceCatalog.filter((item) => options.sourceSlugs?.includes(item.slug))
    : officialSourceCatalog
  ).filter((item) => item.active !== false);

  const result: DailyNewsRunResult = {
    created: [],
    skipped: [],
    failed: [],
  };

  for (const source of sources) {
    try {
      const scraped = await scrapeSourceForDailyNews(source);
      const rawText = `${scraped.title}\n${scraped.excerpt}\n${scraped.text}`.trim();

      if (rawText.length < 80) {
        result.skipped.push({ source: source.label, reason: "抓取正文太短，暂不生成" });
        continue;
      }

      const aiSummary = await runIngestionPipeline({
        rawContent: rawText,
        sourceUrl: scraped.url,
        task: "summarize",
        vendor,
      });

      const summaryText = "text" in aiSummary ? aiSummary.text.trim() : "";
      if (!summaryText) {
        result.skipped.push({ source: source.label, reason: "AI 未返回可用摘要" });
        continue;
      }

      const category = await classifyDailyNewsCategory({
        rawText,
        summaryText,
        sourceUrl: scraped.url,
        vendor,
      });
      const title = buildNewsTitle(source.label, scraped.title);
      const publishedAt = new Date().toISOString();
      const slug = buildDailyNewsSlug(source.slug, title, publishedAt);

      const { data: existing } = await supabase
        .from("news_posts")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();

      if (existing?.slug) {
        result.skipped.push({ source: source.label, reason: "今天这条候选已生成过" });
        continue;
      }

      const duplicate = await findRecentDuplicate({
        supabase,
        sourceUrl: scraped.url,
        title,
        summaryText,
      });

      if (duplicate) {
        result.skipped.push({ source: source.label, reason: duplicate });
        continue;
      }

      const bodyMd = buildDailyNewsBody({
        sourceLabel: source.label,
        sourceHandle: source.handle,
        summaryText,
        category,
        ingestionMode: source.ingestion?.mode ?? "profile",
      });

      const { error } = await supabase.from("news_posts").insert({
        slug,
        title,
        excerpt: summaryText.slice(0, 140),
        body_md: bodyMd,
        category,
        review_status: "reviewed",
        published_at: null,
        source_url: scraped.url,
        related_star_slugs: source.commonStarSlugs ?? [],
      });

      if (error) {
        result.failed.push({ source: source.label, reason: error.message });
        continue;
      }

      await supabase.from("ingestion_jobs").insert({
        source_url: scraped.url,
        source_type: resolveSourceType(source),
        model_vendor: vendor,
        status: "reviewed",
        raw_content: rawText.slice(0, 12000),
        summary: `${source.label} · daily news candidate ready for review`,
        translated_content: summaryText,
        extracted_payload: {
          task: "daily-news",
          sourceCompany: source.company,
          sourceHandle: source.handle,
          sourceLabel: `${source.label} ${source.handle}`,
          newsSlug: slug,
        },
      });

      result.created.push({ slug, title, source: source.label });
    } catch (error) {
      result.failed.push({
        source: source.label,
        reason: error instanceof Error ? error.message : "未知错误",
      });
    }
  }

  return result;
}

function inferNewsCategory(text: string) {
  const haystack = text.toLowerCase();

  if (
    haystack.includes("live") ||
    haystack.includes("livestream") ||
    haystack.includes("直播") ||
    haystack.includes("上线") ||
    haystack.includes("watch")
  ) {
    return "直播";
  }
  if (
    haystack.includes("ticket") ||
    haystack.includes("tickets") ||
    haystack.includes("booking") ||
    haystack.includes("reserve") ||
    haystack.includes("reserve now") ||
    haystack.includes("fan meeting") ||
    haystack.includes("concert") ||
    haystack.includes("event") ||
    haystack.includes("tour") ||
    haystack.includes("meet") ||
    haystack.includes("show")
  ) {
    return "活动速递";
  }
  if (
    haystack.includes("brand") ||
    haystack.includes("campaign") ||
    haystack.includes("launch") ||
    haystack.includes("pop up") ||
    haystack.includes("popup") ||
    haystack.includes("store") ||
    haystack.includes("fashion") ||
    haystack.includes("beauty")
  ) {
    return "品牌活动";
  }
  return "官宣";
}

async function classifyDailyNewsCategory({
  rawText,
  summaryText,
  sourceUrl,
  vendor,
}: {
  rawText: string;
  summaryText: string;
  sourceUrl: string;
  vendor: DailyNewsRunOptions["vendor"];
}) {
  try {
    const classified = await runIngestionPipeline({
      rawContent: `${rawText}\n\n${summaryText}`,
      sourceUrl,
      task: "classify",
      vendor,
    });

    if ("category" in classified && classified.category) {
      return classified.category;
    }
  } catch {
    // Fall back to the keyword heuristic when the classifier is unavailable.
  }

  return inferNewsCategory(`${rawText}\n${summaryText}`);
}

function buildNewsTitle(sourceLabel: string, originalTitle: string) {
  const cleaned = originalTitle.replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.toLowerCase() === "untitled") {
    return `${sourceLabel} Official Update`;
  }
  return cleaned;
}

function buildDailyNewsSlug(sourceSlug: string, title: string, publishedAt: string) {
  const datePart = publishedAt.slice(0, 10);
  const slugTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);

  return `${sourceSlug}-${datePart}-${slugTitle || "daily-update"}`;
}

async function findRecentDuplicate({
  supabase,
  sourceUrl,
  title,
  summaryText,
}: {
  supabase: NonNullable<ReturnType<typeof createSupabaseAdminClient>>;
  sourceUrl: string;
  title: string;
  summaryText: string;
}) {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString();
  const { data, error } = await supabase
    .from("news_posts")
    .select("slug,title,excerpt,source_url,published_at")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error || !data?.length) return null;

  const normalizedTitle = normalizeForCompare(title);
  const normalizedSummary = normalizeForCompare(summaryText).slice(0, 80);

  const duplicate = data.find((item) => {
    const existingTitle = normalizeForCompare(item.title ?? "");
    const existingExcerpt = normalizeForCompare(item.excerpt ?? "");

    if ((item.source_url ?? "") === sourceUrl && existingTitle === normalizedTitle) {
      return true;
    }

    if (existingTitle && normalizedTitle && (existingTitle.includes(normalizedTitle) || normalizedTitle.includes(existingTitle))) {
      return true;
    }

    if (existingExcerpt && normalizedSummary && existingExcerpt.includes(normalizedSummary)) {
      return true;
    }

    return false;
  });

  return duplicate ? "最近 3 天内已有高度相似的 news，已跳过重复生成" : null;
}

function normalizeForCompare(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N}\s]/gu, "").trim();
}

function buildDailyNewsBody({
  sourceLabel,
  sourceHandle,
  summaryText,
  category,
  ingestionMode,
}: {
  sourceLabel: string;
  sourceHandle: string;
  summaryText: string;
  category: string;
  ingestionMode: "profile" | "gmmtv-news" | "change2561-activity" | "youtube-videos" | "facebook-posts";
}) {
  const readingHint =
    category === "活动速递"
      ? "这类内容建议优先看时间、地点、预约或购票变化。"
      : category === "品牌活动"
        ? "这类内容建议优先看品牌露出、到场时间段和围观方式。"
        : category === "直播"
          ? "这类内容建议优先看上线时间、观看入口和回放可能性。"
          : "这类内容建议优先确认是否为正式官宣，以及后续是否会追加更多信息。";

  const sourceSpecificReadHint =
    ingestionMode === "facebook-posts"
      ? "这类 Facebook 动态通常更像预售提醒、商品上新或官方宣传图发布，建议优先确认有没有开售时间、预购规则、套组内容或追加海报。"
      : ingestionMode === "change2561-activity"
        ? "这类官网活动页通常更接近正式活动说明，建议优先确认城市、场馆、主办和活动标题写法。"
        : ingestionMode === "youtube-videos"
          ? "这类 YouTube 更新更适合先判断是正片、幕后、预告还是直播回放，再决定要不要补成长动态。"
          : "这类官网新闻更适合先抓正式标题、人物关联和后续会不会继续发海报或预约页。";

  const sourceSpecificContext =
    ingestionMode === "youtube-videos"
      ? "【补充背景】\n这类内容很多时候只会给出视频标题和频道更新时间，本身不一定像官网新闻那样自带完整说明。所以站内会优先把它理解成一次官方内容动作：可能是 vlog、预告、幕后、直播回放，或者为后续活动预热的公开视频更新。读的时候建议把它当成“最近这位艺人或公司在推什么内容线”的提示，而不是一篇已经写满细节的正式通稿。"
      : ingestionMode === "facebook-posts"
        ? "【补充背景】\n这类动态更像商品上新、预售提醒、套组宣传或活动海报更新。它的重要性不一定在长正文，而在于时间点、套组名、预购入口和追加物料。"
        : "";

  const sourceSpecificUpdate =
    ingestionMode === "facebook-posts"
      ? "如果官方后续把这条 Facebook 动态补成完整商品贴、预售贴或活动贴，站内会继续把海报、购入线索和追加说明补进来。"
      : ingestionMode === "youtube-videos"
        ? "如果官方后续补了更完整的说明文、节目页或二次剪辑，站内会把视频更新和关联动态继续合并整理。"
        : "如果官方后续补充了海报、预约页、售票细节或正式说明，站内会继续把更新合并到这条动态里。";

  return [
    "【中文快读】",
    summaryText,
    `【怎么理解这条】\n${readingHint}`,
    sourceSpecificContext,
    `【这类来源通常怎么读】\n${sourceSpecificReadHint}`,
    `【来源说明】\n这条内容基于 ${sourceLabel} ${sourceHandle} 当日公开页面整理生成，保留原始标题与来源链接，方便粉丝继续搜索、核对与追踪。`,
    `【后续更新】\n${sourceSpecificUpdate}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
