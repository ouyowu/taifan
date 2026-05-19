import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getStarDetail } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";

const TYPE_LABEL: Record<string, string> = {
  fanmeeting: "见面会",
  concert: "演唱会",
  brand: "品牌活动",
  broadcast: "直播",
  variety: "综艺",
  event: "活动",
};

export default async function StarProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getStarDetail(slug);

  if (!detail) notFound();
  const { star, events: relatedEvents, news: relatedNews } = detail;
  const mustReadNews = relatedNews.slice(0, 3);
  const latestNews = relatedNews[0];
  const nextEvent = relatedEvents[0];
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: star.nameEn,
    alternateName: star.nameCn,
    description: star.bio,
    homeLocation: star.baseCity,
    affiliation: { "@type": "Organization", name: star.agency },
    url: `${siteConfig.siteUrl}/stars/${star.slug}`,
    image: star.coverUrl || star.avatarUrl,
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }} />

      {/* ── HERO BANNER ── */}
      <section className="relative w-full overflow-hidden bg-[#1c1c1e]" style={{ height: "clamp(420px, 68vh, 760px)" }}>
        {star.coverUrl ? (
          <Image
            src={star.coverUrl}
            alt={star.nameEn}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: getImageObjectPosition(star.coverUrl, "hero") }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 page-shell mx-auto max-w-[1440px] pb-10 md:pb-14">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f07030] px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  {star.agency}
                </span>
                {star.fandomName ? (
                  <span className="rounded-full border border-white/30 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
                    {star.fandomName}
                  </span>
                ) : null}
              </div>
              <h1 className="font-en font-black leading-[0.92] tracking-[-0.04em] text-white"
                  style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                {star.nameEn}
              </h1>
              <p className="font-cn mt-3 text-[20px] font-bold text-white/80">{star.nameCn}</p>
            </div>
            <div className="flex items-center gap-5 rounded-[18px] bg-white/10 px-6 py-4 backdrop-blur-md w-fit">
              <div className="text-center">
                <p className="font-en text-[32px] font-black text-white leading-none">{relatedEvents.length}</p>
                <p className="font-cn text-[11px] text-white/60 mt-1">活动</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="font-en text-[32px] font-black text-white leading-none">{relatedNews.length}</p>
                <p className="font-cn text-[11px] text-white/60 mt-1">动态</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK TAGS BAR ── */}
      <section className="border-b border-[#e8e8e8] bg-white">
        <div className="page-shell mx-auto max-w-[1440px] py-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-[#e8e8e8] bg-[#fafafa] px-4 py-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-[#aeaeb2] mr-2">驻地</span>
              <span className="font-cn text-[13px] font-bold text-[#1c1c1e]">{star.baseCity}</span>
            </div>
            {star.spotlight.slice(0, 2).map((s) => (
              <div key={s} className="rounded-full bg-[#fff4ee] px-4 py-2">
                <span className="font-cn text-[13px] font-bold text-[#f07030]">{s}</span>
              </div>
            ))}
            {star.tags.slice(0, 4).map((tag) => (
              <div key={tag} className="rounded-full border border-[#e8e8e8] bg-[#fafafa] px-4 py-2">
                <span className="font-cn text-[13px] text-[#6e6e73]">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ── */}
      <section className="page-shell mx-auto max-w-[1440px] py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-12">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Bio card */}
            <div className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:p-8">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">About this star</p>
              <p className="font-cn mt-4 text-[15px] leading-[1.9] text-[#6e6e73] md:text-[16px]">{star.bio}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[14px] bg-[#fafafa] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#aeaeb2]">Use this name</p>
                  <p className="font-en mt-2 text-[14px] font-bold text-[#1c1c1e]">{star.nameEn}</p>
                </div>
                <div className="rounded-[14px] bg-[#fff4ee] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#f07030]">Agency</p>
                  <p className="font-cn mt-2 text-[14px] font-bold text-[#1c1c1e]">{star.agency}</p>
                </div>
                <div className="rounded-[14px] bg-[#fafafa] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#aeaeb2]">Focus</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{star.spotlight.slice(0, 1).join("")}</p>
                </div>
              </div>
            </div>

            {/* Photo grid — tall poster left, stacked right */}
            {(star.coverUrl || star.avatarUrl) ? (
              <div className="grid grid-cols-[1.65fr_1fr] gap-3 md:gap-4">
                {/* Tall poster */}
                <div className="relative overflow-hidden rounded-[22px] bg-[#fff4ee]" style={{ aspectRatio: "3/4" }}>
                  {star.coverUrl ? (
                    <Image src={star.coverUrl} alt={star.nameEn} fill className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(star.coverUrl, "poster") }} />
                  ) : null}
                </div>
                {/* Right column stacked */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="relative overflow-hidden rounded-[22px] bg-[#f8f0ff]" style={{ flex: "1 1 0" }}>
                    {star.avatarUrl ? (
                      <Image src={star.avatarUrl} alt={star.nameEn} fill className="object-cover"
                        style={{ objectPosition: getImageObjectPosition(star.avatarUrl, "avatar") }} />
                    ) : (star.coverUrl ? (
                      <Image src={star.coverUrl} alt={star.nameEn} fill className="object-cover"
                        style={{ objectPosition: "center 20%" }} />
                    ) : null)}
                  </div>
                  <div className="rounded-[22px] bg-[#1c1c1e] p-5 flex flex-col justify-end" style={{ minHeight: "110px" }}>
                    <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-white/40 mb-2">Follow tracks</p>
                    <p className="font-cn text-[13px] font-bold text-white leading-[1.5]">
                      {star.spotlight.slice(0, 2).join(" / ")}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Must read */}
            {mustReadNews.length ? (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-[2px] w-5 rounded bg-[#f07030]" />
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Editor&apos;s picks</p>
                </div>
                <h2 className="font-sans text-[28px] font-extrabold tracking-[-0.02em] text-[#1c1c1e] mb-5 md:text-[34px]">Must read 3.</h2>
                <div className="space-y-3">
                  {mustReadNews.map((item, index) => (
                    <Link key={item.slug} href={`/news/${item.slug}`}
                      className="flex gap-4 rounded-[20px] border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(240,112,48,0.15)]">
                      <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[14px] bg-[#f07030] flex items-center justify-center">
                        <span className="font-en text-[22px] font-black text-white">0{index + 1}</span>
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="font-cn text-[14px] font-bold leading-[1.65] text-[#1c1c1e]">{item.excerpt}</p>
                        <p className="font-en mt-2 text-[10px] text-[#aeaeb2] truncate">{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Events */}
            {relatedEvents.length ? (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-[2px] w-5 rounded bg-[#f07030]" />
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Schedule</p>
                </div>
                <h2 className="font-sans text-[28px] font-extrabold tracking-[-0.02em] text-[#1c1c1e] mb-5 md:text-[34px]">近期活动</h2>
                <div className="space-y-3">
                  {relatedEvents.map((event) => (
                    <Link key={event.slug} href={`/events/${event.slug}`}
                      className="flex items-center gap-4 rounded-[20px] border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5">
                      <div className="w-[56px] shrink-0 rounded-[12px] bg-[#fff4ee] py-3 text-center">
                        <p className="font-en text-[24px] font-black leading-none text-[#f07030]">
                          {format(new Date(event.startsAt), "dd")}
                        </p>
                        <p className="font-en text-[9px] uppercase tracking-[0.1em] text-[#f07030] mt-1">
                          {format(new Date(event.startsAt), "MMM", { locale: zhCN })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cn text-[14px] font-bold text-[#1c1c1e] leading-[1.5]">{event.summary}</p>
                        <p className="font-en mt-1 text-[10px] text-[#aeaeb2] truncate">{event.title}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="font-cn rounded-full bg-[#fafafa] border border-[#e8e8e8] px-3 py-1 text-[11px] text-[#6e6e73]">{event.city}</span>
                          <span className="font-cn rounded-full bg-[#fff4ee] px-3 py-1 text-[11px] text-[#f07030]">
                            {TYPE_LABEL[event.type] ?? event.type}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* News list */}
            {relatedNews.length ? (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-[2px] w-5 rounded bg-[#f07030]" />
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Latest posts</p>
                </div>
                <h2 className="font-sans text-[28px] font-extrabold tracking-[-0.02em] text-[#1c1c1e] mb-5 md:text-[34px]">近期动态</h2>
                <div className="space-y-3">
                  {relatedNews.map((item) => (
                    <Link key={item.slug} href={`/news/${item.slug}`}
                      className="block rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5">
                      <p className="font-cn text-[14px] font-bold leading-[1.65] text-[#1c1c1e]">{item.excerpt}</p>
                      <p className="font-en mt-2 text-[10px] text-[#aeaeb2]">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT SIDEBAR — sticky */}
          <div className="space-y-4 lg:sticky lg:top-[88px]">
            <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">Read this first</p>
              <h3 className="font-sans mt-2 text-[20px] font-extrabold tracking-[-0.02em] text-[#1c1c1e]">Latest update.</h3>
              {latestNews ? (
                <Link href={`/news/${latestNews.slug}`} className="mt-4 block rounded-[14px] bg-[#fafafa] p-4 transition hover:bg-[#fff4ee]">
                  <p className="font-cn text-[13px] font-bold leading-[1.7] text-[#1c1c1e]">{latestNews.excerpt}</p>
                  <p className="font-en mt-2 text-[10px] text-[#aeaeb2]">{latestNews.title}</p>
                </Link>
              ) : (
                <div className="mt-4 rounded-[14px] bg-[#fafafa] p-4">
                  <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">暂无最新动态。</p>
                </div>
              )}
            </div>

            <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">Catch this next</p>
              <h3 className="font-sans mt-2 text-[20px] font-extrabold tracking-[-0.02em] text-[#1c1c1e]">Next event.</h3>
              {nextEvent ? (
                <Link href={`/events/${nextEvent.slug}`} className="mt-4 block rounded-[14px] bg-[#fafafa] p-4 transition hover:bg-[#fff4ee]">
                  <p className="font-cn text-[13px] font-bold leading-[1.7] text-[#1c1c1e]">{nextEvent.summary}</p>
                  <p className="font-en mt-2 text-[10px] text-[#aeaeb2]">{nextEvent.title}</p>
                </Link>
              ) : (
                <div className="mt-4 rounded-[14px] bg-[#fafafa] p-4">
                  <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">暂无近期活动。</p>
                </div>
              )}
            </div>

            <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">Search with these names</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[star.nameEn, star.nameCn, ...(star.spotlight ?? []).slice(0, 1)].filter(Boolean).map((name) => (
                  <span key={name} className="rounded-full border border-[#e8e8e8] px-3 py-1.5 font-cn text-[12px] text-[#1c1c1e]">{name}</span>
                ))}
              </div>
            </div>

            {star.tags?.length ? (
              <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">What to track now</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {star.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e8e8e8] bg-[#fafafa] px-3 py-1.5 font-cn text-[12px] text-[#6e6e73]">{tag}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getStarDetail(slug);
  if (!detail) return buildPageMetadata({ title: "明星资料", description: "查看泰国明星的中文资料", path: `/stars/${slug}` });
  const { star, events, news } = detail;
  return buildPageMetadata({
    title: `${star.nameEn} | 明星资料`,
    description: `${star.nameCn} / ${star.nameEn} 的中文追星入口，当前聚合活动 ${events.length} 条、动态 ${news.length} 条。`,
    path: `/stars/${star.slug}`,
    image: star.coverUrl || star.avatarUrl,
  });
}
