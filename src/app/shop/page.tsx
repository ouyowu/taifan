import Link from "next/link";
import type { Metadata } from "next";
import { BadgeDollarSign, Building2, PackageSearch, ShoppingBag } from "lucide-react";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { primarySourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "周边商城",
  description: "浏览泰饭网周边商城入口，按公司和艺人查看周边信息。",
  path: "/shop",
});

const productKinds = [
  { kind: "写真集", price: "¥299", badge: "NEW", company: "GMMTV" },
  { kind: "亚克力立牌", price: "¥129", badge: "HOT", company: "BeOnCloud" },
  { kind: "随机小卡", price: "¥49", badge: "LIMITED", company: "DoMunDi TV" },
  { kind: "应援套组", price: "¥239", badge: "PREORDER", company: "Studio Wabi Sabi" },
  { kind: "T 恤", price: "¥189", badge: "HOT", company: "Open Label" },
  { kind: "手机支架", price: "¥79", badge: "NEW", company: "Me Mind Y" },
];

export default async function ShopPage() {
  await connection();
  const stars = await listStars();
  const products = stars.slice(0, 12).map((star, index) => {
    const template = productKinds[index % productKinds.length];
    return {
      id: `${star.slug}-${template.kind}`,
      star,
      ...template,
      description: `围绕 ${star.nameCn} 整理的 ${template.kind} 入口，适合先看价格、公司和商品类型，再决定是否继续下单。`,
    };
  });

  return (
    <SiteShell>
      <section className="editorial-page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="editorial-kicker">Merch directory</p>
            <h1 className="mt-4 font-sans text-[clamp(38px,6vw,82px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              周边商城
              <br />
              先看入口，再决定下单。
            </h1>
            <p className="font-cn mt-6 max-w-[720px] text-[16px] leading-[1.95] text-[#5d6268]">
              这一页改成周边目录，而不是商品海报墙。先把公司、艺人、价格和商品类型讲清楚，让你快速判断哪条线值得继续看。
            </p>
            <div className="editorial-inline-note mt-5">
              <ShoppingBag className="h-4 w-4" />
              <span>先把入口和价格看清楚，比一开始就沉进商品图里更省时间。</span>
            </div>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">Shop stats</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><ShoppingBag className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{products.length}</p>
                <p className="editorial-brief-label">推荐周边</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Building2 className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{primarySourceShowcaseEntries.length}</p>
                <p className="editorial-brief-label">来源公司</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><PackageSearch className="h-4 w-4" /></span>
                <p className="editorial-brief-number">CN</p>
                <p className="editorial-brief-label">中文入口</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><BadgeDollarSign className="h-4 w-4" /></span>
                <p className="editorial-brief-number">MVP</p>
                <p className="editorial-brief-label">人工整理</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="editorial-sidebar-block">
            <p className="editorial-kicker">Company lanes</p>
            <div className="mt-5 space-y-3">
              {primarySourceShowcaseEntries.map((entry) => (
                <Link key={entry.slug} href={entry.url} className="editorial-list-card-compact">
                  <div>
                    <p className="font-en text-[14px] font-black text-[#1c1c1e]">{entry.company}</p>
                    <p className="font-cn mt-1 text-[12px] text-[#6c7076]">{entry.meta}</p>
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

          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.id} className="editorial-directory-row rounded-[24px] border border-[#ece8e2] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                <div className="flex items-start gap-4">
                  <span className="editorial-list-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-cn text-[15px] font-bold leading-[1.7] text-[#1c1c1e]">
                      {product.star.nameCn} {product.kind}
                    </p>
                    <p className="font-en mt-1 text-[12px] text-[#7a7f85]">{product.star.nameEn}</p>
                    <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#666b70]">{product.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-en text-[20px] font-black text-[#1c1c1e]">{product.price}</p>
                  <p className="font-cn mt-1 text-[12px] text-[#f07030]">{product.company}</p>
                  <span className="editorial-chip-muted mt-3 inline-flex">{product.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
