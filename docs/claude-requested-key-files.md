# 给 Claude 的关键前台文件包

说明：

- 当前项目 **没有** `tailwind.config.ts` 或 `tailwind.config.js`
- 这是一个 Tailwind 4 风格项目，很多全局设计变量直接放在 `src/app/globals.css`
- 以下内容按你要求整理：
  - `src/app/globals.css`：完整内容
  - `tailwind.config.ts / tailwind.config.js`：不存在，已注明
  - 导航栏组件：`src/components/layout/site-header.tsx`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`：前 200 行

---

## 1. `src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
  --font-heading: var(--font-serif);
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
  --font-sans: "Plus Jakarta Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  --font-serif: "Lora", Georgia, serif;
  --font-cn: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-en: "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", "Menlo", "Monaco", "Cascadia Mono", "Segoe UI Mono", monospace;
  --background: #fafafa;
  --foreground: #1c1c1e;
  --card: #ffffff;
  --card-foreground: #1c1c1e;
  --popover: #ffffff;
  --popover-foreground: #1c1c1e;
  --primary: #f07030;
  --primary-foreground: #ffffff;
  --secondary: #fff4ee;
  --secondary-foreground: #d95820;
  --muted: #f5f5f7;
  --muted-foreground: #6e6e73;
  --accent: #fff4ee;
  --accent-foreground: #d95820;
  --destructive: #b84c48;
  --border: #e8e8e8;
  --input: #e8e8e8;
  --ring: #ff9050;
  --chart-1: #f07030;
  --chart-2: #4a90d9;
  --chart-3: #4caf78;
  --chart-4: #9b6eff;
  --chart-5: #e84040;
  --radius: 18px;
  --sidebar: #ffffff;
  --sidebar-foreground: #1c1c1e;
  --sidebar-primary: #f07030;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #fff4ee;
  --sidebar-accent-foreground: #6e6e73;
  --sidebar-border: #e8e8e8;
  --sidebar-ring: #ff9050;
  --color-ink: #1c1c1e;
  --color-soft-ink: #6e6e73;
  --color-mint: #fff4ee;
  --color-lime: #ffeade;
  --color-lilac: #fff4ee;
  --color-rose: #ffeade;
  --color-sky: #fafafa;
  --color-surface: #fafafa;
  --color-surface-strong: #ffffff;
  --color-border-soft: #e8e8e8;
  --orange: #f07030;
  --orange-deep: #d95820;
  --orange-light: #ff9050;
  --orange-pale: #fff4ee;
  --orange-pale2: #ffeade;
  --bg: #fafafa;
  --bg2: #f5f5f7;
  --divider: #e8e8e8;
  --charcoal: #1c1c1e;
  --mid: #6e6e73;
  --light: #aeaeb2;
  --nav-h: 68px;
  --pad-x: 80px;
  --radius-sm-ui: 10px;
  --shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.1);
  --shadow-orange: 0 8px 28px rgba(240, 112, 48, 0.22);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    background-color: #ffffff;
    background-image: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
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

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #ffeade;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #f07030;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@layer utilities {
  .animate-fadeUp {
    animation: fadeUp 0.6s ease both;
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease both;
  }
  .animate-scaleIn {
    animation: scaleIn 0.25s ease both;
  }
  .text-balance {
    text-wrap: balance;
  }
  .font-cn {
    font-family: var(--font-cn);
  }
  .font-en {
    font-family: var(--font-en);
  }
  .font-serif {
    font-family: var(--font-serif);
  }
  .page-shell {
    padding-left: min(6vw, var(--pad-x));
    padding-right: min(6vw, var(--pad-x));
  }
  .section-gap {
    padding-top: clamp(60px, 6vw, 88px);
    padding-bottom: clamp(60px, 6vw, 88px);
  }
  .lattice-card {
    border-radius: var(--radius);
    border: 1px solid var(--divider);
    background: white;
    box-shadow: var(--shadow);
  }
  .lattice-soft-card {
    border-radius: var(--radius);
    border: 1px solid var(--divider);
    box-shadow: var(--shadow);
  }
  .lattice-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: var(--orange-pale);
    padding: 0.75rem 1.125rem;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--orange);
  }
  .lattice-title {
    font-family: var(--font-sans);
    font-weight: 800;
    letter-spacing: -0.055em;
    color: var(--charcoal);
  }
  .ui-note {
    color: var(--mid);
  }
  .ui-note-strong {
    color: var(--charcoal);
  }
  .ui-chip {
    border-radius: 999px;
    background: var(--bg2);
    padding: 0.5rem 0.875rem;
    font-family: var(--font-cn);
    font-size: 0.75rem;
    line-height: 1;
    color: var(--mid);
  }
  .ui-button-dark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: var(--charcoal);
    padding: 0.8rem 1.35rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    transition: background 160ms ease, transform 160ms ease;
  }
  .ui-button-dark:hover {
    background: #2c2c2e;
  }
  .ui-button-soft {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 999px;
    background: var(--orange);
    padding: 0.8rem 1.35rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
    transition: background 160ms ease, transform 160ms ease;
    box-shadow: var(--shadow-orange);
  }
  .ui-button-soft:hover {
    background: var(--orange-deep);
  }
}
```

---

## 2. `tailwind.config.ts / tailwind.config.js`

当前项目里 **没有这两个文件**。

说明：

- 这是 Tailwind 4 风格项目
- 颜色、字体、半径、阴影等全局设计变量直接放在 `src/app/globals.css`
- 所以如果你要判断设计系统，请以 `globals.css` 为准

---

## 3. 导航栏组件 `src/components/layout/site-header.tsx`

```tsx
import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";

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
    <header className="fixed left-0 right-0 top-0 z-50 h-[68px] border-b border-[#f07030]/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[80px] md:px-8 sm:px-[18px]">
        <Link href="/" className="flex items-center gap-3 text-[#1c1c1e]">
          <div>
            <p className="font-cn text-[22px] font-extrabold tracking-tight text-[#1c1c1e]">
              泰<span className="text-[#f07030]">饭</span>网
            </p>
            <p className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[#aeaeb2]">taifan.club</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-cn text-[13px] font-semibold tracking-[0.02em] text-[#6e6e73] transition-colors duration-200 hover:text-[#f07030]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4ee] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f07030]">
            <ShieldCheck className="h-3.5 w-3.5" />
            已审核内容
          </span>
          <button
            type="button"
            aria-label="搜索"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6e6e73] transition-colors duration-200 hover:text-[#f07030]"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8e8e8] px-5 py-2 text-[13px] font-bold text-[#1c1c1e] transition-all duration-200 hover:border-[#f07030] hover:text-[#f07030]"
          >
            🛒 购物车
          </button>
          <button
            type="button"
            className="shadow-[0_8px_28px_rgba(240,112,48,0.22)] inline-flex items-center gap-2 rounded-full bg-[#f07030] px-5 py-2 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#d95820]"
          >
            立即预约
          </button>
        </div>

        <Sheet>
          <SheetTrigger
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1c1c1e] transition-colors duration-200 hover:bg-[#fff4ee] lg:hidden",
            )}
          >
            <span className="flex flex-col gap-[5px] p-1">
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
            </span>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-[#e8e8e8] bg-white text-[#1c1c1e]">
            <SheetHeader>
              <SheetTitle className="font-cn text-[#1c1c1e]">站点导航</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-[#e8e8e8] py-3 font-cn text-[15px] font-bold text-[#1c1c1e]"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="mt-6 rounded-[10px] bg-[#f07030] py-[14px] text-center font-cn text-[15px] font-extrabold text-white transition-all duration-200 hover:bg-[#d95820]"
              >
                立即预约
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

---

## 4. `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Lora, Noto_Sans_SC, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { siteConfig } from "@/lib/constants";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-cn",
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
    <html lang="zh-CN" className={`h-full antialiased ${plusJakartaSans.variable} ${lora.variable} ${notoSansSc.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
```

---

## 5. `src/app/page.tsx`（前 200 行）

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
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-[150px] -top-[150px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(240,112,48,0.10)_0%,transparent_70%)]" />
        <div className="page-shell mx-auto grid max-w-[1280px] gap-8 pb-[60px] pt-[116px] lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-3 rounded-full bg-[#fff4ee] px-5 py-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#f07030]">
              Thai entertainment in Chinese
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f07030] text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </span>
            <h1 className="mt-7 font-sans text-[clamp(42px,5.5vw,80px)] font-extrabold leading-[0.94] tracking-tight text-[#1c1c1e]">
              Track
              <span className="text-[#f07030]"> stars.</span>
              <br />
              Catch
              <span className="text-[#f07030]"> everything.</span>
            </h1>
            <p className="font-cn mt-5 max-w-[460px] text-[17px] font-normal leading-[1.8] text-[#6e6e73]">
              把泰国明星活动、品牌行程、粉丝见面会和官方动态，整理成中文入口。你看得懂中文，但活动名、场馆名、品牌名继续保留原文，后续搜票、找地图、核对官宣都会更顺。
            </p>
            <div className="mt-7 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 rounded-full bg-[#f07030] px-8 py-[14px] text-[15px] font-extrabold text-white shadow-[0_8px_28px_rgba(240,112,48,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d95820]"
              >
                Explore events
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8e8e8] bg-transparent px-8 py-[14px] text-[15px] font-extrabold text-[#1c1c1e] transition-all duration-200 hover:border-[#f07030] hover:text-[#f07030]"
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
              <div className="rounded-[18px] bg-[#fafafa] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f07030]">Search with</p>
                <p className="font-en mt-3 text-[20px] font-black tracking-tight text-[#1c1c1e]">{featuredStar?.nameEn}</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6e6e73]">艺人原文名、品牌原文名、活动原文标题都继续保留，方便后续搜官方帖和票务页。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f07030]">Today’s route</p>
                <p className="font-cn mt-3 text-[14px] font-bold text-[#1c1c1e]">先看动态，再决定要不要追活动</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6e6e73]">如果你今天只想花几分钟，先补中文快读，再去看海报和现场安排。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f07030]">Why this works</p>
                <p className="font-cn mt-3 text-[14px] font-bold text-[#1c1c1e]">先给海报，再给路线</p>
                <p className="font-cn mt-3 text-[12px] leading-[1.75] text-[#6e6e73]">这不是只刷图的海报站，而是先用海报吸引你，再把最值的活动线和信息入口交给你。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap page-shell mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8fdc8a]">我们的使命</p>
          <h2 className="lattice-title mt-4 text-[44px] leading-[1.02] md:text-[64px]">
            降低追星门槛
```

