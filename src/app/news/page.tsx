import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { listNews, listStars } from "@/lib/data";
import { getContentTagTheme } from "@/lib/content-tag-theme";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";
import { primarySourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "明星动态",
  description: "用中文快读追踪泰国艺人官宣、品牌活动、直播和最新动态，保留艺人名、品牌名和官方标题，方便后续搜索与核对。",
  path: "/news",
});

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ source?: string; category?: string }>;
}) {
  await connection();
  const [newsItems, stars] = await Promise.all([listNews(), listStars()]);
  const params = (await searchParams) ?? {};
  const sourceFilter = params.source === "official" ? "official" : "all";
  const categories = Array.from(new Set(newsItems.map((item) => item.category))).filter(Boolean);
  const categoryFilter = categories.includes(params.category ?? "") ? (params.category as string) : "all";
  const filteredBySource = sourceFilter === "official" ? newsItems.filter((item) => Boolean(item.sourceLabel)) : newsItems;
  const visibleNews = categoryFilter === "all" ? filteredBySource : filteredBySource.filter((item) => item.category === categoryFilter);
  const showEmptyState = visibleNews.length === 0;
  const leadStory = visibleNews[0];
  const starterPicks = stars
    .slice(0, 3)
    .map((star) => ({
      star,
      item: visibleNews.find((news) => news.relatedStars.includes(star.slug)) ?? newsItems.find((news) => news.relatedStars.includes(star.slug)),
    }))
    .filter((entry): entry is { star: (typeof stars)[number]; item: (typeof newsItems)[number] } => Boolean(entry.item));
  const groupedNews = groupNewsByDate(visibleNews.slice(1));

  return (
    <SiteShell>
      <section className="page-shell mx-auto max-w-[1440px] py-10 md:py-16">
        <div className="mb-7 md:mb-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Latest News</p>
          <h1 className="lattice-title mt-3 text-[38px] leading-[0.98] md:mt-4 md:text-[76px]">Follow every update.</h1>
          <p className="font-cn mt-3 text-[22px] font-bold text-[#111111]">明星动态</p>
          <p className="font-cn mt-3 max-w-[720px] text-[13px] leading-[1.8] text-[#6d7b7e] md:mt-4 md:text-[15px] md:leading-[1.85]">
            把分散在官宣、品牌海报、预约页和站外内容里的信息整理成中文快读；艺人名、品牌名和官方标题继续保留原文，方便你后续核对和搜索。
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-[28px] border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:mb-8 md:grid-cols-[1.1fr_0.9fr] md:gap-4 md:rounded-[34px] md:p-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Daily News Desk</p>
            <h2 className="lattice-title mt-3 text-[28px] md:text-[48px]">A newsroom that keeps growing.</h2>
            <p className="font-cn mt-3 max-w-[560px] text-[13px] leading-[1.8] text-[#6d7b7e] md:mt-4 md:text-[14px] md:leading-[1.9]">
              这里会持续累积新的官宣、品牌活动、直播与票务信息。每一条都用中文整理，但保留原始标题、艺人名和品牌名，让搜索引擎和粉丝都能更容易找到。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="lattice-soft-card rounded-[22px] bg-[#fff4ee] p-4 md:rounded-[26px]">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Updated</p>
              <p className="lattice-title mt-3 text-[30px]">
                {visibleNews.length ? format(new Date(visibleNews[0].publishedAt), "MM.dd") : "--.--"}
              </p>
              <p className="font-cn mt-2 text-[12px] text-[#6d7b7e]">最近一条动态更新时间</p>
            </div>
            <div className="lattice-soft-card rounded-[22px] bg-[#f0f8ff] p-4 md:rounded-[26px]">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4a90d9]">Stories</p>
              <p className="lattice-title mt-3 text-[30px]">{visibleNews.length}</p>
              <p className="font-cn mt-2 text-[12px] text-[#6d7b7e]">当前筛选下可读的动态条目</p>
            </div>
            <div className="lattice-soft-card rounded-[22px] bg-[#f5fff0] p-4 md:rounded-[26px]">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4caf78]">Sources</p>
              <p className="lattice-title mt-3 text-[30px]">
                {new Set(visibleNews.map((item) => item.sourceLabel).filter(Boolean)).size}
              </p>
              <p className="font-cn mt-2 text-[12px] text-[#6d7b7e]">当前已接入的来源账号数</p>
            </div>
          </div>
        </div>

        <section className="mb-8 rounded-[28px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:mb-10 md:rounded-[36px] md:p-8">
          <div className="mb-5 md:mb-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Source feed</p>
            <h2 className="lattice-title mt-3 text-[28px] md:text-[42px]">Seven company updates, all in one place.</h2>
            <p className="font-cn mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#6d7b7e] md:text-[14px] md:leading-[1.85]">
              七家主公司已经各自接了真实公开入口。这里直接把它们最近一条摆出来，你可以先看公司、logo 和标题，再决定要不要继续读站内快读。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {primarySourceShowcaseEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={entry.url}
                className="rounded-[24px] border border-[#f1ece6] bg-[#fafafa] p-4 transition hover:-translate-y-0.5 hover:bg-white md:rounded-[28px] md:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-[14px] bg-white">
                    <Image src={entry.logoPath} alt={entry.company} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <p className="font-en text-[14px] font-black tracking-[-0.03em] text-[#1f1a17]">{entry.company}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#6b6057]">{entry.meta}</p>
                  </div>
                </div>
                <p className="font-cn mt-4 text-[14px] font-bold leading-[1.8] text-[#111111]">{entry.title}</p>
                <p className="font-cn mt-3 line-clamp-3 text-[12px] leading-[1.8] text-[#6d7b7e]">{entry.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mb-7 flex flex-wrap gap-2 md:mb-8">
          <Link
            href="/news"
            className={`font-cn rounded-full px-4 py-2 text-[13px] ${sourceFilter === "all" ? "bg-[#1c1c1e] text-white" : "bg-[#f4f1ec] text-[#6d7b7e]"}`}
          >
            全部
          </Link>
          <Link
            href={`/news?source=official${categoryFilter !== "all" ? `&category=${encodeURIComponent(categoryFilter)}` : ""}`}
            className={`font-cn rounded-full px-4 py-2 text-[13px] ${sourceFilter === "official" ? "bg-[#fff4ee] text-[#f07030]" : "bg-[#f4f1ec] text-[#6d7b7e]"}`}
          >
            官方来源
          </Link>
          {categories.map((category) => {
            const href =
              categoryFilter === category
                ? `/news${sourceFilter === "official" ? "?source=official" : ""}`
                : `/news?${new URLSearchParams({
                    ...(sourceFilter === "official" ? { source: "official" } : {}),
                    category,
                  }).toString()}`;

            return (
              <Link
                key={category}
                href={href}
                className={`font-cn rounded-full px-4 py-2 text-[13px] ${categoryFilter === category ? "bg-[#1c1c1e] text-white" : "bg-[#f4f1ec] text-[#6d7b7e]"}`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        {showEmptyState ? (
          <section className="mb-8 rounded-[28px] border border-[#f1d8cf] bg-[#fff7f3] p-5 shadow-[0_18px_45px_rgba(16,35,39,0.04)] md:mb-10 md:rounded-[34px] md:p-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#c1725a]">Newsroom check</p>
            <h2 className="lattice-title mt-3 text-[28px] md:text-[40px]">No published news yet.</h2>
            <p className="font-cn mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#7a6f69] md:text-[14px] md:leading-[1.85]">
              当前还没有可公开展示的动态内容。上线前请先检查 Supabase 数据、审核发布状态，或者先在后台生成并发布 2 到 5 条测试快读。
            </p>
          </section>
        ) : null}

        {leadStory ? (
          <section className="mb-8 grid gap-4 rounded-[28px] border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] lg:grid-cols-[1.05fr_0.95fr] md:mb-10 md:gap-5 md:rounded-[36px] md:p-5">
            <div className="relative min-h-[300px] overflow-hidden rounded-[24px] md:min-h-[360px] md:rounded-[30px]">
              {(() => {
                const relatedStar = stars.find((star) => leadStory.relatedStars.includes(star.slug));
                return relatedStar?.coverUrl ? (
                  <Image
                    src={relatedStar.coverUrl}
                    alt={relatedStar.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(relatedStar.coverUrl, "hero") }}
                  />
                ) : null;
              })()}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,18,12,0.02)_0%,rgba(23,18,12,0.68)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/70">Lead Story</p>
                  <p className="font-en mt-2 max-w-[520px] text-[22px] font-black leading-[1] tracking-[-0.04em] text-white md:mt-3 md:text-[38px]">
                  {leadStory.title}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-[24px] bg-[linear-gradient(135deg,#fff4ee_0%,#f8f0ff_100%)] p-5 md:rounded-[30px] md:p-6">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className={`font-cn rounded-full px-3 py-1 text-[11px] ${getContentTagTheme(leadStory.category).pill}`}>
                    {leadStory.category}
                  </span>
                  {leadStory.editorialMode === "daily-auto" ? (
                    <span className="font-cn rounded-full bg-[#1f1a17] px-3 py-1 text-[11px] text-white">
                      今日自动整理
                    </span>
                  ) : null}
                  <span className="font-cn rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#6e6e73]">
                    {leadStory.sourceLabel ?? "站内整理来源"}
                  </span>
                </div>
                <h2 className="font-cn text-[20px] font-bold leading-[1.45] text-[#1f1a17] md:text-[22px]">{leadStory.excerpt}</h2>
                <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6d7b7e] md:mt-4 md:text-[14px] md:leading-[1.9]">
                  这里优先展示最近一条最值得先看的更新，帮助你先抓住当天的重点，再决定要不要继续追票务、围观、品牌活动或直播安排。
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 md:mt-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4a90d9]">Published</p>
                  <p className="font-en mt-2 text-[14px] font-bold text-[#1c1c1e]">
                    {format(new Date(leadStory.publishedAt), "yyyy.MM.dd HH:mm", { locale: zhCN })}
                  </p>
                </div>
                <Link href={`/news/${leadStory.slug}`} className="font-cn rounded-full bg-[#1c1c1e] px-4 py-2.5 text-[13px] text-white md:px-5 md:py-3">
                  进入全文
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {starterPicks.length ? (
          <section className="mb-8 rounded-[28px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:mb-10 md:rounded-[36px] md:p-8">
            <div className="mb-5 md:mb-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Starter picks</p>
              <h2 className="lattice-title mt-3 text-[28px] md:text-[42px]">Read these first.</h2>
              <p className="font-cn mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#6d7b7e] md:text-[14px] md:leading-[1.85]">
                如果你不是来从头翻归档，而是想先快速进入状态，就先看这几条。它们通常最能说明头部艺人最近为什么值得追、该先补哪条内容线。
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-3 md:gap-4">
              {starterPicks.map(({ star, item }, index) => {
                const theme = getContentTagTheme(item.category);
                return (
                  <Link
                    key={`${star.slug}-starter-pick`}
                    href={`/news/${item.slug}`}
                    className="rounded-[24px] p-4 shadow-[0_12px_30px_rgba(79,61,32,0.06)] transition hover:-translate-y-0.5 md:rounded-[30px] md:p-5"
                    style={{ backgroundColor: theme.soft }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full border border-white/70 bg-white">
                        {star.avatarUrl ? (
                          <Image
                            src={star.avatarUrl}
                            alt={star.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(star.avatarUrl, "avatar") }}
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-en text-[18px] font-black tracking-[-0.03em] text-[#1f1a17]">{star.nameEn}</p>
                        <p className="font-cn mt-1 text-[11px] text-[#6b6057]">新粉先看 0{index + 1}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`font-cn rounded-full px-3 py-1 text-[11px] ${theme.pill}`}>{item.category}</span>
                      <span className="font-cn rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#6d7b7e]">
                        {item.sourceLabel ?? "站内整理来源"}
                      </span>
                    </div>
                    <p className="font-cn mt-4 text-[14px] font-bold leading-[1.8] text-[#111111]">{item.excerpt}</p>
                    <p className="font-en mt-3 text-[10px] text-[#6b6057]">{item.title}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {!showEmptyState ? (
        <section className="mb-10">
          <div className="mb-5 md:mb-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Poster wall</p>
            <h2 className="lattice-title mt-3 text-[28px] md:text-[42px]">See the faces behind the feed.</h2>
            <p className="font-cn mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#6d7b7e] md:text-[14px] md:leading-[1.85]">
              动态中心不只是文字列表。先看到艺人和海报，再决定要不要点进全文，会更像粉丝真正刷站的方式。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 md:gap-4">
            {visibleNews.slice(0, 4).map((item) => {
              const relatedStar = stars.find((star) => item.relatedStars.includes(star.slug));
              const theme = getContentTagTheme(item.category);
              return (
                <Link key={`${item.slug}-poster-grid`} href={`/news/${item.slug}`} className="lattice-card overflow-hidden p-3 transition hover:-translate-y-0.5">
                  <div className="relative min-h-[220px] overflow-hidden rounded-[20px] md:min-h-[260px] md:rounded-[24px]" style={{ backgroundColor: theme.soft }}>
                    {relatedStar?.coverUrl ? (
                      <Image
                        src={relatedStar.coverUrl}
                        alt={relatedStar.nameEn}
                        fill
                        className="object-cover"
                        style={{ objectPosition: getImageObjectPosition(relatedStar.coverUrl, "poster") }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.02)_0%,rgba(16,35,39,0.62)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                        <p className="font-en text-[18px] font-black tracking-[-0.03em] text-white md:text-[20px]">{relatedStar?.nameEn ?? "Thai entertainment"}</p>
                      <p className="font-cn mt-1 text-[12px] text-white/82">{item.category}</p>
                    </div>
                  </div>
                  <div className="p-2 pt-4">
                    <p className="font-cn text-[13px] leading-[1.7] text-[#5f7074]">{item.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        ) : null}

        <div className="space-y-8 md:space-y-10">
          {groupedNews.map(([dateLabel, items]) => (
            <section key={dateLabel}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#a67d2c]">News Archive</p>
                  <h2 className="font-en mt-2 text-[24px] font-black tracking-[-0.04em] text-[#1f1a17] md:text-[34px]">{dateLabel}</h2>
                </div>
                <p className="font-cn text-[12px] text-[#8a7c6c]">{items.length} 条更新</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3 md:gap-5">
                {items.map((item) => {
                  const relatedStar = stars.find((star) => item.relatedStars.includes(star.slug));
                  const theme = getContentTagTheme(item.category);
                  return (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="overflow-hidden rounded-[26px] border border-[#e8e8e8] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5 md:rounded-[34px]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {relatedStar?.coverUrl ? (
                          <Image
                            src={relatedStar.coverUrl}
                            alt={relatedStar.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(relatedStar.coverUrl, "wide") }}
                          />
                        ) : null}
                        <div
                          className="absolute left-4 top-4 h-3 w-3 rounded-full"
                          style={{ backgroundColor: theme.soft }}
                        />
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`font-cn rounded-full px-3 py-1 text-[11px] ${theme.pill}`}>
                            {item.category}
                          </span>
                          {item.editorialMode === "daily-auto" ? (
                            <span className="font-cn rounded-full bg-[#1f1a17] px-3 py-1 text-[11px] text-white">
                              今日自动整理
                            </span>
                          ) : null}
                          <span className="font-cn rounded-full bg-[#f4f1ec] px-3 py-1 text-[11px] text-[#6d7b7e]">
                            {item.sourceLabel ?? "站内整理来源"}
                          </span>
                        </div>
                        <p className="font-cn text-[16px] font-semibold leading-[1.55] text-[#1c1c1e]">{item.excerpt}</p>
                        <p className="font-en mt-3 text-[11px] text-[#6d7b7e]">{item.title}</p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="font-en text-[11px] font-semibold text-[#1c1c1e]">{relatedStar?.nameEn ?? "Thai entertainment"}</p>
                          <span className="font-sans text-[10px] text-[#99a4a8]">
                            {format(new Date(item.publishedAt), "M月d日 HH:mm", { locale: zhCN })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

function groupNewsByDate(newsItems: Awaited<ReturnType<typeof listNews>>) {
  const grouped = new Map<string, typeof newsItems>();

  newsItems.forEach((item) => {
    const label = format(new Date(item.publishedAt), "yyyy年M月d日", { locale: zhCN });
    const existing = grouped.get(label) ?? [];
    existing.push(item);
    grouped.set(label, existing);
  });

  return Array.from(grouped.entries());
}
