import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { listStars } from "@/lib/data";
import { officialSourceCatalog } from "@/lib/source-catalog";
import { getImageObjectPosition } from "@/lib/image-focus";
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

  // Top 10 core
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

        {/* ── HEADER + SEARCH (search promoted as main entry) ── */}
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

          {/* Search — promoted, full-width */}
          <div className="mt-7">
            <ArtistSearch stars={stars} />
          </div>
        </div>

        {/* ── TOP 10 — editorial: featured #1 + 9-card grid ── */}
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

            {/* Featured #1 hero + grid layout */}
            <div className="grid gap-4 md:gap-5 lg:grid-cols-[1.4fr_1fr]">

              {/* === Hero #1 === */}
              {top10[0] ? (
                <Link href={`/stars/${top10[0].slug}`}
                  className="group relative block overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-[#0f0f10] shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(240,112,48,0.22)]">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    {top10[0].coverUrl ? (
                      <Image
                        src={top10[0].coverUrl}
                        alt={top10[0].nameEn}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.05]"
                        style={{ objectPosition: getImageObjectPosition(top10[0].coverUrl, "hero") }}
                      />
                    ) : top10[0].avatarUrl ? (
                      <Image src={top10[0].avatarUrl} alt={top10[0].nameEn} fill className="object-cover" style={{ objectPosition: "center 18%" }} />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#fff4ee]">
                        <span className="font-en text-[120px] font-black text-[#f07030]/30">{top10[0].nameEn.charAt(0)}</span>
                      </div>
                    )}

                    {/* Strong editorial gradient */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.85)_100%)]" />

                    {/* Top-left: big rank + "主追第一位" */}
                    <div className="absolute left-5 top-5 md:left-7 md:top-7">
                      <div className="flex items-baseline gap-2">
                        <span className="font-en text-[64px] font-black leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:text-[80px]">01</span>
                        <span className="font-cn text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">No.1</span>
                      </div>
                      <span className="font-cn mt-2 inline-flex rounded-full bg-[#f07030] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(240,112,48,0.5)]">
                        中国粉丝最关注
                      </span>
                    </div>

                    {/* Bottom: name + agency + bio */}
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                      <p className="font-en text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffb088] md:text-[12px]">
                        {top10[0].agency}
                      </p>
                      <h3 className="font-en mt-2 text-[34px] font-black leading-[0.98] tracking-[-0.02em] text-white md:text-[48px]">
                        {top10[0].nameEn}
                      </h3>
                      {top10[0].nameCn ? (
                        <p className="font-cn mt-1 text-[14px] text-white/70 md:text-[16px]">{top10[0].nameCn}</p>
                      ) : null}
                      {top10[0].bio ? (
                        <p className="font-cn mt-3 max-w-[520px] text-[12px] leading-[1.7] text-white/85 line-clamp-2 md:text-[13px]">
                          {top10[0].bio}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ) : null}

              {/* === #2-#10 → 3-col tight grid === */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:auto-rows-fr">
                {top10.slice(1).map((star) => (
                  <Link key={star.slug} href={`/stars/${star.slug}`}
                    className="group relative block overflow-hidden rounded-[18px] border border-[#e8e8e8] bg-[#0f0f10] shadow-[0_2px_14px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(240,112,48,0.18)]">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                      {star.coverUrl ? (
                        <Image
                          src={star.coverUrl}
                          alt={star.nameEn}
                          fill
                          sizes="(min-width: 1024px) 16vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          style={{ objectPosition: getImageObjectPosition(star.coverUrl, "wide") }}
                        />
                      ) : star.avatarUrl ? (
                        <Image src={star.avatarUrl} alt={star.nameEn} fill className="object-cover" style={{ objectPosition: "center 18%" }} />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#fff4ee]">
                          <span className="font-en text-[44px] font-black text-[#f07030]/30">{star.nameEn.charAt(0)}</span>
                        </div>
                      )}

                      {/* Bottom-up gradient */}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.85)_100%)]" />

                      {/* Big rank number top-left, no badge box */}
                      <div className="absolute left-3 top-2.5">
                        <span className="font-en text-[28px] font-black leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-[34px]">
                          {String(star.chinaFanPriority).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Bottom: name only — no agency/bio chrome */}
                      <div className="absolute inset-x-0 bottom-0 p-3 md:p-3.5">
                        <p className="font-en text-[14px] font-black leading-[1.1] tracking-[-0.01em] text-white md:text-[16px]">
                          {star.nameEn}
                        </p>
                        {star.nameCn ? (
                          <p className="font-cn mt-0.5 text-[10px] text-white/65">{star.nameCn}</p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
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

        {/* ── EXTENDED ROSTER — by company ── */}
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
                            <div className="relative w-full overflow-hidden bg-[#f5f5f5]" style={{ aspectRatio: "2/3" }}>
                              {star.coverUrl ? (
                                <Image src={star.coverUrl} alt={star.nameEn} fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                  style={{ objectPosition: getImageObjectPosition(star.coverUrl, "wide") }} />
                              ) : star.avatarUrl ? (
                                <Image src={star.avatarUrl} alt={star.nameEn} fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                  style={{ objectPosition: "center 10%" }} />
                              ) : (
                                <div className="flex h-full items-center justify-center" style={{ backgroundColor: accent + "18" }}>
                                  <span className="font-en text-[36px] font-black" style={{ color: accent + "40" }}>
                                    {star.nameEn.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
                              <div className="absolute inset-x-0 bottom-0 p-3">
                                <p className="font-en text-[13px] font-black leading-[1.1] tracking-[-0.02em] text-white">{star.nameEn}</p>
                                {star.nameCn ? <p className="font-cn mt-0.5 text-[10px] text-white/70">{star.nameCn}</p> : null}
                              </div>
                            </div>
                            <div className="px-3 py-2.5">
                              <p className="font-cn text-[10px] font-bold truncate" style={{ color: accent }}>{star.agency}</p>
                              {star.bio ? <p className="font-cn mt-1 text-[10px] leading-[1.5] text-[#6e6e73] line-clamp-2">{star.bio}</p> : null}
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
