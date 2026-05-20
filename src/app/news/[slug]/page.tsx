import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Clock3,
  FileText,
  Radio,
  Search,
  Sparkles,
  Tags,
  UserRound,
} from "lucide-react";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getNewsDetail } from "@/lib/data";
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
  const articleParagraphs = news.bodyMd.split(/\n{2,}/).filter(Boolean);
  const readMinutes = Math.max(1, Math.round(articleParagraphs.join("").length / 220));
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
      name: "泰饭网 taifan.club",
    },
    publisher: {
      "@type": "Organization",
      name: "泰饭网 taifan.club",
    },
    image: undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/news/${news.slug}`,
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <section className="page-shell mx-auto max-w-[1040px] py-10 md:py-14">
        <div className="border-b border-[#ece7df] pb-8 md:pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-icon-badge">
              <Radio size={14} />
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
              News desk
            </span>
            {news.editorialMode === "daily-auto" ? (
              <span className="ui-chip">今日自动整理</span>
            ) : (
              <span className="ui-chip">人工整理</span>
            )}
            <span className="ui-chip">{news.category}</span>
          </div>
          <h1 className="mt-4 font-sans text-[34px] font-black leading-[0.98] tracking-[-0.04em] text-[#111111] md:text-[64px]">
            {news.title}
          </h1>
          <p className="font-cn mt-5 max-w-[780px] text-[15px] leading-[1.95] text-[#3c3c43]">
            {news.excerpt}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <Clock3 size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Read time
                </p>
              </div>
              <p className="mt-3 font-en text-[24px] font-black text-[#111111]">{readMinutes} min</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <UserRound size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Linked stars
                </p>
              </div>
              <p className="mt-3 font-en text-[24px] font-black text-[#111111]">{stars.length}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white p-4">
              <div className="flex items-center gap-2">
                <Tags size={14} className="text-[#f07030]" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#a56a44]">
                  Desk date
                </p>
              </div>
              <p className="mt-3 font-en text-[20px] font-black text-[#111111]">
                {format(new Date(news.publishedAt), "M.d", { locale: zhCN })}
              </p>
            </div>
          </div>
          <div className="mt-5 editorial-inline-note">
            <Sparkles size={14} />
            <span>这页先负责帮你看懂内容，再把原始标题、来源和人物名交给你继续搜原始官宣。</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div className="space-y-8">
            <section className="rounded-[24px] border border-[#ece7df] bg-white p-6 md:p-7">
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <FileText size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  What happened
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {articleParagraphs.map((paragraph, index) => (
                  <div key={`${index}-${paragraph.slice(0, 12)}`} className="rounded-[18px] bg-[#faf7f3] p-4">
                    <p className="font-cn text-[14px] leading-[1.95] text-[#3c3c43]">{paragraph}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2">
                <span className="editorial-icon-badge">
                  <Search size={14} />
                </span>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">
                  Search with these names
                </p>
              </div>
              <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.03em] text-[#111111] md:text-[36px]">
                Keep the original words
              </h2>
              <p className="font-cn mt-3 text-[14px] leading-[1.9] text-[#6e6e73]">
                如果你准备继续搜原始官宣、品牌帖或站外讨论，先保留原始标题、来源账号和艺人英文名，会比只记中文摘要更好用。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="ui-chip">{news.title}</span>
                <span className="ui-chip">{news.sourceLabel ?? "站内整理来源"}</span>
                {stars.slice(0, 4).map((star) => (
                  <span key={star.slug} className="ui-chip">
                    {star.nameEn}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[92px]">
            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Source
              </p>
              <p className="mt-3 font-cn text-[13px] font-bold leading-[1.8] text-[#111111]">
                {news.sourceLabel ?? "站内整理来源"}
              </p>
              {news.sourceUrl ? (
                <Link
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 font-sans text-[12px] font-bold text-[#f07030]"
                >
                  打开原始链接
                  <FileText size={12} />
                </Link>
              ) : null}
            </div>

            <div className="rounded-[22px] border border-[#ece7df] bg-white p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">
                Linked stars
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stars.length ? (
                  stars.map((star) => <span key={star.slug} className="ui-chip">{star.nameEn}</span>)
                ) : (
                  <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">这条整理暂时没有挂到具体艺人。</p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Link href="/news" className="rounded-[22px] border border-[#ece7df] bg-[#f0f8ff] p-5 transition hover:-translate-y-0.5">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Next step</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Back to the desk
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">继续补同一天或同一位艺人的其他动态。</p>
              </Link>
              <Link
                href={leadStar ? `/stars/${leadStar.slug}` : "/news"}
                className="rounded-[22px] border border-[#ece7df] bg-[#fff4ee] p-5 transition hover:-translate-y-0.5"
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#f07030]">Follow the face</p>
                <p className="mt-3 font-sans text-[22px] font-black tracking-[-0.03em] text-[#111111]">
                  Open the star page
                </p>
                <p className="mt-2 font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你是第一次认识这位艺人，就直接去看他的入门资料和必看 3 条。</p>
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
  const detail = await getNewsDetail(slug);

  if (!detail) {
    return buildPageMetadata({
      title: "动态详情",
      description: "查看泰国明星动态的中文快读、原始标题、来源说明与原始链接。",
      path: `/news/${slug}`,
    });
  }

  const { news, stars } = detail;
  const leadStar = stars[0];

  return buildPageMetadata({
    title: `${news.title} | 明星动态`,
    description: `${leadStar ? `${leadStar.nameEn} 相关动态：` : ""}${news.excerpt} ${news.sourceLabel ? `来源：${news.sourceLabel}。` : ""}中文快读 + 原文保留，方便继续搜索和核对。`,
    path: `/news/${news.slug}`,
    image: undefined,
  });
}
