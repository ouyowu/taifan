import { unstable_noStore as noStore } from "next/cache";

import { deriveSourceMetadata } from "@/lib/source-metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { events as mockEvents, newsItems as mockNews, services as mockServices, stars as mockStars } from "@/lib/mock-data";
import type { Event, NewsItem, ServiceItem, Star } from "@/types/domain";

const CHINA_PRIORITY_STAR_SLUGS = [
  "bright-vaid",
  "win-metawin",
  "billkin",
  "pp-krit",
  "gemini-norawit",
  "fourth-nattawat",
];

const allowMockFallback =
  process.env.NODE_ENV !== "production" && process.env.DISABLE_MOCK_FALLBACK !== "1";

function fallbackOr<T>(liveValue: T, mockValue: T) {
  return allowMockFallback ? mockValue : liveValue;
}

type ServiceRequestRow = {
  id: string;
  fan_name: string;
  contact_handle: string;
  service_type: string;
  target_star: string | null;
  desired_date: string | null;
  budget_range: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

type IngestionJobRow = {
  id: string;
  source_url: string;
  source_type: string;
  model_vendor: string;
  status: string;
  raw_content: string | null;
  translated_content: string | null;
  summary: string | null;
  extracted_payload?: Record<string, unknown> | null;
  created_at: string;
};

type EventRow = {
  slug: string;
  title: string;
  type: Event["type"];
  status: Event["status"];
  city: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  source_url: string | null;
  summary: string | null;
  ai_extracted: Record<string, unknown> | null;
  event_stars?: Array<{ stars?: { slug?: string }[] | { slug?: string } | null }>;
};

type NewsRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string | null;
  category: string | null;
  review_status: "draft" | "reviewed" | "published" | "rejected" | null;
  published_at: string | null;
  created_at: string;
  source_url: string | null;
  related_star_slugs: string[] | null;
};

type StarRow = {
  id?: string;
  slug: string;
  name_cn: string;
  name_en: string;
  fandom_name: string | null;
  agency: string | null;
  base_city: string | null;
  bio: string | null;
  tags: string[] | null;
  avatar_url: string | null;
  cover_url: string | null;
  china_fan_priority?: number | null;
};

function mapStarRowToStar(row: StarRow): Star {
  const fallbackStar = mockStars.find((star) => star.slug === row.slug);

  return {
    slug: row.slug,
    nameCn: row.name_cn,
    nameEn: row.name_en,
    fandomName: row.fandom_name ?? "",
    agency: row.agency ?? "",
    baseCity: row.base_city ?? "",
    bio: row.bio ?? fallbackStar?.bio ?? "",
    tags: row.tags ?? fallbackStar?.tags ?? [],
    avatarUrl: row.avatar_url ?? fallbackStar?.avatarUrl ?? mockStars[0]?.avatarUrl ?? "",
    coverUrl: row.cover_url ?? fallbackStar?.coverUrl ?? mockStars[0]?.coverUrl ?? "",
    galleryUrls: fallbackStar?.galleryUrls ?? [],
    profileFacts: fallbackStar?.profileFacts ?? [],
    spotlight: fallbackStar?.spotlight ?? row.tags ?? [],
    profileNotes: fallbackStar?.profileNotes ?? [],
    followTracks: fallbackStar?.followTracks ?? [],
    milestones: fallbackStar?.milestones ?? [],
    chinaFanPriority: row.china_fan_priority ?? undefined,
  };
}

export async function listStars(): Promise<Star[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackOr([], prioritizeStars(mockStars));

  const { data, error } = await supabase
    .from("stars")
    .select("*")
    .order("china_fan_priority", { ascending: true })
    .order("popularity_score", { ascending: false });
  if (error || !data?.length) return fallbackOr([], prioritizeStars(mockStars));

  return prioritizeStars((data as StarRow[]).map(mapStarRowToStar));
}

export async function listEvents(): Promise<Event[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackOr([], mockEvents);

  const { data, error } = await supabase
    .from("events")
    .select("*, event_stars(star_id, stars(slug))")
    .order("starts_at", { ascending: true });

  if (error || !data?.length) return fallbackOr([], mockEvents);

  return (data as EventRow[]).map((row) => {
    const sourceMeta = deriveSourceMetadata(row.source_url ?? "");
    return {
      slug: row.slug,
      title: row.title,
      type: row.type,
      status: row.status,
      city: row.city ?? "",
      venue: row.venue ?? "",
      startsAt: row.starts_at,
      endsAt: row.ends_at ?? undefined,
      starSlugs:
        row.event_stars?.map((item) => {
          const star = Array.isArray(item.stars) ? item.stars[0] : item.stars;
          return star?.slug ?? "";
        }).filter(Boolean) ?? [],
      ticketStatus: deriveTicketStatus(row.status),
      summary: row.summary ?? "",
      highlights: Object.values((row.ai_extracted as Record<string, string[] | string>) ?? {})
        .flat()
        .filter((value): value is string => typeof value === "string")
        .slice(0, 3),
      sourceLabel: sourceMeta.sourceLabel ?? row.source_url ?? "Supabase",
    };
  });
}

export async function listNews(): Promise<NewsItem[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackOr([], mockNews);

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("review_status", "published")
    .order("published_at", { ascending: false });
  if (error || !data?.length) return fallbackOr([], mockNews);

  return (data as NewsRow[]).map((row) => {
    const sourceMeta = deriveSourceMetadata(row.source_url ?? "", `${row.title}\n${row.excerpt ?? ""}\n${row.body_md ?? ""}`);
    const editorialMode = detectNewsEditorialMode(row);
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      publishedAt: row.published_at ?? row.created_at,
      category: row.category ?? "资讯",
      editorialMode,
      reviewStatus: row.review_status ?? "published",
      relatedStars: row.related_star_slugs ?? [],
      sourceUrl: row.source_url ?? undefined,
      sourceLabel: sourceMeta.sourceLabel ?? row.source_url ?? undefined,
    };
  });
}

export async function listNewsForAdmin() {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackOr([], mockNews);

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error || !data?.length) return fallbackOr([], mockNews);

  return (data as NewsRow[]).map((row) => {
    const sourceMeta = deriveSourceMetadata(row.source_url ?? "", `${row.title}\n${row.excerpt ?? ""}\n${row.body_md ?? ""}`);
    const editorialMode = detectNewsEditorialMode(row);
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      publishedAt: row.published_at ?? row.created_at,
      category: row.category ?? "资讯",
      editorialMode,
      reviewStatus: row.review_status ?? "published",
      relatedStars: row.related_star_slugs ?? [],
      sourceUrl: row.source_url ?? undefined,
      sourceLabel: sourceMeta.sourceLabel ?? row.source_url ?? undefined,
    };
  });
}

export async function listServices(): Promise<ServiceItem[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return mockServices;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return mockServices;

  return data.map((row) => ({
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    deliverables: (row.deliverables as string[]) ?? [],
    turnaround: row.turnaround as string,
  }));
}

function buildNewsDetailFromMock(slug: string, allNews: NewsItem[]) {
  const news = mockNews.find((item) => item.slug === slug);
  if (!news) return null;
  const stars = mockStars.filter((star) => news.relatedStars.includes(star.slug));
  const relatedNews = mockNews.filter(
    (item) =>
      item.slug !== slug &&
      item.relatedStars.some((starSlug) => news.relatedStars.includes(starSlug)),
  );
  return {
    news: {
      ...news,
      editorialMode: news.editorialMode ?? detectNewsEditorialMode({ body_md: news.bodyMd ?? null, slug: news.slug } as NewsRow),
      reviewStatus: (news.reviewStatus ?? "published") as "draft" | "reviewed" | "published" | "rejected",
      bodyMd:
        news.bodyMd ??
        `${news.excerpt}\n\n这是一条站内中文整理稿，当前优先用于帮助新粉快速理解活动重点。正式追行程、抢票或核对品牌官宣前，建议再结合官方账号、主办海报或票务平台信息二次确认。`,
    },
    stars,
    relatedNews,
    previousNews: findAdjacentNews(allNews, slug, -1),
    nextNews: findAdjacentNews(allNews, slug, 1),
  };
}

export async function getNewsDetail(slug: string) {
  noStore();
  const allNews = await listNews();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!allowMockFallback) return null;
    return buildNewsDetailFromMock(slug, allNews);
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("review_status", "published")
    .single();
  if (error || !data) {
    if (!allowMockFallback) return null;
    return buildNewsDetailFromMock(slug, allNews);
  }

  const row = data as NewsRow;
  const sourceMeta = deriveSourceMetadata(row.source_url ?? "", `${row.title}\n${row.excerpt ?? ""}\n${row.body_md ?? ""}`);
  const relatedStars = row.related_star_slugs ?? [];
  const { data: relatedStarRows } = relatedStars.length
    ? await supabase.from("stars").select("*").in("slug", relatedStars)
    : { data: [] as StarRow[] };
  const stars = ((relatedStarRows as StarRow[] | null) ?? [])
    .map(mapStarRowToStar)
    .sort((a, b) => relatedStars.indexOf(a.slug) - relatedStars.indexOf(b.slug));
  const relatedNews = allNews.filter(
    (item) => item.slug !== slug && item.relatedStars.some((starSlug) => relatedStars.includes(starSlug)),
  );
  return {
    news: {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      bodyMd: row.body_md ?? row.excerpt ?? "",
      publishedAt: row.published_at ?? row.created_at,
      category: row.category ?? "资讯",
      editorialMode: detectNewsEditorialMode(row),
      reviewStatus: row.review_status ?? "published",
      relatedStars,
      sourceUrl: row.source_url ?? undefined,
      sourceLabel: sourceMeta.sourceLabel ?? row.source_url ?? undefined,
    },
    stars,
    relatedNews,
    previousNews: findAdjacentNews(allNews, slug, -1),
    nextNews: findAdjacentNews(allNews, slug, 1),
  };
}

function findAdjacentNews(newsItems: NewsItem[], slug: string, direction: -1 | 1) {
  const index = newsItems.findIndex((item) => item.slug === slug);
  if (index === -1) return null;
  return newsItems[index + direction] ?? null;
}

function detectNewsEditorialMode(row: Pick<NewsRow, "slug" | "body_md">) {
  const body = row.body_md ?? "";
  if (body.includes("【中文快读】") || row.slug.includes("-daily-update") || row.slug.includes("-daily-")) {
    return "daily-auto" as const;
  }
  return "manual" as const;
}

export async function listServiceRequests(): Promise<ServiceRequestRow[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false }).limit(20);
  return (data ?? []) as ServiceRequestRow[];
}

export async function listIngestionJobs(): Promise<IngestionJobRow[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase.from("ingestion_jobs").select("*").order("created_at", { ascending: false }).limit(20);
  return (data ?? []) as IngestionJobRow[];
}

export async function getAdminOverview() {
  const [stars, events, news, requests, jobs] = await Promise.all([
    listStars(),
    listEvents(),
    listNews(),
    listServiceRequests(),
    listIngestionJobs(),
  ]);

  return {
    stars,
    events,
    news,
    requests,
    jobs,
  };
}

export async function listEventsForAdmin() {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackOr([], mockEvents);

  const { data, error } = await supabase.from("events").select("*").order("starts_at", { ascending: true }).limit(30);
  if (error || !data?.length) return fallbackOr([], mockEvents);

  return (data as EventRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    type: row.type,
    status: row.status,
    city: row.city ?? "",
    venue: row.venue ?? "",
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    starSlugs: [],
    ticketStatus: deriveTicketStatus(row.status),
    summary: row.summary ?? "",
    highlights: [],
    sourceLabel: deriveSourceMetadata(row.source_url ?? "").sourceLabel ?? row.source_url ?? "Supabase",
  }));
}

export async function getEventDetail(slug: string) {
  noStore();
  const allEvents = await listEvents();
  const allNews = await listNews();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!allowMockFallback) return null;
    const event = mockEvents.find((item) => item.slug === slug);
    if (!event) return null;
    const stars = mockStars.filter((star) => event.starSlugs.includes(star.slug));
    return {
      event,
      stars,
      relatedNews: allNews.filter((item) =>
        item.relatedStars.some((starSlug) => event.starSlugs.includes(starSlug)),
      ),
      previousEvent: findAdjacentEvent(allEvents, slug, -1),
      nextEvent: findAdjacentEvent(allEvents, slug, 1),
    };
  }

  const { data, error } = await supabase
    .from("events")
    .select("*, event_stars(stars(*))")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    if (!allowMockFallback) return null;
    const event = mockEvents.find((item) => item.slug === slug);
    if (!event) return null;
    const stars = mockStars.filter((star) => event.starSlugs.includes(star.slug));
    return {
      event,
      stars,
      relatedNews: allNews.filter((item) =>
        item.relatedStars.some((starSlug) => event.starSlugs.includes(starSlug)),
      ),
      previousEvent: findAdjacentEvent(allEvents, slug, -1),
      nextEvent: findAdjacentEvent(allEvents, slug, 1),
    };
  }

  const starItems = ((data.event_stars as Array<{ stars?: StarRow[] | StarRow | null }> | null) ?? [])
    .map((item) => (Array.isArray(item.stars) ? item.stars[0] : item.stars))
    .filter(Boolean) as StarRow[];

  const event: Event = {
    slug: data.slug,
    title: data.title,
    type: data.type,
    status: data.status,
    city: data.city ?? "",
    venue: data.venue ?? "",
    startsAt: data.starts_at,
    endsAt: data.ends_at ?? undefined,
    starSlugs: starItems.map((star) => star.slug),
    ticketStatus: deriveTicketStatus(data.status),
    summary: data.summary ?? "",
    highlights: Object.values((data.ai_extracted as Record<string, string[] | string>) ?? {})
      .flat()
      .filter((value): value is string => typeof value === "string")
      .slice(0, 4),
    sourceLabel: deriveSourceMetadata(data.source_url ?? "").sourceLabel ?? data.source_url ?? "Supabase",
  };

  const stars = starItems.map(mapStarRowToStar);

  return {
    event,
    stars,
    relatedNews: allNews.filter((item) =>
      item.relatedStars.some((starSlug) => event.starSlugs.includes(starSlug)),
    ),
    previousEvent: findAdjacentEvent(allEvents, slug, -1),
    nextEvent: findAdjacentEvent(allEvents, slug, 1),
  };
}

function findAdjacentEvent(events: Event[], slug: string, direction: -1 | 1) {
  const index = events.findIndex((item) => item.slug === slug);
  if (index === -1) return null;
  return events[index + direction] ?? null;
}

export async function getStarDetail(slug: string) {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!allowMockFallback) return null;
    const star = mockStars.find((item) => item.slug === slug);
    if (!star) return null;
    return {
      star,
      events: mockEvents.filter((event) => event.starSlugs.includes(slug)),
      news: mockNews.filter((item) => item.relatedStars.includes(slug)),
    };
  }

  const { data: starRow, error: starError } = await supabase
    .from("stars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (starError || !starRow) {
    if (!allowMockFallback) return null;
    const star = mockStars.find((item) => item.slug === slug);
    if (!star) return null;
    return {
      star,
      events: mockEvents.filter((event) => event.starSlugs.includes(slug)),
      news: mockNews.filter((item) => item.relatedStars.includes(slug)),
    };
  }

  const star: Star = {
    ...(mockStars.find((item) => item.slug === slug) ?? {}),
    ...mapStarRowToStar(starRow as StarRow),
  };

  const { data: eventLinks } = await supabase
    .from("event_stars")
    .select("events(*)")
    .eq("star_id", starRow.id);

  const events = (((eventLinks ?? []) as Array<{ events?: EventRow[] | EventRow | null }>).map((item) =>
    Array.isArray(item.events) ? item.events[0] : item.events,
  ).filter(Boolean) as EventRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    type: row.type,
    status: row.status,
    city: row.city ?? "",
    venue: row.venue ?? "",
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    starSlugs: [slug],
    ticketStatus: deriveTicketStatus(row.status),
    summary: row.summary ?? "",
    highlights: [],
    sourceLabel: deriveSourceMetadata(row.source_url ?? "").sourceLabel ?? row.source_url ?? "Supabase",
  }));

  const { data: newsRows } = await supabase
    .from("news_posts")
    .select("*")
    .eq("review_status", "published")
    .contains("related_star_slugs", [slug])
    .order("published_at", { ascending: false });

  const news = (newsRows ?? []).map((row) => {
    const sourceMeta = deriveSourceMetadata(row.source_url ?? "", `${row.title}\n${row.excerpt ?? ""}\n${row.body_md ?? ""}`);
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      publishedAt: row.published_at ?? row.created_at,
      category: row.category ?? "资讯",
      relatedStars: row.related_star_slugs ?? [],
      sourceUrl: row.source_url ?? undefined,
      sourceLabel: sourceMeta.sourceLabel ?? row.source_url ?? undefined,
    };
  });

  return { star, events, news };
}

function deriveTicketStatus(status: Event["status"]): string {
  const map: Record<Event["status"], string> = {
    scheduled: "待开票",
    rumor: "消息待确认",
    selling: "开票中",
    done: "活动已结束",
  };
  return map[status] ?? status;
}

function prioritizeStars(items: Star[]) {
  return [...items].sort((a, b) => {
    const aIndex = CHINA_PRIORITY_STAR_SLUGS.indexOf(a.slug);
    const bIndex = CHINA_PRIORITY_STAR_SLUGS.indexOf(b.slug);
    const aRank = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const bRank = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    return aRank - bRank;
  });
}

export function getStaticStarParams() {
  return mockStars.map((s) => ({ slug: s.slug }));
}

export function getStaticEventParams() {
  return mockEvents.map((e) => ({ slug: e.slug }));
}

export function getStaticNewsParams() {
  return mockNews.map((n) => ({ slug: n.slug }));
}
