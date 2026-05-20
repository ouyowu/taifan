import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Search, Star, UserRound } from "lucide-react";
import { connection } from "next/server";

import { ArtistSearch } from "@/components/artist-search";
import { SiteShell } from "@/components/layout/site-shell";
import { listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { officialSourceCatalog } from "@/lib/source-catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "艺人库",
  description: "按公司浏览泰饭网整理的艺人名录、追踪线和中文入口。",
  path: "/artists",
});

const COMPANY_ORDER = [
  "GMMTV",
  "Cloud 9 Entertainment",
  "One31 / independent brand work",
  "DOMUNDI TV",
  "OPEN LABEL",
  "BeOnCloud",
  "MEMINDY",
  "Studio Wabi Sabi",
  "Billkin Entertainment",
  "PP Krit Entertainment",
  "CHANGE ARTIST",
];

export default async function ArtistsPage() {
  await connection();
  const stars = await listStars();
  const sources = officialSourceCatalog.filter((source) => source.active !== false);

  const sorted = [...stars].sort((a, b) => (a.chinaFanPriority ?? 999) - (b.chinaFanPriority ?? 999));
  const topRoster = sorted.filter((star) => star.chinaFanPriority && star.chinaFanPriority <= 10);
  const extendedRoster = sorted.filter((star) => !star.chinaFanPriority || star.chinaFanPriority > 10);

  const grouped = new Map<string, typeof stars>();
  for (const star of extendedRoster) {
    const agency = star.agency ?? "Other";
    if (!grouped.has(agency)) grouped.set(agency, []);
    grouped.get(agency)!.push(star);
  }

  return (
    <SiteShell>
      <section className="editorial-page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="editorial-kicker">Artist directory</p>
            <h1 className="mt-4 font-sans text-[clamp(38px,6vw,84px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              旗下艺人
              <br />
              先看重点，再查全库。
            </h1>
            <p className="font-cn mt-6 max-w-[720px] text-[16px] leading-[1.95] text-[#5d6268]">
              这页不做海报墙，而是做一个真正能查人的目录。你可以先看主追 Top 10，再按公司往下翻完整名录，也可以直接搜索名字进入个人页。
            </p>
            <div className="mt-8">
              <ArtistSearch stars={stars} />
            </div>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">Directory stats</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><UserRound className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{stars.length}</p>
                <p className="editorial-brief-label">总艺人数</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Star className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{topRoster.length}</p>
                <p className="editorial-brief-label">主追艺人</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Building2 className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{grouped.size + 1}</p>
                <p className="editorial-brief-label">公司分组</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Search className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{sources.length}</p>
                <p className="editorial-brief-label">官方入口</p>
              </div>
            </div>
            <div className="mt-6 border-t border-[#ece8e2] pt-6">
              <p className="font-cn text-[13px] leading-[1.85] text-[#666b70]">
                主追艺人用于快速入坑；扩展艺人保留公司归属和人物入口，方便后面继续补更多资料、照片和活动线。
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="editorial-lead-card">
            <p className="editorial-kicker">Core roster</p>
            <h2 className="mt-4 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e] md:text-[42px]">
              中国粉丝最常追的主追艺人
            </h2>
            <p className="font-cn mt-3 max-w-[760px] text-[14px] leading-[1.9] text-[#5d6268]">
              不先铺图，而是先讲顺序。你如果刚进站，先从这批人开始最不容易迷路：名字、公司、代表追踪线都一眼能看到。
            </p>
            <div className="editorial-inline-note mt-4">
              <Star className="h-4 w-4" />
              <span>主追区适合新粉先建立人物印象，扩展区再用来补完整名录。</span>
            </div>
            <div className="mt-8 space-y-3">
              {topRoster.map((star, index) => (
                <Link key={star.slug} href={`/stars/${star.slug}`} className="editorial-directory-row">
                  <div className="flex items-start gap-4">
                    <span className="editorial-list-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-en text-[17px] font-black text-[#1c1c1e]">{star.nameEn}</p>
                      <p className="font-cn mt-1 text-[13px] text-[#7a7f85]">{star.nameCn}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-cn text-[12px] text-[#f07030]">{star.agency}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#7a7f85]">{(star.tags ?? []).slice(0, 2).join(" / ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="editorial-sidebar-block">
              <p className="editorial-kicker">Official companies</p>
              <div className="mt-4 space-y-3">
                {sources.slice(0, 8).map((source) => (
                  <a
                    key={source.slug}
                    href={source.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-list-card-compact"
                  >
                    <div>
                      <p className="font-en text-[14px] font-black text-[#1c1c1e]">{source.label}</p>
                      <p className="font-cn mt-1 text-[12px] text-[#6c7076]">{source.company}</p>
                    </div>
                    <span className="editorial-chip-muted">
                      {source.ingestion?.mode === "youtube-videos"
                        ? "YouTube"
                        : source.ingestion?.mode === "facebook-posts"
                          ? "Facebook"
                          : "官网"}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-16">
        <div className="mb-8">
          <p className="editorial-kicker">Extended roster</p>
          <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e] md:text-[42px]">
            扩展艺人名录
          </h2>
          <p className="font-cn mt-3 max-w-[760px] text-[14px] leading-[1.9] text-[#5d6268]">
            下面按公司继续展开完整名录。这里更像目录页，不需要花哨视觉，只要让你快速找到人、点进去看个人资料和活动即可。
          </p>
          <div className="editorial-inline-note mt-4">
            <Building2 className="h-4 w-4" />
            <span>按公司浏览更适合老粉回查，也方便后面继续往里补更多资料。</span>
          </div>
        </div>

        <div className="space-y-10">
          {Array.from(grouped.entries())
            .sort(([a], [b]) => {
              const ai = COMPANY_ORDER.indexOf(a);
              const bi = COMPANY_ORDER.indexOf(b);
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            })
            .map(([company, companyStars]) => (
              <section key={company} className="editorial-sidebar-block">
                <div className="flex items-end justify-between gap-4 border-b border-[#ece8e2] pb-4">
                  <div>
                    <p className="font-en text-[20px] font-black text-[#1c1c1e]">{company}</p>
                    <p className="font-cn mt-1 text-[12px] text-[#7a7f85]">{companyStars.length} 位艺人</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {companyStars.map((star) => (
                    <Link key={star.slug} href={`/stars/${star.slug}`} className="editorial-list-card-compact">
                      <div>
                        <p className="font-en text-[15px] font-black text-[#1c1c1e]">{star.nameEn}</p>
                        <p className="font-cn mt-1 text-[12px] text-[#6c7076]">{star.nameCn}</p>
                      </div>
                      <span className="editorial-chip-muted">{(star.tags ?? [])[0] ?? "艺人"}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </section>
    </SiteShell>
  );
}
