# Claude Frontend Key Files Bundle

This file is prepared so Claude can review the current frontend without needing a GitHub repository.

Please review these files as the current source of truth for frontend styling, layout, and homepage structure.

Focus on:

1. overall visual direction
2. typography system
3. color system
4. homepage layout quality
5. header / footer consistency
6. what should be redesigned first if the current design still feels awkward

Project note:

- This is a Next.js app
- The site is for Chinese users following Thai entertainment
- The preferred direction is:
  - white background
  - pastel cards
  - bold black English headings
  - many celebrity photos / promo posters
  - cleaner and more elegant editorial fan-entry layout

---

## `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

---

## `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_SC } from "next/font/google";
import { Toaster } from "sonner";

import { siteConfig } from "@/lib/constants";
import "./globals.css";

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-cn",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  ...(siteConfig.hasPublicSiteUrl
    ? {
        metadataBase: new URL(siteConfig.siteUrl),
      }
    : {}),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.siteName,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.siteName,
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.hasPublicSiteUrl ? { url: siteConfig.siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${notoSansSc.variable} ${dmSans.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
```

---

## `src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --font-sans: "DM Sans", "Helvetica Neue", Arial, sans-serif;
  --font-cn: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-en: "DM Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", "Menlo", "Monaco", "Cascadia Mono", "Segoe UI Mono", monospace;
  --background: #fbfaf7;
  --foreground: #102327;
  --card: #ffffff;
  --card-foreground: #102327;
  --popover: #ffffff;
  --popover-foreground: #102327;
  --primary: #123136;
  --primary-foreground: #ffffff;
  --secondary: #d8f8c5;
  --secondary-foreground: #315c32;
  --muted: #f4f1ec;
  --muted-foreground: #68767a;
  --accent: #edf4ff;
  --accent-foreground: #32556c;
  --destructive: #b84c48;
  --border: #ece6dc;
  --input: #ece6dc;
  --ring: #7fd68a;
  --chart-1: #d8ccff;
  --chart-2: #f8dfe9;
  --chart-3: #dff4ff;
  --chart-4: #eef7bf;
  --chart-5: #102327;
  --radius: 1.75rem;
  --sidebar: #ffffff;
  --sidebar-foreground: #102327;
  --sidebar-primary: #123136;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f4f1ec;
  --sidebar-accent-foreground: #68767a;
  --sidebar-border: #ece6dc;
  --sidebar-ring: #7fd68a;
  --color-ink: #102327;
  --color-soft-ink: #5f7074;
  --color-mint: #d8f8c5;
  --color-lime: #e6f3a9;
  --color-lilac: #dcd7ff;
  --color-rose: #f7dfe9;
  --color-sky: #dff4ff;
  --color-surface: #fbfaf7;
  --color-surface-strong: #ffffff;
  --color-border-soft: #ece6dc;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    background-image: linear-gradient(180deg, #fffdf9 0%, #fbfaf7 100%);
    font-family: var(--font-sans);
  }
  html {
    @apply font-sans;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  li,
  button,
  a,
  label {
    font-family: var(--font-cn);
  }
  code,
  time {
    font-family: var(--font-sans);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .font-cn {
    font-family: var(--font-cn);
  }
  .font-en {
    font-family: var(--font-en);
  }
  .page-shell {
    padding-left: min(6vw, 80px);
    padding-right: min(6vw, 80px);
  }
  .section-gap {
    padding-top: clamp(40px, 5vw, 64px);
    padding-bottom: clamp(40px, 5vw, 64px);
  }
  .lattice-card {
    border-radius: 2rem;
    border: 1px solid rgba(16, 35, 39, 0.08);
    background: white;
    box-shadow: 0 14px 40px rgba(16, 35, 39, 0.08);
  }
  .lattice-soft-card {
    border-radius: 2rem;
    border: 1px solid rgba(16, 35, 39, 0.06);
    box-shadow: 0 12px 32px rgba(16, 35, 39, 0.06);
  }
  .lattice-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: #d8f8c5;
    padding: 0.75rem 1.125rem;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 700;
    color: #315c32;
  }
  .lattice-title {
    font-family: var(--font-en);
    font-weight: 900;
    letter-spacing: -0.06em;
    color: #102327;
  }
  .ui-note {
    color: #617176;
  }
  .ui-note-strong {
    color: #4f6166;
  }
  .ui-chip {
    border-radius: 999px;
    background: #f4f1ec;
    padding: 0.5rem 0.875rem;
    font-family: var(--font-cn);
    font-size: 0.75rem;
    line-height: 1;
    color: #617176;
  }
  .ui-button-dark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: #102327;
    padding: 0.8rem 1.35rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    transition: background 160ms ease, transform 160ms ease;
  }
  .ui-button-dark:hover {
    background: #173238;
  }
  .ui-button-soft {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: #d8f8c5;
    padding: 0.8rem 1.35rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    color: #315c32;
    transition: background 160ms ease, transform 160ms ease;
  }
  .ui-button-soft:hover {
    background: #c8f1b1;
  }
}
```

---

## `src/components/layout/site-header.tsx`

```tsx
import Link from "next/link";
import { Menu, Search, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ece6dc] bg-[#fbfaf7]/92 backdrop-blur">
      <div className="page-shell mx-auto flex max-w-[1440px] items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-[#102327]">
          <div>
            <p className="font-en text-sm font-black uppercase tracking-[0.18em]">
              THAISTAR<span className="px-1 text-[#8fdc8a]">·</span>BRIDGE
            </p>
            <p className="font-cn text-lg font-bold">泰娱桥</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-cn ui-note text-[13px] tracking-[0.02em] transition hover:text-[#102327]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f8dfe9] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8d5162]">
            <ShieldCheck className="h-3.5 w-3.5" />
            已审核内容
          </span>
          <button type="button" aria-label="搜索" className="inline-flex h-10 w-10 items-center justify-center ui-note transition hover:text-[#102327]">
            <Search className="h-4.5 w-4.5" />
          </button>
        </div>

        <Sheet>
          <SheetTrigger
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full text-[#102327] hover:bg-[#eef4ff] lg:hidden",
            )}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-[#ece6dc] bg-[#fbfaf7] text-[#102327]">
            <SheetHeader>
              <SheetTitle className="font-cn text-[#102327]">站点导航</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-5">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className="font-cn ui-note text-base">
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

---

## `src/components/layout/site-footer.tsx`

```tsx
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ece6dc] bg-[#fbfaf7]">
      <div className="page-shell mx-auto flex max-w-[1440px] flex-col gap-6 py-10 text-sm ui-note">
        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          <div>
            <p className="font-en text-sm font-black uppercase tracking-[0.18em] text-[#102327]">
            THAISTAR<span className="px-1 text-[#8fdc8a]">·</span>BRIDGE
            <span className="font-cn pl-2 text-base font-bold normal-case">泰娱桥</span>
            </p>
            <p className="mt-2 max-w-2xl font-cn leading-[1.8]">
              中文整理，官方来源优先。把活动、品牌行程、粉丝见面会和实时动态整理成更适合中国粉丝理解和使用的入口。
            </p>
          </div>
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#dff4ff_0%,#f7dfe9_100%)] p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">Keep exploring</p>
            <p className="font-en mt-3 text-[28px] font-black tracking-[-0.04em] text-[#102327]">Keep every name searchable.</p>
            <p className="mt-3 font-cn leading-[1.8] ui-note-strong">
              先看中文解释，再拿着艺人原文名、场馆原文名、品牌原文标题继续搜票、搜地图、搜官方帖。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 font-cn ui-note-strong">
          <Link href="/guides">关于本站</Link>
          <Link href="/news?source=official">来源说明</Link>
          <Link href="/guides">新粉攻略</Link>
          <Link href="/services">服务支持</Link>
        </div>
        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#95a0a4]">
          Original names kept for search, maps, tickets, and official verification.
        </p>
      </div>
    </footer>
  );
}
```

---

## `src/app/page.tsx` (homepage, first ~220 lines)

```tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { SiteShell } from "@/components/layout/site-shell";
import { listEvents, listNews, listStars } from "@/lib/data";
import { getContentTagTheme } from "@/lib/content-tag-theme";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";
import { officialSourceCatalog } from "@/lib/source-catalog";

const PANEL_TONES = [
  "bg-[#dcd7ff]",
  "bg-[#f7dfe9]",
  "bg-[#dff4ff]",
  "bg-[#eef7bf]",
];

const POSTER_TONES = ["#dcd7ff", "#f7dfe9", "#dff4ff", "#eef7bf"];

export const metadata: Metadata = buildPageMetadata({
  title: "泰国明星活动中文入口",
  description: "用中文追踪泰国明星活动、品牌行程、粉丝见面会和官方动态，保留原文标题、场馆名和品牌名，降低追星门槛。",
  path: "/",
});

export default async function HomePage() {
  const [events, newsItems, stars] = await Promise.all([listEvents(), listNews(), listStars()]);
  const showLiveDataWarning =
    process.env.NODE_ENV === "production" && stars.length === 0 && events.length === 0 && newsItems.length === 0;
  const focusStars = stars.slice(0, 4);
  const upcomingEvents = events.slice(0, 6);
  const latestNews = newsItems.slice(0, 6);
  const archiveNews = newsItems.slice(6, 12);
  const featuredStar = focusStars[0];
  const homepageStats = [
    { value: `${events.length}`, label: "活动条目" },
    { value: `${stars.length}`, label: "追踪明星" },
    { value: `${newsItems.length}`, label: "已发布快读" },
    { value: `${officialSourceCatalog.filter((source) => source.active !== false).length}`, label: "官方来源" },
  ];
  const focusEditorialPicks = focusStars.map((star) => {
    const latestStarNews = newsItems.find((item) => item.relatedStars.includes(star.slug));
    return {
      star,
      pick:
        star.milestones?.[0] ??
        latestStarNews?.excerpt ??
        `${star.nameEn} 最近更适合从 ${star.spotlight.slice(0, 2).join(" / ")} 这条线开始追。`,
      relatedSlug: latestStarNews?.slug,
    };
  });

  return (
    <SiteShell>
      {showLiveDataWarning ? (
        <section className="page-shell mx-auto mt-6 max-w-[1440px]">
          <div className="rounded-[28px] border border-[#ece6dc] bg-white p-5 shadow-[0_18px_45px_rgba(16,35,39,0.08)]">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8d5162]">Live data required</p>
            <p className="font-cn mt-3 text-[14px] leading-[1.85] text-[#5f7074]">
              当前正式环境还没有读到真实活动、动态和明星数据，所以站点不会再自动回退到示例内容。请先检查 Supabase 连接、环境变量和已发布内容状态。
            </p>
          </div>
        </section>
      ) : null}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#dde4ff_0%,transparent_26%),radial-gradient(circle_at_bottom_left,#eff8b9_0%,transparent_18%),linear-gradient(180deg,#fffdfa_0%,#fbfaf7_100%)]">
        <div className="page-shell mx-auto grid min-h-[640px] max-w-[1440px] gap-8 py-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-10 lg:py-14">
          <div className="max-w-[760px]">
            <span className="lattice-pill">
              Thai entertainment in Chinese
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8fdc8a] text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </span>
            <h1 className="lattice-title mt-7 text-[44px] leading-[0.94] md:text-[76px] lg:text-[96px]">
              Track stars.
              <br />
              Catch everything.
            </h1>
            <p className="font-cn mt-5 max-w-[680px] text-[15px] leading-[1.82] text-[#6d7b7e] md:text-[18px] md:leading-[1.9]">
              把泰国明星活动、品牌行程、粉丝见面会和官方动态，整理成中文入口。你看得懂中文，但活动名、场馆名、品牌名继续保留原文，后续搜票、找地图、核对官宣都会更顺。
            </p>
            <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/calendar"
                className="inline-flex items-center justify-center rounded-full bg-[#102327] px-5 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(16,35,39,0.18)] transition hover:bg-[#173238] md:px-6 md:py-4 md:text-[18px]"
              >
                Explore events
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center justify-center rounded-full bg-[#d8f8c5] px-5 py-3 text-[15px] font-bold text-[#315c32] shadow-[0_10px_24px_rgba(143,220,138,0.22)] transition hover:bg-[#c8f1b1] md:px-6 md:py-4 md:text-[18px]"
              >
                Latest updates
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:pl-4">
            <div className="lattice-card rounded-[32px] bg-white p-4 text-[#102327] md:rounded-[42px] md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="font-sans inline-flex items-center gap-2 rounded-full bg-[#d8f8c5] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#315c32]">
                  Cover story
                  <span className="h-2 w-2 rounded-full bg-[#8fdc8a]" />
                </span>
                <span className="font-cn rounded-full bg-[#f7dfe9] px-3 py-1 text-[11px] text-[#8d5162]">已审核内容 + 官方来源优先</span>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-[1.05fr_0.95fr] md:mt-6 md:gap-4">
                <div className="relative min-h-[320px] overflow-hidden rounded-[26px] bg-[#dcd7ff] md:min-h-[440px] md:rounded-[34px]">
                  {featuredStar?.coverUrl ? (
                    <Image
                      src={featuredStar.coverUrl}
                      alt={featuredStar.nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(featuredStar.coverUrl, "hero") }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.04)_0%,rgba(16,35,39,0.72)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/78">This week’s lead</p>
                      <p className="font-en mt-2 text-[28px] font-black leading-[0.96] tracking-[-0.04em] text-white md:mt-3 md:text-[48px]">
                      {featuredStar?.nameEn}
                    </p>
                      <p className="font-cn mt-2 max-w-[420px] text-[12px] leading-[1.72] text-white/86 md:mt-3 md:text-[13px] md:leading-[1.8]">
                      先看这位最近的活动密度、最新动态和原文搜索关键词，再决定要不要继续追现场、品牌活动或票务安排。
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                  {focusStars.map((star, index) => {
                    const eventCount = events.filter((event) => event.starSlugs.includes(star.slug)).length;
                    const newsCount = newsItems.filter((item) => item.relatedStars.includes(star.slug)).length;
                    return (
                      <div key={`${star.slug}-hero-poster`} className="lattice-soft-card overflow-hidden rounded-[22px] bg-white p-3 md:rounded-[28px]">
                        <div className="relative min-h-[180px] overflow-hidden rounded-[18px] md:min-h-[210px] md:rounded-[24px]" style={{ backgroundColor: POSTER_TONES[index % POSTER_TONES.length] }}>
                          {star.coverUrl ? (
                            <Image
                              src={star.coverUrl}
                              alt={star.nameEn}
                              fill
                              className="object-cover"
                              style={{ objectPosition: getImageObjectPosition(star.coverUrl, "poster") }}
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,35,39,0.02)_0%,rgba(16,35,39,0.58)_100%)]" />
                          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                            <p className="font-en text-[18px] font-black tracking-[-0.04em] text-white md:text-[20px]">{star.nameEn}</p>
                            <p className="font-cn mt-1 text-[11px] text-white/82">{star.nameCn}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-1 pt-3 md:gap-3 md:p-2 md:pt-4">
                          <div className="rounded-[16px] bg-[#fbfaf7] px-3 py-3 md:rounded-[18px]">
                            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#6d7b7e]">Events</p>
                            <p className="font-en mt-2 text-[22px] font-black text-[#102327]">{eventCount}</p>
                          </div>
                          <div className="rounded-[16px] bg-[#fbfaf7] px-3 py-3 md:rounded-[18px]">
                            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#6d7b7e]">News</p>
                            <p className="font-en mt-2 text-[22px] font-black text-[#102327]">{newsCount}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 md:gap-4">
              <div className="lattice-soft-card rounded-[24px] bg-[#dff4ff] p-4 md:rounded-[30px] md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#4d7b93]">Search with</p>
                <p className="font-en mt-3 text-[20px] font-black tracking-[-0.03em] text-[#102327]">{featuredStar?.nameEn}</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6d7b7e]">艺人原文名、品牌原文名、活动原文标题都继续保留，方便后续搜官方帖和票务页。</p>
              </div>
              <div className="lattice-soft-card rounded-[24px] bg-[#f7dfe9] p-4 md:rounded-[30px] md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8d5162]">Today’s route</p>
                <p className="font-cn mt-3 text-[14px] font-bold text-[#102327]">先看动态，再决定要不要追活动</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6d7b7e]">如果你今天只想花几分钟，先补中文快读，再去看海报和现场安排。</p>
              </div>
              <div className="lattice-soft-card rounded-[24px] bg-[#eef7bf] p-4 md:rounded-[30px] md:p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#708230]">Why this works</p>
                <p className="font-cn mt-3 text-[14px] font-bold text-[#102327]">先给海报，再给路线</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6d7b7e]">这不是只刷图的海报站，而是先用海报吸引你，再把最值的活动线和信息入口交给你。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
```

---

## Suggested prompt to send with this bundle

```text
Please review these frontend key files for taifan.club.

I want you to focus on:
1. whether the current visual system is actually elegant
2. whether the layout still feels too blocky or stacked
3. whether typography and colors are helping or hurting
4. what should change first in the homepage layout system
5. concrete redesign advice for Codex, with file-by-file instructions

Important:
- I do NOT want vague design language
- I want concrete replacement direction
- If the current system is flawed, say exactly which parts are flawed
- Please tell me what to change in globals.css, layout.tsx, header/footer, and homepage
```
