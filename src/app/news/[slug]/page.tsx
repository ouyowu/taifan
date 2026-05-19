import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/constants";
import { getNewsDetail } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";

const COMPANY_ACCENT: Record<string, string> = {
  GMMTV: "#f07030",
  "Studio Wabi Sabi": "#e0a030",
  "BeOnCloud": "#4d7b93",
  "Me Mind Y": "#8b5cf6",
  "GDH": "#708230",
  "Open Label": "#e05080",
  "DoMunDi TV": "#30a0b0",
};

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
  const accent = COMPANY_ACCENT[leadStar?.agency ?? ""] ?? "#f07030";
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
      name: "ThaiStar Bridge / 泰娱桥",
    },
    publisher: {
      "@type": "Organization",
      name: "ThaiStar Bridge / 泰娱桥",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <section className="page-shell mx-auto max-w-[1040px] py-12 md:py-16">
        <div className="flex items-start gap-4 md:gap-5">
          <div
            className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full md:h-[78px] md:w-[78px]"
            style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}55)` }}
          >
            <span className="select-none font-en text-[28px] font-black text-white/20">
              {leadStar?.nameEn.charAt(0) ?? "T"}
            </span>
          </div>
          <div>
            <p className="lattice-title text-[24px]">{leadStar?.nameEn ?? "ThaiStar Bridge Desk"}</p>
            <p className="font-sans mt-1 text-[11px] text-[#6e6e73]">Newsroom / 中文整理快读</p>
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Original Title</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="font-cn rounded-full bg-[#f4f1ec] px-3 py-1 text-[11px] text-[#6e6e73]">
              {news.category}
            </span>
            {news.editorialMode === "daily-auto" ? (
              <span className="font-cn rounded-full bg-[#1c1c1e] px-3 py-1 text-[11px] text-white">
                今日自动整理
              </span>
            ) : null}
          </div>
          <h1 className="lattice-title mt-3 text-[38px] leading-[1] md:mt-4 md:text-[64px]">{news.title}</h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Read time</p>
              <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{readMinutes} min</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Linked stars</p>
              <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{stars.length}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece7df] bg-white px-4 py-3">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Desk date</p>
              <p className="font-en mt-2 text-[18px] font-bold text-[#1c1c1e]">{format(new Date(news.publishedAt), "M.d", { locale: zhCN })}</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="lattice-card overflow-hidden p-4 md:p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">News poster board</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
              <div
                className="flex min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] md:min-h-[280px] md:rounded-[28px]"
                style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}33)` }}
              >
                <span className="select-none font-en text-[120px] font-black leading-none" style={{ color: `${accent}18` }}>
                  {leadStar?.nameEn.charAt(0) ?? "T"}
                </span>
              </div>
              <div className="grid gap-3">
                <div
                  className="flex min-h-[116px] items-center justify-center overflow-hidden rounded-[20px] md:min-h-[136px] md:rounded-[24px]"
                  style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}22)` }}
                >
                  <span className="select-none font-en text-[48px] font-black" style={{ color: `${accent}25` }}>
                    {leadStar?.nameEn.split(" ")[1]?.charAt(0) ?? leadStar?.nameEn.charAt(0) ?? "T"}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-[#f0f8ff] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Category</p>
                    <p className="font-cn mt-3 text-[14px] font-bold text-[#1c1c1e]">{news.category}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#6e6e73]">这条内容归在哪条关注线里</p>
                  </div>
                  <div className="rounded-[20px] bg-[#f5fff0] p-4 md:rounded-[24px]">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Linked stars</p>
                    <p className="lattice-title mt-3 text-[32px]">{stars.length}</p>
                    <p className="font-cn mt-2 text-[12px] leading-[1.7] text-[#6e6e73]">这条稿关联到的艺人数</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lattice-card p-5">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">How to read</p>
            <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">Read the summary. Keep the title.</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-[18px] md:rounded-[22px]"
                style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}33)` }}
              >
                <span className="select-none font-en text-[72px] font-black leading-none" style={{ color: `${accent}18` }}>
                  {leadStar?.nameEn.charAt(0) ?? "T"}
                </span>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-en text-[18px] font-black tracking-[-0.03em] text-white">{leadStar?.nameEn ?? "Thai star"}</p>
                  <p className="font-cn mt-1 text-[11px] text-white/80">{news.category} · {stars.length} 位相关艺人</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[18px] bg-[#f0f8ff] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Mode</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{news.editorialMode === "daily-auto" ? "自动整理" : "人工整理"}</p>
                </div>
                <div className="rounded-[18px] bg-[#f5fff0] p-4 md:rounded-[22px]">
                  <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Source</p>
                  <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">{news.sourceLabel ?? "站内整理来源"}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">先看中文快读，快速判断这条值不值得继续追。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">保留原始标题、艺人原文名和来源账号，后续搜原始帖会更直接。</p>
              </div>
              <div className="rounded-[18px] bg-[#fafafa] p-4 md:rounded-[22px]">
                <p className="font-cn text-[13px] leading-[1.8] text-[#6e6e73]">如果你是新粉，这页最适合做“快速补一条”的入口，不需要先刷完整时间线。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-[linear-gradient(135deg,#f0f8ff_0%,#f8f0ff_100%)] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:rounded-[36px] md:p-6">
          <h2 className="lattice-title text-[30px] md:text-[36px]">What happened.</h2>
          <p className="font-cn mt-2 text-[18px] font-bold text-[#111111]">中文摘要</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="font-cn text-[14px] leading-[1.9] text-[#6e6e73]">{news.excerpt}</p>
              <div className="mt-5 space-y-3 md:space-y-4">
                {articleParagraphs.map((paragraph, index) => (
                  <div key={`${index}-${paragraph.slice(0, 12)}`} className="rounded-[18px] bg-white/42 p-4 md:rounded-[22px]">
                    <p className="font-cn text-[14px] leading-[1.9] text-[#6e6e73]">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-2">
              {stars.slice(0, 4).map((star, index) => (
                <div
                  key={`${news.slug}-article-visual-${index}`}
                  className="flex min-h-[142px] items-center justify-center overflow-hidden rounded-[20px]"
                  style={{ background: `linear-gradient(135deg, #0f0f10, ${COMPANY_ACCENT[star.agency] ?? accent}28)` }}
                >
                  <span className="select-none font-en text-[64px] font-black leading-none" style={{ color: `${COMPANY_ACCENT[star.agency] ?? accent}20` }}>
                    {star.nameEn.charAt(0)}
                  </span>
                </div>
              ))}
              <div className="rounded-[20px] bg-white/55 p-4">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#a56a44]">Source note</p>
                <p className="font-cn mt-3 text-[13px] leading-[1.85] text-[#6e6e73]">
                  {news.sourceLabel ?? "站内整理来源"}。这条内容适合先看摘要，再保留原始标题去搜完整官宣和追加物料。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3 md:gap-4">
          <div className="lattice-soft-card overflow-hidden bg-[#fff4ee] p-4">
            <div
              className="mb-3 flex min-h-[112px] items-center justify-center overflow-hidden rounded-[18px] md:mb-4 md:min-h-[132px] md:rounded-[20px]"
              style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}22)` }}
            >
              <span className="select-none font-en text-[48px] font-black" style={{ color: `${accent}20` }}>
                {leadStar?.nameEn.charAt(0) ?? "T"}
              </span>
            </div>
            <p className="font-cn text-[12px] text-[#6e6e73]">内容来源类型</p>
            <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">
              {news.editorialMode === "daily-auto" ? "今日自动整理 + 人工可继续补充" : "人工整理稿"}
            </p>
          </div>
          <div className="lattice-soft-card overflow-hidden bg-[#fff4ee] p-4">
            <div
              className="mb-3 flex min-h-[112px] items-center justify-center overflow-hidden rounded-[18px] md:mb-4 md:min-h-[132px] md:rounded-[20px]"
              style={{ background: `linear-gradient(135deg, #0f0f10, ${accent}1a)` }}
            >
              <span className="select-none font-en text-[28px] font-black tracking-[-0.04em]" style={{ color: `${accent}30` }}>
                {format(new Date(news.publishedAt), "M.d")}
              </span>
            </div>
            <p className="font-cn text-[12px] text-[#6e6e73]">发布时间</p>
            <p className="font-en mt-2 text-[13px] font-bold text-[#1c1c1e]">
              {format(new Date(news.publishedAt), "yyyy.M.d HH:mm", { locale: zhCN })}
            </p>
          </div>
          <div className="lattice-soft-card overflow-hidden bg-[#f5fff0] p-4">
            <div
              className="mb-3 flex min-h-[112px] items-center justify-center overflow-hidden rounded-[18px] md:mb-4 md:min-h-[132px] md:rounded-[20px]"
              style={{ background: `linear-gradient(135deg, #0f0f10, #70823022)` }}
            >
              <span className="select-none font-en text-[48px] font-black" style={{ color: "#70823025" }}>
                {stars.length}
              </span>
            </div>
            <p className="font-cn text-[12px] text-[#6e6e73]">原始来源</p>
            {news.sourceUrl ? (
              <Link href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-en mt-2 inline-block text-[13px] font-bold text-[#1c1c1e]">
                打开原始链接
              </Link>
            ) : (
              <p className="font-cn mt-2 text-[13px] font-bold text-[#1c1c1e]">站内整理原稿</p>
            )}
          </div>
        </div>

        <div className="mt-7 rounded-[24px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] md:rounded-[30px] md:p-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">SEO Note</p>
          <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">Why this page is easy to find.</h2>
          <p className="font-cn mt-4 text-[14px] leading-[1.9] text-[#6e6e73]">
            这条动态页会保留原始标题、来源标签、发布时间和正文整理结构，既方便粉丝自己继续搜原始来源，也更适合被搜索引擎识别成持续更新的新闻内容页。
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-[1.05fr_0.95fr] md:gap-4">
          <div className="lattice-card p-5 md:p-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Search with these names</p>
            <h2 className="lattice-title mt-3 text-[24px] md:text-[28px]">Keep the original title.</h2>
            <p className="font-cn mt-3 text-[13px] leading-[1.85] text-[#6e6e73]">
              如果你准备继续搜原始官宣、品牌帖或站外讨论，先把原始标题、来源账号和相关艺人的原文名记住，会比只记中文摘要更好用。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="ui-chip">{news.title}</span>
              <span className="ui-chip">{news.sourceLabel ?? "站内整理来源"}</span>
              {stars.slice(0, 3).map((star) => (
                <span key={`${star.slug}-news-chip`} className="ui-chip">
                  {star.nameEn}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/news" className="lattice-soft-card bg-[#f0f8ff] p-4 transition hover:-translate-y-0.5 md:p-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#4d7b93]">Next step</p>
              <p className="lattice-title mt-3 text-[22px]">Back to the desk.</p>
              <p className="font-cn mt-2 text-[13px] leading-[1.8] text-[#6e6e73]">继续补同一天或同一位艺人的其他动态。</p>
            </Link>
            <Link
              href={leadStar ? `/stars/${leadStar.slug}` : "/news"}
              className="lattice-soft-card bg-[#f5fff0] p-4 transition hover:-translate-y-0.5 md:p-5"
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#708230]">Follow the face</p>
              <p className="lattice-title mt-3 text-[22px]">Open the star page.</p>
              <p className="font-cn mt-2 text-[13px] leading-[1.8] text-[#6e6e73]">如果你是第一次认识这位艺人，就直接去看他的入门资料和必看 3 条。</p>
            </Link>
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
