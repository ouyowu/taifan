# 给 Claude 的详情页关键文件包

说明：

- 这是配套 `docs/claude-requested-key-files.md` 的第二份文件
- 主要给 Claude 看三张最关键的详情页：
  - 动态详情页 `src/app/news/[slug]/page.tsx`
  - 活动详情页 `src/app/events/[slug]/page.tsx`
  - 明星详情页 `src/app/stars/[slug]/page.tsx`
- 这里不是整文件全量导出，而是每个文件前面最关键的一大段结构代码，足够判断：
  - 版式系统
  - 图片 / 文案关系
  - Hero / 信息卡 / 正文块 / 右侧导读块的组织方式

---

## 1. `src/app/news/[slug]/page.tsx`（前 260 行）

```tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getNewsDetail } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getNewsDetail(slug);
  if (!detail) notFound();

  const { news, stars } = detail;
  const leadStar = stars[0];
  const newsVisuals = [leadStar?.coverUrl, leadStar?.avatarUrl, ...stars.slice(1).flatMap((star) => [star.coverUrl, star.avatarUrl])].filter(Boolean) as string[];
  const articleParagraphs = news.bodyMd.split(/\n{2,}/).filter(Boolean);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.excerpt,
    datePublished: news.publishedAt,
    dateModified: news.publishedAt,
    inLanguage: "zh-CN",
    articleSection: news.category,
    author: {
      "@type": "Organization",
      name: "ThaiStar Bridge / 泰娱桥",
    },
    publisher: {
      "@type": "Organization",
      name: "ThaiStar Bridge / 泰娱桥",
    },
    image: leadStar?.coverUrl ? [leadStar.coverUrl] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/news/${news.slug}`,
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <section className="page-shell mx-auto max-w-[1040px] py-12 md:py-16">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full bg-[#dcd7ff] md:h-[78px] md:w-[78px]">
            {leadStar?.avatarUrl ? (
              <Image
                src={leadStar.avatarUrl}
                alt={leadStar.nameEn}
                fill
                className="object-cover"
                style={{ objectPosition: getImageObjectPosition(leadStar.avatarUrl, "avatar") }}
              />
            ) : null}
          </div>
          <div>
            <p className="lattice-title text-[24px]">{leadStar?.nameEn ?? "ThaiStar Bridge Desk"}</p>
            <p className="font-sans mt-1 text-[11px] text-[#6d7b7e]">Newsroom / 中文整理快读</p>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Original Title</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="font-cn rounded-full bg-[#f4f1ec] px-3 py-1 text-[11px] text-[#6d7b7e]">
              {news.category}
            </span>
            {news.editorialMode === "daily-auto" ? (
              <span className="font-cn rounded-full bg-[#102327] px-3 py-1 text-[11px] text-white">
                今日自动整理
              </span>
            ) : null}
          </div>
          <h1 className="lattice-title mt-3 text-[38px] leading-[1] md:mt-4 md:text-[64px]">{news.title}</h1>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="lattice-card overflow-hidden p-4 md:p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">News poster board</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#dcd7ff] md:min-h-[280px] md:rounded-[28px]">
                {leadStar?.coverUrl ? (
                  <Image
                    src={leadStar.coverUrl}
                    alt={leadStar.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(leadStar.coverUrl, "poster") }}
                  />
                ) : null}
              </div>
              <div className="grid gap-3">
                <div className="relative min-h-[116px] overflow-hidden rounded-[20px] bg-[#f7dfe9] md:min-h-[136px] md:rounded-[24px]">
                  {leadStar?.avatarUrl ? (
                    <Image
                      src={leadStar.avatarUrl}
                      alt={leadStar.nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(leadStar.avatarUrl, "wide") }}
                    />
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-[#dff4ff] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Category</p>
                    <p className="font-cn mt-3 text-[14px] font-bold text-[#102327]">{news.category}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#5f7074]">这条内容归在哪条关注线里</p>
                  </div>
                  <div className="rounded-[20px] bg-[#eef7bf] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Linked stars</p>
                    <p className="lattice-title mt-3 text-[32px]">{stars.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#5f7074]">这条稿关联到的艺人数</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lattice-card p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">How to read</p>
            <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">Read the summary. Keep the title.</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="relative min-h-[140px] overflow-hidden rounded-[18px] bg-[#dff4ff] md:rounded-[22px]">
                {leadStar?.coverUrl ? (
                  <Image
                    src={leadStar.coverUrl}
                    alt={leadStar.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(leadStar.coverUrl, "wide") }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.02)_0%,rgba(16,35,39,0.54)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-en text-[18px] font-black tracking-[-0.03em] text-white">{leadStar?.nameEn ?? "Thai star"}</p>
                  <p className="font-cn mt-1 text-[11px] text-white/82">{news.category} · {stars.length} 位相关艺人</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[18px] bg-[#dff4ff] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Mode</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{news.editorialMode === "daily-auto" ? "自动整理" : "人工整理"}</p>
                </div>
                <div className="rounded-[18px] bg-[#eef7bf] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Source</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{news.sourceLabel ?? "站内整理来源"}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">先看中文快读，快速判断这条值不值得继续追。</p>
              </div>
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">保留原始标题、艺人原文名和来源账号，后续搜原始帖会更直接。</p>
              </div>
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">如果你是新粉，这页最适合做“快速补一条”的入口，不需要先刷完整时间线。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-[28px] border border-[#ece6dc] bg-[linear-gradient(135deg,#dff4ff_0%,#dcd7ff_100%)] p-5 shadow-[0_18px_45px_rgba(16,35,39,0.08)] md:rounded-[36px] md:p-6">
          <h2 className="lattice-title text-[30px] md:text-[36px]">What happened.</h2>
          <p className="font-cn mt-2 text-[18px] font-bold text-[#111111]">中文摘要</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="font-cn text-[14px] leading-[1.9] text-[#5f7074]">{news.excerpt}</p>
              <div className="mt-5 space-y-3 md:space-y-4">
                {articleParagraphs.map((paragraph, index) => (
                  <div key={`${index}-${paragraph.slice(0, 12)}`} className="rounded-[18px] bg-white/42 p-4 md:rounded-[22px]">
                    <p className="font-cn text-[14px] leading-[1.9] text-[#5f7074]">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              {newsVisuals.slice(0, 3).map((imageUrl, index) => (
                <div
                  key={`${news.slug}-article-visual-${index}`}
                  className="relative min-h-[142px] overflow-hidden rounded-[20px]"
                  style={{ backgroundColor: index === 1 ? "#eef7bf" : "#f7dfe9" }}
                >
                  <Image
                    src={imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(imageUrl, "wide") }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
```

---

## 2. `src/app/events/[slug]/page.tsx`（前 260 行）

```tsx
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
      <section className="relative h-[420px] overflow-hidden bg-[linear-gradient(145deg,#dcd7ff,#dff4ff)]">
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
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Official Event Title</p>
        <h1 className="lattice-title mt-3 max-w-[980px] text-[38px] leading-[0.98] md:mt-4 md:text-[68px]">{event.title}</h1>
        <div className="mt-4 max-w-[820px] md:mt-5">
          <p className="font-cn text-[13px] leading-[1.85] text-[#6d7b7e] md:text-[15px]">{event.summary}</p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4 md:gap-4">
          <div className="lattice-soft-card bg-[#dff4ff] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6d7b7e]">地点原文</p>
            <p className="font-en mt-2 text-[13px] font-bold text-[#102327]">
              {event.city} · {event.venue}
            </p>
          </div>
          <div className="lattice-soft-card bg-[#d8f8c5] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6d7b7e]">日期</p>
            <p className="font-en mt-2 text-[13px] font-bold text-[#102327]">
              {format(new Date(event.startsAt), "yyyy.M.d HH:mm", { locale: zhCN })}
            </p>
          </div>
          <div className="lattice-soft-card bg-[#f7dfe9] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6d7b7e]">来源</p>
            <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{event.sourceLabel}</p>
          </div>
          <div className="lattice-soft-card bg-[#dcd7ff] p-4 md:p-5">
            <p className="font-cn text-[12px] text-[#6d7b7e]">票务链接</p>
            <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{event.ticketStatus}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="lattice-card overflow-hidden p-4 md:p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Event poster board</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#dcd7ff] md:min-h-[280px] md:rounded-[28px]">
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
                    <div key={`${star.slug}-event-portrait`} className="relative min-h-[118px] overflow-hidden rounded-[20px] bg-[#f7dfe9] md:min-h-[134px] md:rounded-[24px]">
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
                  <div className="rounded-[20px] bg-[#dff4ff] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Related news</p>
                    <p className="lattice-title mt-3 text-[32px]">{relatedNews.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#5f7074]">这场活动相关的整理稿数量</p>
                  </div>
                  <div className="rounded-[20px] bg-[#eef7bf] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Stars</p>
                    <p className="lattice-title mt-3 text-[32px]">{stars.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#5f7074]">页面里关联到的艺人数</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lattice-card p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Quick read</p>
            <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">See the poster, read the route.</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="relative min-h-[140px] overflow-hidden rounded-[18px] bg-[#dff4ff] md:rounded-[22px]">
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
                <div className="rounded-[18px] bg-[#dff4ff] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Ticket</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{event.ticketStatus}</p>
                </div>
                <div className="rounded-[18px] bg-[#eef7bf] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Source</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#102327]">{event.sourceLabel}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">先看海报和日期，再判断这场更偏票务攻略、围观攻略，还是品牌公开行程。</p>
              </div>
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">如果你只想看最值的部分，先看 Why it matters 和 Check these first。</p>
              </div>
              <div className="rounded-[18px] bg-[#fbfaf7] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#5f7074]">后面再去搜活动原文标题、场馆原文名和官方账号，会比只看中文名更稳。</p>
              </div>
            </div>
          </div>
        </div>
```

---

## 3. `src/app/stars/[slug]/page.tsx`（前 260 行）

```tsx
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

const SOFT_TONES = ["#dff4ff", "#f7dfe9", "#eef7bf", "#dcd7ff"];

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
  const starVisuals = [star.coverUrl, star.avatarUrl].filter(Boolean) as string[];
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: star.nameEn,
    alternateName: star.nameCn,
    description: star.bio,
    homeLocation: star.baseCity,
    affiliation: {
      "@type": "Organization",
      name: star.agency,
    },
    url: `${siteConfig.siteUrl}/stars/${star.slug}`,
    image: star.coverUrl || star.avatarUrl,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff4ff_0%,transparent_22%),radial-gradient(circle_at_bottom_right,#eef7bf_0%,transparent_18%),linear-gradient(180deg,#fffdfa_0%,#fbfaf7_100%)]">
        <div className="page-shell mx-auto grid max-w-[1440px] gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-10 lg:py-14">
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="grid gap-3 sm:grid-cols-[1.25fr_0.75fr] md:gap-4">
              <div className="relative overflow-hidden rounded-[30px] bg-[#dcd7ff] p-3 shadow-[0_28px_80px_rgba(16,35,39,0.12)] md:rounded-[40px] md:p-4">
                <div className="relative h-[340px] overflow-hidden rounded-[24px] md:h-[420px] md:rounded-[30px]">
                  {star.coverUrl ? (
                    <Image
                      src={star.coverUrl}
                      alt={star.nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(star.coverUrl, "hero") }}
                    />
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between md:mt-4">
                  <div>
                    <p className="font-en text-[22px] font-black tracking-[-0.04em] text-[#102327] md:text-[24px]">{star.nameEn}</p>
                    <p className="font-cn mt-1 text-[12px] text-[#5f7074]">{star.nameCn}</p>
                  </div>
                  <span className="lattice-pill !px-3 !py-2 !text-[11px]">Featured</span>
                </div>
              </div>
              <div className="grid gap-3 md:gap-4">
                <div className="lattice-card p-4 md:p-5">
                  <div className="relative h-[106px] overflow-hidden rounded-[20px] bg-[#f7dfe9] md:h-[120px] md:rounded-[24px]">
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
                  <p className="font-sans mt-4 text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Search with</p>
                  <p className="font-en mt-2 text-[16px] font-black text-[#102327]">{star.nameEn}</p>
                  <p className="font-cn mt-1 text-[12px] leading-[1.7] text-[#6d7b7e]">后续搜票务、品牌活动、主办海报时请保留原文名。</p>
                </div>
                <div className="lattice-card p-4 md:p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Current angle</p>
                  <p className="font-cn mt-3 text-[14px] font-bold text-[#102327]">{star.spotlight.slice(0, 2).join(" / ")}</p>
                  <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#6d7b7e]">先追这条线，再决定要不要继续补更早的活动和动态。</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 rounded-[22px] bg-white px-4 py-3 shadow-[0_20px_50px_rgba(16,35,39,0.14)] md:-bottom-6 md:left-6 md:rounded-[26px] md:px-5 md:py-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">{star.agency}</p>
              <p className="font-cn mt-2 text-[13px] text-[#6d7b7e]">中国粉丝高关注追踪对象</p>
            </div>
          </div>

          <div className="max-w-[760px] pb-4">
            <span className="lattice-pill !px-4 !py-3 !text-[12px]">
              Featured star
              <span className="h-2.5 w-2.5 rounded-full bg-[#8fdc8a]" />
            </span>
            <h1 className="lattice-title mt-6 text-[42px] leading-[0.96] md:mt-8 md:text-[74px] lg:text-[88px]">
              {star.nameEn}
            </h1>
            <p className="font-cn mt-3 text-[24px] font-bold text-[#111111]">{star.nameCn}</p>
            <p className="font-sans mt-2 text-[12px] uppercase tracking-[0.18em] text-[#8fdc8a]">{star.fandomName}</p>

            <div className="mt-6 lattice-card p-5 md:mt-8 md:p-6">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8fdc8a]">Chinese summary</p>
              <div className="mt-3 grid gap-4 md:mt-4 md:grid-cols-[1.08fr_0.92fr] md:items-start">
                <div>
                  <p className="font-cn text-[14px] leading-[1.8] text-[#6d7b7e] md:text-[16px] md:leading-[1.9]">{star.bio}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-[18px] bg-[#fbfaf7] p-3 md:rounded-[20px]">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8fdc8a]">Use this name</p>
                      <p className="font-en mt-2 text-[14px] font-bold text-[#102327]">{star.nameEn}</p>
                    </div>
                    <div className="rounded-[18px] bg-[#fbfaf7] p-3 md:rounded-[20px]">
                      <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8fdc8a]">Agency</p>
                      <p className="font-cn mt-2 text-[14px] font-bold text-[#102327]">{star.agency}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                  {starVisuals.slice(0, 2).map((imageUrl, index) => (
                    <div
                      key={`${star.slug}-summary-visual-${index}`}
                      className="relative min-h-[152px] overflow-hidden rounded-[22px]"
                      style={{ backgroundColor: index === 0 ? "#dff4ff" : "#f7dfe9" }}
                    >
                      <Image
                        src={imageUrl}
                        alt={star.nameEn}
                        fill
                        className="object-cover"
                        style={{ objectPosition: getImageObjectPosition(imageUrl, "wide") }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 md:mt-8 md:gap-3">
              {star.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="font-cn rounded-full px-4 py-2 text-[12px] text-[#5f7074]"
                  style={{ backgroundColor: SOFT_TONES[index % SOFT_TONES.length] }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
              <div className="lattice-soft-card bg-[#dff4ff] p-4 md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#4d7b93]">Base city</p>
                <p className="font-cn mt-3 text-[16px] font-bold text-[#111111]">{star.baseCity}</p>
              </div>
              <div className="lattice-soft-card bg-[#d8f8c5] p-4 md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#4f7154]">Focus</p>
                <p className="font-cn mt-3 text-[16px] font-bold text-[#111111]">{star.spotlight.slice(0, 2).join(" / ")}</p>
              </div>
              <div className="lattice-soft-card bg-[#dcd7ff] p-4 md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#6460a1]">Updates</p>
                <p className="font-cn mt-3 text-[16px] font-bold text-[#111111]">
                  活动 {relatedEvents.length} · 动态 {relatedNews.length}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2 md:mt-7 md:gap-4">
              <div className="lattice-card p-4 md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Read this first</p>
                <h2 className="lattice-title mt-3 text-[24px] md:text-[30px]">Latest update.</h2>
                {latestNews ? (
                  <Link href={`/news/${latestNews.slug}`} className="mt-4 block rounded-[22px] bg-[#fbfaf7] p-4 transition hover:-translate-y-0.5 md:rounded-[24px]">
                    <p className="font-cn text-[14px] font-bold leading-[1.75] text-[#111111]">{latestNews.excerpt}</p>
                    <p className="font-en mt-3 text-[10px] text-[#6d7b7e]">{latestNews.title}</p>
                  </Link>
                ) : (
                  <div className="mt-4 rounded-[22px] bg-[#fbfaf7] p-4 md:rounded-[24px]">
                    <p className="font-cn text-[13px] leading-[1.8] text-[#6d7b7e]">这位艺人的最新动态还没进系统，等第一批发布后这里会优先出现最近一条。</p>
                  </div>
                )}
              </div>
              <div className="lattice-card p-4 md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Catch this next</p>
                <h2 className="lattice-title mt-3 text-[24px] md:text-[30px]">Next event.</h2>
                {nextEvent ? (
                  <Link href={`/events/${nextEvent.slug}`} className="mt-4 block rounded-[22px] bg-[#fbfaf7] p-4 transition hover:-translate-y-0.5 md:rounded-[24px]">
                    <p className="font-cn text-[14px] font-bold leading-[1.75] text-[#111111]">{nextEvent.summary}</p>
                    <p className="font-en mt-3 text-[10px] text-[#6d7b7e]">{nextEvent.title}</p>
                  </Link>
                ) : (
                  <div className="mt-4 rounded-[22px] bg-[#fbfaf7] p-4 md:rounded-[24px]">
                    <p className="font-cn text-[13px] leading-[1.8] text-[#6d7b7e]">这位艺人的下一场公开活动还没写进日历，后续一有活动就会先出现在这里。</p>
                  </div>
                )}
              </div>
            </div>
```

---

## 建议你直接发给 Claude 的补充说明

```text
Please review these key frontend files for visual direction and layout quality.

Important context:
- this project does NOT have tailwind.config.ts
- it uses a Tailwind 4 style setup, with design tokens and theme variables mostly inside src/app/globals.css
- the current direction is being rebuilt toward taifan.club, with:
  - white background
  - orange primary
  - Plus Jakarta Sans / Lora / Noto Sans SC
  - cleaner premium fan-entry layout

Please focus on:
1. whether the homepage visual system is coherent
2. whether the detail pages feel elegant or still too block-heavy
3. what should be redesigned next in the frontend layout system
4. concrete file-level advice, not abstract design language
```

