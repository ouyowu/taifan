import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  CalendarRange,
  FileText,
  ListTree,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { EVENT_TYPE_LABELS, siteConfig } from "@/lib/constants";
import { getEventDetail, getStaticEventParams } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getStaticEventParams();
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getEventDetail(slug);

  if (!detail) notFound();

  const { event, stars, relatedNews, previousEvent, nextEvent } = detail;
  const infoRows = [
    { label: "活动类型", value: EVENT_TYPE_LABELS[event.type] ?? event.type },
    { label: "城市", value: event.city },
    { label: "场馆", value: event.venue },
    { label: "来源", value: event.sourceLabel },
    { label: "票务状态", value: event.ticketStatus },
    { label: "开始时间", value: format(new Date(event.startsAt), "yyyy.M.d HH:mm", { locale: zhCN }) },
  ];
  const typeName = EVENT_TYPE_LABELS[event.type] ?? "活动";
  const planningNotes = [
    "先用活动原文标题「" + event.title + "」和场馆名「" + event.venue + "」去核对主办海报、票务页和地图位置。",
    "正式出发前优先确认 " + event.ticketStatus + "、入场时间、实名要求和现场是否有限制应援物。",
    "如果你是第一次追这类" + typeName + "，建议先看站内中文整理，再决定要不要继续蹲原始来源更新。",
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
    url: `${siteConfig.siteUrl}/events/${event.slug}`,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />

      <section className="page-shell mx-auto max-w-[1100px] py-10 md:py-14">
        <div className="grid gap-8 border-b border-[#ece7df] pb-8 md:grid-cols-[1.08fr_0.92fr] md:gap-12 md:pb-10">
          <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-icon-badge">
              <CalendarRange size={14} />
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
              Event briefing
            </span>
            <span className="ui-chip">{EVENT_TYPE_LABELS[event.type] ?? event.type}</span>
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
          <aside className="space-y-3">
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                At a glance
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Stars</p>
                  <p className="mt-2 font-en text-[24px] font-black text-[#111111]">{stars.length}</p>
                </div>
                <div className="rounded-[16px] bg-[#faf7f3] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Updates</p>
                  <p className="mt-2 font-en text-[24px] font-black text-[#111111]">{relatedNews.length}</p>
                </div>
                <div className="rounded-[16px] bg-[#fff4ee] p-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#f07030]">Month</p>
                  <p className="mt-2 font-en text-[15px] font-black text-[#111111]">{format(new Date(event.startsAt), "M.yyyy", { locale: zhCN })}</p>
                </div>
              </div>
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
                <a href="#brief" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>活动档案</span>
                  <span className="font-en text-[11px] text-[#a56a44]">01</span>
                </a>
                <a href="#matters" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>为什么重要</span>
                  <span className="font-en text-[11px] text-[#a56a44]">02</span>
                </a>
                <a href="#checks" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>出发前检查</span>
                  <span className="font-en text-[11px] text-[#a56a44]">03</span>
                </a>
                <a href="#coverage" className="flex items-center justify-between rounded-[14px] bg-[#faf7f3] px-4 py-3 font-cn text-[13px] text-[#3c3c43]">
                  <span>相关整理</span>
                  <span className="font-en text-[11px] text-[#a56a44]">04</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="space-y-8">
            <section id="brief">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <FileText size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  Event dossier
                </p>
              </div>
              <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.03em] text-[#111111] md:text-[36px]">
                活动档案
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
            </section>

            <section id="matters" className="rounded-[24px] border border-[#ece7df] bg-white p-6 md:p-7">
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

            <section id="checks">
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
              <section id="coverage">
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
                Index / who&apos;s here
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
                  Retrieval names
                </p>
              </div>
              <p className="mt-3 font-cn text-[12px] leading-[1.8] text-[#6e6e73]">用于继续搜海报、票务页、场馆贴和主办补充说明。</p>
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
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Index / next file</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Back to calendar
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">继续看这一周还有哪几场更值得先追。</p>
              </Link>
              <Link href="/news" className="rounded-[22px] border border-[#ece7df] bg-[#fff4ee] p-5 transition hover:-translate-y-0.5">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Index / related file</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Open the news desk
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先补这条活动前后的整理稿，再决定要不要继续蹲原始更新。</p>
              </Link>
            </div>
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Reading rule
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 01</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先看活动档案，再判断这场更偏抢票、围观，还是品牌公开露出。</p>
                </div>
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 02</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你要做实际出行准备，优先看出发前检查，不要只看标题和摘要。</p>
                </div>
                <div className="rounded-[14px] bg-[#faf7f3] px-4 py-3">
                  <p className="font-en text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">Rule 03</p>
                  <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你准备继续搜原始信息，优先保留活动原文名、场馆名和艺人英文名。</p>
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
  });
}
