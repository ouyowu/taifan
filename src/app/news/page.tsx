import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Newspaper, Radio, Tags, UserRound } from "lucide-react";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { listNews, listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { primarySourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "明星动态",
  description: "用中文快读追踪官宣、品牌活动、直播与票务更新。",
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

  const categories = Array.from(new Set(newsItems.map((item) => item.category))).filter(Boolean);
  const sourceFilter = params.source === "official" ? "official" : "all";
  const categoryFilter = categories.includes(params.category ?? "") ? (params.category as string) : "all";

  const sourceVisible =
    sourceFilter === "official" ? newsItems.filter((item) => Boolean(item.sourceLabel)) : newsItems;
  const visibleNews =
    categoryFilter === "all"
      ? sourceVisible
      : sourceVisible.filter((item) => item.category === categoryFilter);

  const lead = visibleNews[0];
  const rest = visibleNews.slice(1);
  const linkedStars = stars.slice(0, 8);

  return (
    <SiteShell>
      <section className="editorial-page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="editorial-kicker">News desk</p>
            <h1 className="mt-4 font-sans text-[clamp(38px,6vw,84px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              明星动态
              <br />
              把碎片更新整理成可读内容。
            </h1>
            <p className="font-cn mt-6 max-w-[760px] text-[16px] leading-[1.95] text-[#5d6268]">
              这页改成真正的编辑 desk：一条 lead story，下面接 front-page 列表，再给来源和人物线索。没有图片也不影响阅读，因为重点本来就该是标题、摘要、时间和人物。
            </p>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">Desk stats</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Newspaper className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{visibleNews.length}</p>
                <p className="editorial-brief-label">当前动态</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Tags className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{categories.length}</p>
                <p className="editorial-brief-label">分类</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Radio className="h-4 w-4" /></span>
                <p className="editorial-brief-number">
                  {new Set(visibleNews.map((item) => item.sourceLabel).filter(Boolean)).size}
                </p>
                <p className="editorial-brief-label">来源数</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><UserRound className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{linkedStars.length}</p>
                <p className="editorial-brief-label">重点艺人</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/news"
            className={sourceFilter === "all" && categoryFilter === "all" ? "editorial-chip" : "editorial-chip-muted"}
          >
            全部
          </Link>
          <Link
            href={`/news?source=official${categoryFilter !== "all" ? `&category=${encodeURIComponent(categoryFilter)}` : ""}`}
            className={sourceFilter === "official" ? "editorial-chip" : "editorial-chip-muted"}
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
                className={categoryFilter === category ? "editorial-chip" : "editorial-chip-muted"}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {lead ? (
              <article className="editorial-lead-card">
                <p className="editorial-kicker">Lead story</p>
                <h2 className="mt-4 font-cn text-[24px] font-bold leading-[1.5] text-[#1c1c1e] md:text-[32px]">
                  {lead.excerpt}
                </h2>
                <p className="font-en mt-4 text-[14px] font-bold text-[#f07030]">{lead.title}</p>
                <div className="editorial-inline-note mt-4">
                  <Newspaper className="h-4 w-4" />
                  <span>Lead story 用来告诉你今天先看哪条，不必先从列表最底部开始翻。</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="editorial-chip-muted">{lead.category}</span>
                  <span className="editorial-meta">
                    {format(new Date(lead.publishedAt), "yyyy.MM.dd HH:mm", { locale: zhCN })}
                  </span>
                  <span className="editorial-meta">{lead.sourceLabel ?? "站内整理来源"}</span>
                </div>
                <div className="mt-6">
                  <Link href={`/news/${lead.slug}`} className="editorial-link">
                    进入全文 →
                  </Link>
                </div>
              </article>
            ) : (
              <div className="editorial-empty-card">
                <p className="editorial-kicker">Newsroom check</p>
                <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e]">
                  还没有可公开展示的动态
                </h2>
                <p className="font-cn mt-3 text-[14px] leading-[1.9] text-[#666b70]">
                  先去后台做一次人工试抓，再手动新增 2 到 5 条动态，这页就会亮起来。
                </p>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {rest.map((item, index) => (
                <Link key={item.slug} href={`/news/${item.slug}`} className="editorial-directory-row">
                  <div className="flex items-start gap-4">
                    <span className="editorial-list-index">{String(index + 2).padStart(2, "0")}</span>
                    <div>
                      <p className="font-cn text-[15px] font-bold leading-[1.75] text-[#1c1c1e]">{item.excerpt}</p>
                      <p className="font-en mt-2 text-[12px] text-[#7a7f85]">{item.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-cn text-[12px] text-[#f07030]">{item.category}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#7a7f85]">
                      {format(new Date(item.publishedAt), "M 月 d 日", { locale: zhCN })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="editorial-sidebar-block">
              <p className="editorial-kicker">Source lanes</p>
              <div className="mt-4 space-y-3">
                {primarySourceShowcaseEntries.map((entry) => (
                  <Link key={entry.slug} href={entry.url} className="editorial-list-card-compact">
                    <div>
                      <p className="font-en text-[14px] font-black text-[#1c1c1e]">{entry.company}</p>
                      <p className="font-cn mt-1 text-[12px] leading-[1.75] text-[#6c7076]">{entry.title}</p>
                    </div>
                    <span className="editorial-chip-muted">
                      {entry.ingestion?.mode === "youtube-videos"
                        ? "视频"
                        : entry.ingestion?.mode === "facebook-posts"
                          ? "预售"
                          : "官网"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="editorial-sidebar-block">
              <p className="editorial-kicker">Linked stars</p>
              <div className="mt-4 space-y-3">
                {linkedStars.map((star) => (
                  <Link key={star.slug} href={`/stars/${star.slug}`} className="editorial-list-card-compact">
                    <div>
                      <p className="font-en text-[14px] font-black text-[#1c1c1e]">{star.nameEn}</p>
                      <p className="font-cn mt-1 text-[12px] text-[#6c7076]">{star.nameCn}</p>
                    </div>
                    <span className="editorial-chip-muted">{star.agency.split(" ")[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
