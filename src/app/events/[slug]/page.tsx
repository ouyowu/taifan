import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarRange,
  FileText,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getEventDetail } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";

const TYPE_LABEL: Record<string, string> = {
  fanmeeting: "见面会",
  concert: "演唱会",
  brand: "品牌活动",
  broadcast: "直播",
  variety: "综艺",
  event: "活动",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getEventDetail(slug);

  if (!detail) notFound();

  const { event, stars, relatedNews, previousEvent, nextEvent } = detail;
  const planningNotes = [
    `先用活动原文标题 “${event.title}” 和场馆名 “${event.venue}” 去核对主办海报、票务页和地图位置。`,
    `正式出发前优先确认 ${event.ticketStatus}、入场时间、实名要求和现场是否有限制应援物。`,
    `如果你是第一次追这类${TYPE_LABEL[event.type] ?? "活动"}，建议先看站内中文整理，再决定要不要继续蹲原始来源更新。`,
  ];
  const followAngle =
    event.type === "brand"
      ? "品牌活动真正重要的不是只知道官宣，而是路线、围观空间、媒体区位置和主办规则。"
      : event.type === "fanmeeting"
        ? "见面会最值得先确认的是票务规则、票区差异、互动环节和到场节奏。"
        : event.type === "concert"
          ? "演出类活动最需要先判断的是抢票强度、座位区差异和现场动线。"
          : "公开活动更适合先看参与门槛、预约方式和主办规则。";
  const eventReadMinutes = Math.max(
    1,
    Math.round((event.summary.length + planningNotes.join("").length + followAngle.length) / 260),
  );
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      event.status === "done"
        ? "https://schema.org/EventCompleted"
        : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
      },
    },
    performer: stars.map((star) => ({
      "@type": "Person",
      name: star.nameEn,
    })),
    organizer: {
      "@type": "Organization",
      name: event.sourceLabel,
    },
    image: undefined,
    url: `${siteConfig.siteUrl}/events/${event.slug}`,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />

      <section className="page-shell mx-auto max-w-[1100px] py-10 md:py-14">
        <div className="border-b border-[#ece7df] pb-8 md:pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-icon-badge">
              <CalendarRange size={14} />
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
              Event briefing
            </span>
            <span className="ui-chip">{TYPE_LABEL[event.type] ?? event.type}</span>
            <span className="ui-chip">{event.city}</span>
          </div>
          <h1 className="mt-4 font-sans text-[34px] font-black leading-[0.98] tracking-[-0.04em] text-[#111111] md:text-[62px]">
            {event.title}
          </h1>
          <p className="font-cn mt-5 max-w-[780px] text-[15px] leading-[1.95] text-[#3c3c43]">
            {event.summary}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <Ticket size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Ticket
                </p>
              </div>
              <p className="mt-3 font-cn text-[14px] font-bold text-[#111111]">{event.ticketStatus}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Venue
                </p>
              </div>
              <p className="mt-3 font-cn text-[14px] font-bold text-[#111111]">{event.venue}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <UserRound size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Stars
                </p>
              </div>
              <p className="mt-3 font-en text-[24px] font-black text-[#111111]">{stars.length}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Read time
                </p>
              </div>
              <p className="mt-3 font-en text-[24px] font-black text-[#111111]">{eventReadMinutes} min</p>
            </div>
          </div>
          <div className="mt-5 editorial-inline-note">
            <Sparkles size={14} />
            <span>这页先帮你判断要不要追这场活动，再给你原文名、场馆和后续整理的入口。</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="space-y-8">
            <section className="rounded-[24px] border border-[#ece7df] bg-white p-6 md:p-7">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <FileText size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  Why it matters
                </p>
              </div>
              <p className="mt-5 font-cn text-[14px] leading-[1.95] text-[#3c3c43]">{followAngle}</p>
              {event.highlights.length ? (
                <div className="mt-5 space-y-3">
                  {event.highlights.map((item) => (
                    <div key={item} className="rounded-[18px] bg-[#faf7f3] p-4">
                      <p className="font-cn text-[14px] leading-[1.9] text-[#3c3c43]">{item}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section>
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <Search size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  Check these first
                </p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {planningNotes.map((note, index) => (
                  <div key={`${event.slug}-note-${index}`} className="rounded-[22px] border border-[#ece7df] bg-white p-5">
                    <p className="font-en text-[20px] font-black text-[#f07030]">0{index + 1}</p>
                    <p className="mt-3 font-cn text-[14px] leading-[1.9] text-[#3c3c43]">{note}</p>
                  </div>
                ))}
              </div>
            </section>

            {relatedNews.length ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <FileText size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Related coverage
                  </p>
                </div>
                <div className="mt-5 space-y-3">
                  {relatedNews.slice(0, 3).map((item) => (
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

            {(previousEvent || nextEvent) ? (
              <section>
                <div className="flex items-center gap-2">
                  <span className="editorial-icon-badge">
                    <CalendarRange size={14} />
                  </span>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                    Keep tracking
                  </p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {previousEvent ? (
                    <Link href={`/events/${previousEvent.slug}`} className="rounded-[22px] border border-[#ece7df] bg-[#f0f8ff] p-5 transition hover:-translate-y-0.5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Previous event</p>
                      <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                        {previousEvent.title}
                      </p>
                      <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">
                        {previousEvent.city} · {previousEvent.venue}
                      </p>
                    </Link>
                  ) : (
                    <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Previous event</p>
                      <p className="mt-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">这场活动已经是当前站内较早的一条记录。</p>
                    </div>
                  )}
                  {nextEvent ? (
                    <Link href={`/events/${nextEvent.slug}`} className="rounded-[22px] border border-[#ece7df] bg-[#fff4ee] p-5 transition hover:-translate-y-0.5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Next event</p>
                      <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                        {nextEvent.title}
                      </p>
                      <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">
                        {nextEvent.city} · {nextEvent.venue}
                      </p>
                    </Link>
                  ) : (
                    <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Next event</p>
                      <p className="mt-3 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">后续安排还会继续按来源更新补进来。</p>
                    </div>
                  )}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[92px]">
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Who&apos;s here
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stars.map((star) => (
                  <Link key={star.slug} href={`/stars/${star.slug}`} className="ui-chip">
                    {star.nameEn}
                  </Link>
                ))}
              </div>
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
                <span className="ui-chip">{event.title}</span>
                <span className="ui-chip">{event.venue}</span>
                <span className="ui-chip">{event.city}</span>
                {stars.slice(0, 3).map((star) => (
                  <span key={`${star.slug}-search-chip`} className="ui-chip">
                    {star.nameEn}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <Link href="/calendar" className="rounded-[22px] border border-[#ece7df] bg-[#f0f8ff] p-5 transition hover:-translate-y-0.5">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Next step</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Back to calendar
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">继续看这一周还有哪几场更值得先追。</p>
              </Link>
              <Link href="/news" className="rounded-[22px] border border-[#ece7df] bg-[#fff4ee] p-5 transition hover:-translate-y-0.5">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Read around it</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Open the news desk
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先补这条活动前后的整理稿，再决定要不要继续蹲原始更新。</p>
              </Link>
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
  const detail = await getEventDetail(slug);

  if (!detail) {
    return buildPageMetadata({
      title: "活动详情",
      description: "查看泰国明星活动的中文整理、时间、地点、票务状态和相关明星。",
      path: `/events/${slug}`,
    });
  }

  const { event } = detail;

  return buildPageMetadata({
    title: event.title,
    description: `${event.summary} 地点 ${event.city} · ${event.venue}，票务状态：${event.ticketStatus}。中文整理说明 + 原文保留。`,
    path: `/events/${event.slug}`,
    image: undefined,
  });
}
