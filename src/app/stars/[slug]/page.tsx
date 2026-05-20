import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarRange,
  FileText,
  MapPin,
  Radio,
  Search,
  Sparkles,
  Tags,
  UserRound,
} from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getStarDetail } from "@/lib/data";
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
  const latestNews = relatedNews[0];
  const nextEvent = relatedEvents[0];
  const mustReadNews = relatedNews.slice(0, 3);
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
        <div className="grid gap-8 border-b border-[#ece7df] pb-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:pb-10">
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
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="space-y-8">
            {star.profileFacts?.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <FileText size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Profile facts
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

            {mustReadNews.length ? (
              <section>
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
                        0{index + 1}
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
              <section>
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
                          <span className="ui-chip">{TYPE_LABEL[event.type] ?? event.type}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedNews.length ? (
              <section>
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
                Latest update
              </p>
              {latestNews ? (
                <Link href={`/news/${latestNews.slug}`} className="mt-3 block rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-cn text-[13px] font-bold leading-[1.8] text-[#111111]">
                    {latestNews.excerpt}
                  </p>
                </Link>
              ) : (
                <p className="mt-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">暂无最新动态。</p>
              )}
            </div>

            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Next event
              </p>
              {nextEvent ? (
                <Link href={`/events/${nextEvent.slug}`} className="mt-3 block rounded-[16px] bg-[#fff4ee] p-4">
                  <p className="font-cn text-[13px] font-bold leading-[1.8] text-[#111111]">
                    {nextEvent.summary}
                  </p>
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
                  Search with these names
                </p>
              </div>
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
                  How to use this page
                </p>
              </div>
              <div className="mt-4 space-y-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">
                <p>先看人物简介和资料事实，再决定这位艺人的主追踪线是什么。</p>
                <p>如果你只想快速跟进，优先看最新动态和下一场活动。</p>
                <p>如果你准备自己继续搜原始物料，保留英文名和公司名最有用。</p>
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
