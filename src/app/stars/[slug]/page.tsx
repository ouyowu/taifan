import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarRange, FileText, ListTree, MapPin, Radio, Search, Sparkles, Tags, UserRound } from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { EVENT_TYPE_LABELS, siteConfig } from "@/lib/constants";
import { getStarDetail, getStaticStarParams } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getStaticStarParams();
}

export default async function StarProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getStarDetail(slug);

  if (!detail) notFound();

  const { star, events: relatedEvents, news: relatedNews } = detail;
  const latestNews = relatedNews[0];
  const nextEvent = relatedEvents[0];
  const mustReadNews = relatedNews.slice(0, 3);
  const infoRows = [
    { label: "英文名", value: star.nameEn },
    { label: "中文名", value: star.nameCn },
    { label: "所属公司", value: star.agency },
    { label: "常驻城市", value: star.baseCity },
    { label: "粉圈称呼", value: star.fandomName || "站内暂未补充" },
    { label: "当前主线", value: star.spotlight.slice(0, 2).join(" / ") || "站内整理中" },
  ];
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: star.nameEn,
    alternateName: star.nameCn,
    description: star.bio,
    homeLocation: star.baseCity,
    affiliation: { "@type": "Organization", name: star.agency },
    url: `${siteConfig.siteUrl}/stars/${star.slug}`,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
      />

      <section className="page-shell mx-auto max-w-[1180px] py-10 md:py-14">
        <div className="grid gap-8 border-b border-[#ece7df] pb-8 md:grid-cols-[1.08fr_0.92fr] md:gap-12 md:pb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-icon-badge">
                <UserRound size={14} />
              </span>
              <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                Artist profile
              </span>
            </div>
            <h1 className="mt-4 font-sans text-[36px] font-black leading-[0.95] tracking-[-0.04em] text-[#111111] md:text-[68px]">
              {star.nameEn}
            </h1>
            <p className="font-cn mt-3 text-[18px] font-bold text-[#6e6e73] md:text-[22px]">
              {star.nameCn}
            </p>
            <p className="font-cn mt-5 max-w-[720px] text-[15px] leading-[1.95] text-[#3c3c43]">
              {star.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="ui-chip">{star.agency}</span>
              <span className="ui-chip">{star.baseCity}</span>
              {star.fandomName ? <span className="ui-chip">{star.fandomName}</span> : null}
              {star.spotlight.slice(0, 3).map((item) => (
                <span key={item} className="ui-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                At a glance
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                    Updates
                  </p>
                  <p className="mt-2 font-en text-[24px] font-black text-[#111111]">
                    {relatedNews.length}
                  </p>
                </div>
                <div className="rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                    Events
                  </p>
                  <p className="mt-2 font-en text-[24px] font-black text-[#111111]">
                    {relatedEvents.length}
                  </p>
                </div>
                <div className="rounded-[16px] bg-[#fff4ee] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">
                    Base
                  </p>
                  <p className="mt-2 font-cn text-[15px] font-bold text-[#111111]">
                    {star.baseCity}
                  </p>
                </div>
              </div>
            </div>
            <div className="editorial-inline-note">
              <Sparkles size={14} />
              <span>先看最近动态和下一场活动，再决定是否继续补完整时间线。</span>
            </div>
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <ListTree size={14} />
                </span>
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                  Page outline
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <a href="#profile" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>人物档案</span>
                  <span className="font-en text-[11px] text-[#a56a44]">01</span>
                </a>
                <a href="#must-read" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>必看 3 条</span>
                  <span className="font-en text-[11px] text-[#a56a44]">02</span>
                </a>
                <a href="#schedule" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>近期活动</span>
                  <span className="font-en text-[11px] text-[#a56a44]">03</span>
                </a>
                <a href="#latest-posts" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>最新动态</span>
                  <span className="font-en text-[11px] text-[#a56a44]">04</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="space-y-8">
            <section id="profile">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <FileText size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  Profile dossier
                </p>
              </div>
              <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.03em] text-[#111111] md:text-[36px]">
                人物档案
              </h2>
              <div className="mt-5 overflow-hidden rounded-[22px] border border-[#ece7df] bg-white">
                {infoRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={`grid gap-2 px-5 py-4 md:grid-cols-[120px_1fr] md:gap-4 ${index !== infoRows.length - 1 ? "border-b border-[#f0ebe5]" : ""}`}
                  >
                    <p className="font-cn text-[12px] font-bold text-[#a56a44]">{row.label}</p>
                    <p className="font-cn text-[14px] leading-[1.8] text-[#3c3c43]">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] bg-[#faf7f3] p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Quick bio</p>
                  <p className="mt-3 font-cn text-[14px] leading-[1.9] text-[#3c3c43]">{star.bio}</p>
                </div>
                <div className="rounded-[20px] bg-[#fff4ee] p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Editorial use</p>
                  <p className="mt-3 font-cn text-[14px] leading-[1.9] text-[#3c3c43]">
                    这一页适合先判断这位艺人属于哪条追踪线，再回到活动和动态页去补当天更新。
                  </p>
                </div>
              </div>
            </section>

            {star.profileFacts?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <Tags size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Detailed notes
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {star.profileFacts.map((fact) => (
                    <div
                      key={fact}
                      className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-4"
                    >
                      <p className="font-cn text-[14px] leading-[1.8] text-[#3c3c43]">{fact}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {star.profileNotes?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <FileText size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Archive notes
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {star.profileNotes.map((note, index) => (
                    <div key={note} className="grid gap-3 rounded-[22px] border border-[#ece7df] bg-white p-5 md:grid-cols-[48px_1fr]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#faf7f3] font-en text-[14px] font-black text-[#a56a44]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="font-cn text-[14px] leading-[1.9] text-[#3c3c43]">{note}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {star.tags?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <Tags size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    What to track now
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {star.tags.map((tag) => (
                    <span key={tag} className="ui-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {star.followTracks?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <Radio size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Follow lines
                  </p>
                </div>
                <div className="mt-4 overflow-hidden rounded-[22px] border border-[#ece7df] bg-white">
                  {star.followTracks.map((track, index) => (
                    <div
                      key={track}
                      className={`grid gap-3 px-5 py-4 md:grid-cols-[40px_1fr] ${index !== star.followTracks!.length - 1 ? "border-b border-[#f0ebe5]" : ""}`}
                    >
                      <p className="font-en text-[12px] font-black text-[#f07030]">{String(index + 1).padStart(2, "0")}</p>
                      <p className="font-cn text-[14px] leading-[1.85] text-[#3c3c43]">{track}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {star.milestones?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <CalendarRange size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Timeline
                  </p>
                </div>
                <div className="mt-4 space-y-3 border-l-2 border-[#f0d6c7] pl-4">
                  {star.milestones.map((milestone, index) => (
                    <div key={milestone} className="relative rounded-[18px] bg-[#faf7f3] p-4">
                      <span className="absolute -left-[25px] top-5 h-3 w-3 rounded-full bg-[#f07030]" />
                      <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                        Milestone {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-2 font-cn text-[14px] leading-[1.85] text-[#3c3c43]">{milestone}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {mustReadNews.length ? (
              <section id="must-read">
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <Radio size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Editor&apos;s picks
                  </p>
                </div>
                <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.03em] text-[#111111] md:text-[36px]">
                  Must read 3
                </h2>
                <div className="mt-5 space-y-3">
                  {mustReadNews.map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-4 rounded-[22px] border border-[#ece7df] bg-white p-5 transition hover:-translate-y-0.5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff4ee] font-en text-[16px] font-black text-[#f07030]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-cn text-[14px] font-bold leading-[1.8] text-[#111111]">
                          {item.excerpt}
                        </p>
                        <p className="mt-2 font-en text-[11px] text-[#6e6e73]">{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedEvents.length ? (
              <section id="schedule">
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <CalendarRange size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Upcoming schedule
                  </p>
                </div>
                <div className="mt-5 space-y-3">
                  {relatedEvents.map((event) => (
                    <Link
                      key={event.slug}
                      href={`/events/${event.slug}`}
                      className="grid gap-3 rounded-[22px] border border-[#ece7df] bg-white p-5 transition hover:-translate-y-0.5 md:grid-cols-[92px_1fr]"
                    >
                      <div className="rounded-[18px] bg-[#fff4ee] px-4 py-4 text-center">
                        <p className="font-en text-[28px] font-black leading-none text-[#f07030]">
                          {event.startsAt.slice(8, 10)}
                        </p>
                        <p className="mt-1 font-en text-[10px] uppercase tracking-[0.12em] text-[#a56a44]">
                          {event.startsAt.slice(0, 7)}
                        </p>
                      </div>
                      <div>
                        <p className="font-cn text-[14px] font-bold leading-[1.8] text-[#111111]">
                          {event.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="ui-chip">{event.city}</span>
                          <span className="ui-chip">{event.venue}</span>
                          <span className="ui-chip">{EVENT_TYPE_LABELS[event.type] ?? event.type}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedNews.length ? (
              <section id="latest-posts">
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <FileText size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Latest posts
                  </p>
                </div>
                <div className="mt-5 space-y-3">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="block rounded-[22px] border border-[#ece7df] bg-white p-5 transition hover:-translate-y-0.5"
                    >
                      <p className="font-cn text-[14px] font-bold leading-[1.8] text-[#111111]">
                        {item.excerpt}
                      </p>
                      <p className="mt-2 font-en text-[11px] text-[#6e6e73]">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[92px]">
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Index / latest update
              </p>
              {latestNews ? (
                <Link href={`/news/${latestNews.slug}`} className="mt-3 block rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Latest file</p>
                  <p className="mt-2 font-cn text-[13px] font-bold leading-[1.8] text-[#111111]">{latestNews.excerpt}</p>
                  <p className="mt-3 font-en text-[11px] text-[#6e6e73]">{latestNews.title}</p>
                </Link>
              ) : (
                <p className="mt-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">暂无最新动态。</p>
              )}
            </div>

            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Index / next event
              </p>
              {nextEvent ? (
                <Link href={`/events/${nextEvent.slug}`} className="mt-3 block rounded-[16px] bg-[#fff4ee] p-4">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#f07030]">Next file</p>
                  <p className="mt-2 font-cn text-[13px] font-bold leading-[1.8] text-[#111111]">{nextEvent.summary}</p>
                  <p className="mt-3 font-en text-[11px] text-[#6e6e73]">{nextEvent.startsAt.slice(0, 10)}</p>
                </Link>
              ) : (
                <p className="mt-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">暂无近期活动。</p>
              )}
            </div>

            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <Search size={14} />
                </span>
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                  Retrieval names
                </p>
              </div>
              <p className="mt-3 font-cn text-[12px] leading-[1.8] text-[#6e6e73]">用于继续搜原始物料、官宣、场馆贴和站外讨论。</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[star.nameEn, star.nameCn, ...(star.spotlight ?? []).slice(0, 1)]
                  .filter(Boolean)
                  .map((name) => (
                    <span key={name} className="ui-chip">
                      {name}
                    </span>
                  ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <MapPin size={14} />
                </span>
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                  Reading rule
                </p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 01</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先看人物档案和资料事实，再决定这位艺人的主追踪线。</p>
                </div>
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 02</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你只想快速跟进，优先看最新动态和下一场活动。</p>
                </div>
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 03</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你准备自己继续搜原始物料，保留英文名和公司名最有用。</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getStarDetail(slug);
  if (!detail)
    return buildPageMetadata({
      title: "明星资料",
      description: "查看泰国明星的中文资料",
      path: `/stars/${slug}`,
    });
  const { star, events, news } = detail;
  return buildPageMetadata({
    title: `${star.nameEn} | 明星资料`,
    description: `${star.nameCn} / ${star.nameEn} 的中文追星入口，当前聚合活动 ${events.length} 条、动态 ${news.length} 条。`,
    path: `/stars/${star.slug}`,
  });
}
