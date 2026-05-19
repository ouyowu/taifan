import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getEventDetail } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getEventDetail(slug);

  if (!detail) notFound();
  const { event, stars, relatedNews, previousEvent, nextEvent } = detail;
  const coverStar = stars[0];
  const eventVisuals = [coverStar?.coverUrl, coverStar?.avatarUrl, ...stars.slice(1).flatMap((star) => [star.coverUrl, star.avatarUrl])].filter(Boolean) as string[];
  const timelineNews = [...relatedNews]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);
  const planningNotes = [
    `先用活动原文标题 “${event.title}” 和场馆名 “${event.venue}” 去核对主办海报、票务页和地图位置。`,
    `正式出发前优先确认 ${event.ticketStatus}、入场时间、实名要求和现场是否有限制应援物。`,
    `如果你是第一次追这类${event.type === "brand" ? "品牌活动" : event.type === "fanmeeting" ? "见面会" : event.type === "concert" ? "演出活动" : "公开活动"}，建议先看站内中文整理，再决定要不要继续蹲原始来源更新。`,
  ];
  const followAngle =
    event.type === "brand"
      ? "这类品牌活动真正重要的不是“官宣已出”，而是到场路线、围观空间、媒体区位置和品牌现场规则。对中国粉丝来说，能不能顺利看到、拍到、按时离场，比海报本身更重要。"
      : event.type === "fanmeeting"
        ? "这类见面会最值得追的是票务规则、票区价值、互动环节和到场节奏。比起先刷情绪内容，先把能不能买、怎么买、值不值得跑一趟看懂更重要。"
        : event.type === "concert"
          ? "这类演出活动最需要先判断的是票务强度、座位区差异和应援空间。真正影响体验的，往往不是单条官宣，而是后续补出的票区图、入场规则和现场动线。"
          : "这类公开活动更适合先看参与门槛、预约方式和主办规则。对新粉来说，先看懂怎么参与，比只看一张海报更有用。";
  const eventReadMinutes = Math.max(1, Math.round((event.summary.length + planningNotes.join("").length + followAngle.length) / 260));
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startsAt,
    endDate: event.endsAt ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: event.status === "done" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
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
    image: coverStar?.coverUrl ? [coverStar.coverUrl] : undefined,
    url: `${siteConfig.siteUrl}/events/${event.slug}`,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventStructuredData),
        }}
      />
      <section className="relative h-[420px] overflow-hidden bg-[linear-gradient(145deg,#fff4ee,#f0f8ff)]">
        {coverStar?.coverUrl ? (
          <Image
            src={coverStar.coverUrl}
            alt={coverStar.nameEn}
            fill
            className="object-cover opacity-82"
            style={{ objectPosition: getImageObjectPosition(coverStar.coverUrl, "hero") }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(251,250,247,0.98)_0%,rgba(251,250,247,0.5)_60%,transparent_100%)]" />
      </section>

      <section className="page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Official Event Title</p>
        <h1 className="lattice-title mt-3 max-w-[980px] text-[38px] leading-[0.98] md:mt-4 md:text-[68px]">{event.title}</h1>
        <div className="mt-4 max-w-[820px] md:mt-5">
          <p className="font-cn text-[13px] leading-[1.85] text-[#6e6e73] md:text-[15px]">{event.summary}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Read time</p>
            <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{eventReadMinutes} min</p>
          </div>
          <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Related stars</p>
            <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{stars.length}</p>
          </div>
          <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Event month</p>
            <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{format(new Date(event.startsAt), "M.yyyy", { locale: zhCN })}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4 md:gap-4">
          <div className="lattice-soft-card bg-[#f0f8ff] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6e6e73]">地点原文</p>
            <p className="font-en mt-2 text-[13px] font-bold text-[#1c1c1e]">
              {event.city} · {event.venue}
            </p>
          </div>
          <div className="lattice-soft-card bg-[#fff4ee] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6e6e73]">日期</p>
            <p className="font-en mt-2 text-[13px] font-bold text-[#1c1c1e]">
              {format(new Date(event.startsAt), "yyyy.M.d HH:mm", { locale: zhCN })}
            </p>
          </div>
          <div className="lattice-soft-card bg-[#fff4ee] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6e6e73]">来源</p>
            <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{event.sourceLabel}</p>
          </div>
          <div className="lattice-soft-card bg-[#fff4ee] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6e6e73]">票务链接</p>
            <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{event.ticketStatus}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="lattice-card overflow-hidden p-4 md:p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Event poster board</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#fff4ee] md:min-h-[280px] md:rounded-[28px]">
                {coverStar?.coverUrl ? (
                  <Image
                    src={coverStar.coverUrl}
                    alt={coverStar.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(coverStar.coverUrl, "poster") }}
                  />
                ) : null}
              </div>
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {stars.slice(0, 2).map((star) => (
                    <div key={`${star.slug}-event-portrait`} className="relative min-h-[118px] overflow-hidden rounded-[20px] bg-[#fff4ee] md:min-h-[134px] md:rounded-[24px]">
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
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-[#f0f8ff] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Related news</p>
                    <p className="lattice-title mt-3 text-[32px]">{relatedNews.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#6e6e73]">这场活动相关的整理稿数量</p>
                  </div>
                  <div className="rounded-[20px] bg-[#f5fff0] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Stars</p>
                    <p className="lattice-title mt-3 text-[32px]">{stars.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#6e6e73]">页面里关联到的艺人数</p>
                  </div>
                </div>
                <div className="rounded-[20px] bg-white p-4 shadow-[0_1px_10px_rgba(0,0,0,0.04)] md:rounded-[24px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">At a glance</p>
                  <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73]">
                    先看日期、场馆、票务状态，再决定这场更适合抢票、围观，还是继续等主办补更多规则。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lattice-card p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Quick read</p>
            <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">See the poster, read the route.</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="relative min-h-[140px] overflow-hidden rounded-[18px] bg-[#f0f8ff] md:rounded-[22px]">
                {coverStar?.avatarUrl ? (
                  <Image
                    src={coverStar.avatarUrl}
                    alt={coverStar.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(coverStar.avatarUrl, "wide") }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.02)_0%,rgba(16,35,39,0.52)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-en text-[18px] font-black tracking-[-0.03em] text-white">{coverStar?.nameEn ?? "Thai star"}</p>
                  <p className="font-cn mt-1 text-[11px] text-white/82">{event.city} · {event.venue}</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[18px] bg-[#f0f8ff] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Ticket</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{event.ticketStatus}</p>
                </div>
                <div className="rounded-[18px] bg-[#f5fff0] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Source</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{event.sourceLabel}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先看海报和日期，再判断这场更偏票务攻略、围观攻略，还是品牌公开行程。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你只想看最值的部分，先看 Why it matters 和 Check these first。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">后面再去搜活动原文标题、场馆原文名和官方账号，会比只看中文名更稳。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-5">
            <div className="lattice-card p-5 md:p-6">
              <h2 className="lattice-title text-[30px] md:text-[38px]">Why it matters.</h2>
              <p className="font-cn mt-2 text-[18px] font-bold text-[#111111]">中文整理说明</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[1.04fr_0.96fr]">
                <div>
                  <p className="font-cn text-[14px] leading-[1.95] text-[#6e6e73]">{followAngle}</p>
                  <div className="mt-4 space-y-3">
                    {event.highlights.map((item) => (
                      <p key={item} className="font-cn text-[14px] leading-[1.9] text-[#6e6e73]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2">
                  {eventVisuals.slice(0, 3).map((imageUrl, index) => (
                    <div
                      key={`${event.slug}-why-visual-${index}`}
                      className="relative min-h-[150px] overflow-hidden rounded-[20px]"
                      style={{ backgroundColor: index === 0 ? "#f0f8ff" : "#fff4ee" }}
                    >
                      <Image
                        src={imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        style={{ objectPosition: getImageObjectPosition(imageUrl, "wide") }}
                      />
                    </div>
                  ))}
                  <div className="rounded-[20px] bg-white/58 p-4">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Route note</p>
                    <p className="font-cn mt-3 text-[13px] leading-[1.85] text-[#6e6e73]">
                      {event.city} · {event.venue}。先确认入场规则和主办要求，再决定是冲票还是围观。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {timelineNews.length ? (
              <div className="lattice-card p-5 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Story arc</p>
                <h2 className="lattice-title mt-3 text-[26px] md:text-[32px]">What happened before this.</h2>
                <div className="mt-4 space-y-3">
                  {timelineNews.map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="grid gap-3 rounded-[22px] bg-[#fafafa] p-4 transition hover:-translate-y-0.5 md:grid-cols-[88px_1fr] md:rounded-[26px] md:p-5"
                    >
                      <div className="relative min-h-[112px] overflow-hidden rounded-[18px] bg-[#e7ebff] md:min-h-[132px] md:rounded-[20px]">
                        {coverStar?.avatarUrl ? (
                          <Image
                            src={coverStar.avatarUrl}
                            alt={coverStar.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(coverStar.avatarUrl, "avatar") }}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.02)_0%,rgba(16,35,39,0.46)_100%)]" />
                        <div className="absolute bottom-0 left-0 p-3">
                          <p className="lattice-title text-[22px] text-white">0{index + 1}</p>
                          <p className="font-cn mt-1 text-[11px] text-white/82">
                            {format(new Date(item.publishedAt), "M.d", { locale: zhCN })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-cn text-[14px] font-bold leading-[1.75] text-[#111111]">{item.excerpt}</p>
                        <p className="font-en mt-2 text-[10px] text-[#6e6e73]">{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

              <div className="lattice-card p-5 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Before you go</p>
                <h2 className="lattice-title mt-3 text-[26px] md:text-[32px]">Check these first.</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
                  {planningNotes.map((note, index) => (
                  <div key={`${event.slug}-note-${index}`} className="overflow-hidden rounded-[22px] bg-[#fafafa] p-4 md:rounded-[26px] md:p-5">
                    <div className="relative mb-3 min-h-[108px] overflow-hidden rounded-[16px] bg-[#f0f8ff] md:mb-4 md:min-h-[124px] md:rounded-[18px]">
                      {eventVisuals[index % eventVisuals.length] ? (
                        <Image
                          src={eventVisuals[index % eventVisuals.length]}
                          alt={event.title}
                          fill
                          className="object-cover"
                          style={{ objectPosition: getImageObjectPosition(eventVisuals[index % eventVisuals.length], "wide") }}
                        />
                      ) : null}
                    </div>
                    <p className="lattice-title text-[24px]">0{index + 1}</p>
                    <p className="font-cn mt-3 text-[14px] leading-[1.85] text-[#6e6e73]">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {relatedNews.length ? (
              <div className="lattice-card p-5 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Related coverage</p>
                <h2 className="lattice-title mt-3 text-[26px] md:text-[32px]">Read these updates too.</h2>
                <div className="mt-4 space-y-3">
                  {relatedNews.slice(0, 3).map((item, index) => (
                    <Link
                      key={item.slug}
                      href={`/news/${item.slug}`}
                      className="grid gap-3 rounded-[22px] p-4 transition hover:-translate-y-0.5 md:grid-cols-[96px_1fr] md:gap-4 md:rounded-[28px]"
                      style={{ backgroundColor: index % 2 === 0 ? "#f0f8ff" : "#fff4ee" }}
                    >
                      <div className="relative min-h-[116px] overflow-hidden rounded-[18px] bg-white/55 md:min-h-[132px] md:rounded-[22px]">
                        {coverStar?.coverUrl ? (
                          <Image
                            src={coverStar.coverUrl}
                            alt={coverStar.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(coverStar.coverUrl, "avatar") }}
                          />
                        ) : null}
                      </div>
                      <div className="self-center">
                        <p className="font-cn text-[14px] font-bold leading-[1.75] text-[#111111]">{item.excerpt}</p>
                        <p className="font-en mt-2 text-[10px] text-[#6e6e73]">{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {(previousEvent || nextEvent) ? (
              <div className="lattice-card p-5 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Keep tracking</p>
                <h2 className="lattice-title mt-3 text-[26px] md:text-[32px]">What to watch next.</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                  {previousEvent ? (
                    <Link href={`/events/${previousEvent.slug}`} className="grid gap-3 rounded-[22px] bg-[#f0f8ff] p-4 transition hover:-translate-y-0.5 md:grid-cols-[84px_1fr] md:gap-4 md:rounded-[28px]">
                      <div className="relative min-h-[106px] overflow-hidden rounded-[18px] bg-white/55 md:min-h-[118px] md:rounded-[20px]">
                        {coverStar?.coverUrl ? (
                          <Image
                            src={coverStar.coverUrl}
                            alt={coverStar.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(coverStar.coverUrl, "avatar") }}
                          />
                        ) : null}
                      </div>
                      <div className="self-center">
                        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#4d7b93]">Previous event</p>
                        <p className="lattice-title mt-3 text-[24px]">{previousEvent.title}</p>
                        <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73]">
                          {previousEvent.city} · {previousEvent.venue}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-[22px] bg-[#fafafa] p-4 md:rounded-[28px] md:p-5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#99a4a8]">Previous event</p>
                      <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73]">这场活动已经是当前站内这条线较早的一场记录。</p>
                    </div>
                  )}
                  {nextEvent ? (
                    <Link href={`/events/${nextEvent.slug}`} className="grid gap-3 rounded-[22px] bg-[#fff4ee] p-4 transition hover:-translate-y-0.5 md:grid-cols-[84px_1fr] md:gap-4 md:rounded-[28px]">
                      <div className="relative min-h-[106px] overflow-hidden rounded-[18px] bg-white/55 md:min-h-[118px] md:rounded-[20px]">
                        {coverStar?.coverUrl ? (
                          <Image
                            src={coverStar.coverUrl}
                            alt={coverStar.nameEn}
                            fill
                            className="object-cover"
                            style={{ objectPosition: getImageObjectPosition(coverStar.coverUrl, "avatar") }}
                          />
                        ) : null}
                      </div>
                      <div className="self-center">
                        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#4f7154]">Next event</p>
                        <p className="lattice-title mt-3 text-[24px]">{nextEvent.title}</p>
                        <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73]">
                          {nextEvent.city} · {nextEvent.venue}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="rounded-[22px] bg-[#fafafa] p-4 md:rounded-[28px] md:p-5">
                      <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#99a4a8]">Next event</p>
                      <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73]">这场活动之后的下一场安排，站内会继续按来源更新补进来。</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <h2 className="lattice-title text-[30px] md:text-[38px]">Who’s here.</h2>
            <p className="font-cn mt-2 text-[18px] font-bold text-[#111111]">相关明星</p>
            <div className="mt-4 grid gap-3 md:mt-5">
              {stars.map((star) => (
                <Link
                  key={star.slug}
                  href={`/stars/${star.slug}`}
                  className="grid grid-cols-[84px_1fr] gap-3 rounded-[24px] border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-0.5 md:grid-cols-[92px_1fr] md:gap-4 md:rounded-[30px]"
                >
                  <div className="relative h-[100px] overflow-hidden rounded-[18px] md:h-[110px] md:rounded-[22px]">
                    {star.coverUrl ? (
                      <Image
                        src={star.coverUrl}
                        alt={star.nameEn}
                        fill
                        className="object-cover"
                        style={{ objectPosition: getImageObjectPosition(star.coverUrl, "wide") }}
                      />
                    ) : null}
                  </div>
                  <div className="self-center">
                    <p className="lattice-title text-[24px]">{star.nameEn}</p>
                    <p className="font-cn mt-2 text-[13px] text-[#6e6e73]">{star.nameCn}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:mt-5">
              <div className="lattice-card p-5 md:p-6">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Search with these names</p>
                <h3 className="lattice-title mt-3 text-[24px] md:text-[28px]">Use the original words.</h3>
                <p className="font-cn mt-3 text-[13px] leading-[1.85] text-[#6e6e73]">
                  真正去搜海报、票务页和地图时，优先用这些原文名。中文整理负责解释怎么追，原文负责帮你找到正确入口。
                </p>
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
              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/calendar" className="lattice-soft-card bg-[#f0f8ff] p-4 transition hover:-translate-y-0.5 md:p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Next step</p>
                  <p className="lattice-title mt-3 text-[22px]">Back to calendar.</p>
                  <p className="font-cn mt-2 text-[13px] leading-[1.8] text-[#6e6e73]">继续看这一周还有哪几场更值得先追。</p>
                </Link>
                <Link href="/news" className="lattice-soft-card bg-[#f5fff0] p-4 transition hover:-translate-y-0.5 md:p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Read around it</p>
                  <p className="lattice-title mt-3 text-[22px]">Open the news desk.</p>
                  <p className="font-cn mt-2 text-[13px] leading-[1.8] text-[#6e6e73]">先补这条活动前后的整理稿，再决定要不要继续蹲原始更新。</p>
                </Link>
              </div>
            </div>
          </div>
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

  const { event, stars } = detail;
  const leadStar = stars[0];

  return buildPageMetadata({
    title: event.title,
    description: `${event.summary} 地点 ${event.city} · ${event.venue}，票务状态：${event.ticketStatus}。中文整理说明 + 原文保留。`,
    path: `/events/${event.slug}`,
    image: leadStar?.coverUrl || leadStar?.avatarUrl,
  });
}
