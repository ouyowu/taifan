import Link from "next/link";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { listStars } from "@/lib/data";
import { officialSourceCatalog } from "@/lib/source-catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ArtistSearch } from "@/components/artist-search";

export const metadata: Metadata = buildPageMetadata({
  title: "艺人",
  description: "浏览泰饭网整理的艺人库，按公司查看旗下艺人、代表标签和追星入口。",
  path: "/artists",
});

const COMPANY_ORDER = [
  "GMMTV","Cloud 9 Entertainment","One31 / independent brand work",
  "DOMUNDI TV","OPEN LABEL","BeOnCloud","MEMINDY",
  "Studio Wabi Sabi","Billkin Entertainment","PP Krit Entertainment","CHANGE ARTIST",
];

const COMPANY_DISPLAY: Record<string, string> = {
  "GMMTV": "GMMTV",
  "Cloud 9 Entertainment": "Cloud 9 Entertainment",
  "One31 / independent brand work": "One31",
  "DOMUNDI TV": "DoMunDi TV",
  "OPEN LABEL": "Open Label",
  "BeOnCloud": "BeOnCloud",
  "MEMINDY": "MEMINDY",
  "Studio Wabi Sabi": "Studio Wabi Sabi",
  "Billkin Entertainment": "Billkin Entertainment",
  "PP Krit Entertainment": "PP Krit Entertainment",
  "CHANGE ARTIST": "Change Artist",
};

const COMPANY_ACCENT: Record<string, string> = {
  "GMMTV": "#f07030",
  "Cloud 9 Entertainment": "#f07030",
  "One31 / independent brand work": "#4a90d9",
  "DOMUNDI TV": "#9b6eff",
  "OPEN LABEL": "#4caf78",
  "BeOnCloud": "#f07030",
  "MEMINDY": "#e84040",
  "Studio Wabi Sabi": "#4a90d9",
  "Billkin Entertainment": "#f07030",
  "PP Krit Entertainment": "#4caf78",
  "CHANGE ARTIST": "#9b6eff",
};

export default async function ArtistsPage() {
  const stars = await listStars();
  const sorted = [...stars].sort((a, b) => (a.chinaFanPriority ?? 99) - (b.chinaFanPriority ?? 99));

  const top10 = sorted.filter((s) => s.chinaFanPriority && s.chinaFanPriority <= 10);
  const extendedRoster = sorted.filter((s) => !s.chinaFanPriority || s.chinaFanPriority > 10);

  const byCompany = new Map<string, typeof stars>();
  for (const star of extendedRoster) {
    const co = star.agency ?? "Other";
    if (!byCompany.has(co)) byCompany.set(co, []);
    byCompany.get(co)!.push(star);
  }

  const activeSources = officialSourceCatalog.filter((s) => s.active !== false);

  return (
    <SiteShell>
      <section className="page-shell mx-auto max-w-[1440px] py-10 md:py-14">

        {/* ── HEADER + SEARCH ── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[2px] w-5 rounded bg-[#f07030]" />
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Artists</p>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[640px]">
              <h1 className="font-sans text-[clamp(36px,6vw,68px)] font-extrabold leading-[0.98] tracking-tight text-[#1c1c1e]">
                旗下艺人
              </h1>
              <p className="font-cn mt-3 text-[15px] leading-[1.8] text-[#6e6e73]">
                先看中国粉丝最常追的 Top 10，或直接搜索找到你的偶像。
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-[14px] border border-[#e8e8e8] bg-white px-5 py-3 text-center shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-en text-[26px] font-black text-[#f07030] leading-none">{stars.length}</p>
                <p className="font-cn text-[11px] text-[#6e6e73] mt-1">位艺人</p>
              </div>
              <div className="rounded-[14px] border border-[#e8e8e8] bg-white px-5 py-3 text-center shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                <p className="font-en text-[26px] font-black text-[#f07030] leading-none">{byCompany.size + 2}</p>
                <p className="font-cn text-[11px] text-[#6e6e73] mt-1">家公司</p>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <ArtistSearch stars={stars} />
          </div>
        </div>

        {/* ── TOP 10 ── */}
        {top10.length > 0 && (
          <div id="core-roster" className="mb-16">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-5 rounded bg-[#f07030]" />
                <h2 className="font-sans text-[22px] font-extrabold tracking-[-0.01em] text-[#1c1c1e] md:text-[26px]">
                  主追 Top 10
                </h2>
                <span className="font-cn hidden sm:inline-flex rounded-full bg-[#f07030] px-3 py-1 text-[11px] font-bold text-white">
                  中国粉丝热度排序
                </span>
              </div>
              <p className="font-cn text-[12px] text-[#aeaeb2] hidden md:block">点击任意卡片进入艺人页</p>
            </div>

            <div className="grid gap-4 md:gap-5 lg:grid-cols-[1.4fr_1fr]">

              {/* === Hero #1 === */}
              {top10[0] ? (() => {
                const accent = COMPANY_ACCENT[top10[0].agency] ?? "#f07030";
                return (
                  <Link href={`/stars/${top10[0].slug}`}
                    className="group relative block overflow-hidden rounded-[28px] border border-[#e8e8e8] shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(240,112,48,0.22)]"
                    style={{ background: `linear-gradient(135deg, #0f0f10 0%, ${accent}22 100%)` }}>
                    <div className="relative flex w-full flex-col justify-between p-7 md:p-10" style={{ minHeight: "420px" }}>
                      {/* Decorative initial */}
                      <div className="absolute right-6 top-4 select-none font-en text-[160px] font-black leading-none opacity-[0.06] text-white md:text-[200px]">
                        {top10[0].nameEn.charAt(0)}
                      </div>

                      {/* Top: rank */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-en text-[64px] font-black leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[80px]">01</span>
                          <span className="font-cn text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">No.1</span>
                        </div>
                        <span className="font-cn mt-2 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
                          style={{ backgroundColor: accent }}>
                          中国粉丝最关注
                        </span>
                      </div>

                      {/* Bottom: name + agency + bio */}
                      <div className="mt-10">
                        <p className="font-en text-[11px] font-bold uppercase tracking-[0.18em] opacity-70 md:text-[12px]"
                          style={{ color: accent }}>
                          {top10[0].agency}
                        </p>
                        <h3 className="font-en mt-2 text-[40px] font-black leading-[0.98] tracking-[-0.02em] text-white md:text-[56px]">
                          {top10[0].nameEn}
                        </h3>
                        {top10[0].nameCn && (
                          <p className="font-cn mt-1 text-[15px] text-white/60 md:text-[17px]">{top10[0].nameCn}</p>
                        )}
                        {top10[0].bio && (
                          <p className="font-cn mt-4 max-w-[520px] text-[13px] leading-[1.7] text-white/70 line-clamp-2">
                            {top10[0].bio}
                          </p>
                        )}
                        <div className="mt-5 flex flex-wrap gap-2">
                          {(top10[0].tags ?? []).slice(0, 3).map((tag) => (
                            <span key={tag} className="font-cn rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/60">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })() : null}

              {/* === #2–#10 grid === */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:auto-rows-fr">
                {top10.slice(1).map((star) => {
                  const accent = COMPANY_ACCENT[star.agency] ?? "#f07030";
                  return (
                    <Link key={star.slug} href={`/stars/${star.slug}`}
                      className="group relative block overflow-hidden rounded-[18px] border border-[#e8e8e8] shadow-[0_2px_14px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(240,112,48,0.18)]"
                      style={{ background: `linear-gradient(135deg, #0f0f10 0%, ${accent}18 100%)` }}>
                      <div className="relative flex flex-col justify-between p-3 md:p-4" style={{ minHeight: "160px" }}>
                        {/* Decorative initial */}
                        <div className="absolute right-2 top-1 select-none font-en text-[72px] font-black leading-none opacity-[0.07] text-white">
                          {star.nameEn.charAt(0)}
                        </div>

                        {/* Rank */}
                        <span className="font-en text-[28px] font-black leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-[34px]">
                          {String(star.chinaFanPriority).padStart(2, "0")}
                        </span>

                        {/* Name */}
                        <div className="mt-3">
                          <p className="font-en text-[14px] font-black leading-[1.1] tracking-[-0.01em] text-white md:text-[15px]">
                            {star.nameEn}
                          </p>
                          {star.nameCn && (
                            <p className="font-cn mt-0.5 text-[10px] text-white/55">{star.nameCn}</p>
                          )}
                          <p className="font-en mt-1 text-[10px] font-bold" style={{ color: accent + "99" }}>
                            {star.agency.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SOURCE WALL ── */}
        <div className="mb-14">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-5 rounded bg-[#f07030]" />
              <h2 className="font-sans text-[20px] font-extrabold tracking-[-0.01em] text-[#1c1c1e]">公司与官方入口</h2>
            </div>
            <Link href="/news" className="font-cn text-[13px] font-bold text-[#f07030] hover:underline">查看全部动态 →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
            {activeSources.map((source) => {
              const accent = COMPANY_ACCENT[source.company] ?? "#f07030";
              return (
                <a key={source.slug} href={source.profileUrl} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-[16px] border border-[#e8e8e8] bg-white p-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] font-en text-[14px] font-black text-white shadow-inner"
                       style={{ backgroundColor: accent }}>
                    {source.label.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-en text-[12px] font-bold text-[#1c1c1e] truncate">{source.label}</p>
                    <p className="font-cn text-[10px] text-[#aeaeb2]">
                      {source.ingestion?.mode === "youtube-videos" ? "YouTube" : source.ingestion?.mode === "facebook-posts" ? "Facebook" : "官网"}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── EXTENDED ROSTER ── */}
        {extendedRoster.length > 0 && (
          <div id="company-roster">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] w-5 rounded bg-[#f07030]" />
              <h2 className="font-sans text-[20px] font-extrabold tracking-[-0.01em] text-[#1c1c1e]">扩展艺人名录</h2>
              <span className="font-cn rounded-full border border-[#e8e8e8] bg-[#fafafa] px-3 py-1 text-[11px] text-[#6e6e73]">{extendedRoster.length} 位</span>
            </div>

            <div className="space-y-12">
              {Array.from(byCompany.entries())
                .sort(([a], [b]) => {
                  const ai = COMPANY_ORDER.indexOf(a);
                  const bi = COMPANY_ORDER.indexOf(b);
                  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                })
                .map(([company, companyStars]) => {
                  const accent = COMPANY_ACCENT[company] ?? "#f07030";
                  const displayName = COMPANY_DISPLAY[company] ?? company;
                  return (
                    <div key={company} id={`company-${company.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                      <div className="mb-5 flex items-center gap-3 pb-4 border-b border-[#e8e8e8]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-en text-[13px] font-black text-white"
                             style={{ backgroundColor: accent }}>
                          {displayName.charAt(0)}
                        </div>
                        <h3 className="font-en text-[18px] font-extrabold text-[#1c1c1e]">{displayName}</h3>
                        <span className="font-cn text-[12px] text-[#aeaeb2] ml-auto">{companyStars.length} 位艺人</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4">
                        {companyStars.map((star) => (
                          <Link key={star.slug} href={`/stars/${star.slug}`}
                            className="group block overflow-hidden rounded-[18px] border border-[#e8e8e8] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(240,112,48,0.15)]">
                            {/* Text-only card top area */}
                            <div className="relative flex flex-col justify-between p-4"
                              style={{ minHeight: "110px", background: `linear-gradient(135deg, #0f0f10 0%, ${accent}20 100%)` }}>
                              <div className="absolute right-3 top-2 select-none font-en text-[52px] font-black leading-none opacity-[0.07] text-white">
                                {star.nameEn.charAt(0)}
                              </div>
                              <p className="font-en text-[10px] font-bold uppercase tracking-[0.12em] opacity-60" style={{ color: accent }}>
                                {star.agency.split(" ")[0]}
                              </p>
                              <div>
                                <p className="font-en text-[14px] font-black leading-[1.1] text-white">{star.nameEn}</p>
                                {star.nameCn && <p className="font-cn mt-0.5 text-[10px] text-white/55">{star.nameCn}</p>}
                              </div>
                            </div>
                            <div className="px-3 py-2.5">
                              <p className="font-cn text-[10px] font-bold truncate" style={{ color: accent }}>{star.agency}</p>
                              {star.bio && <p className="font-cn mt-1 text-[10px] leading-[1.5] text-[#6e6e73] line-clamp-2">{star.bio}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
