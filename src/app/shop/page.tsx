import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { listStars } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";
import { primarySourceShowcaseEntries, sourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "周边商城",
  description: "浏览泰饭网周边商城，查看写真集、立牌、随机小卡和应援套组等商品入口。",
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

const tones = ["#fff4ee", "#e8f4ff", "#f0fff0", "#fff0f7"];

export default async function ShopPage() {
  const stars = await listStars();
  const products = stars.slice(0, 8).map((star, index) => {
    const template = productKinds[index % productKinds.length];
    return {
      id: `${star.slug}-${template.kind}`,
      star,
      ...template,
      description: `面向 ${star.nameCn} 粉丝整理的 ${template.kind} 入口，适合先看商品图、价格和来源，再决定要不要继续下单。`,
    };
  });

  return (
    <SiteShell>
      <section className="border-b border-[#e8e8e8] bg-white px-[min(6vw,80px)] pb-11 pt-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="sec-tag">Merch Shop</div>
              <h1 className="mt-3 font-sans text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.04em] text-[#1c1c1e]">
                周边商城
              </h1>
              <p className="font-cn mt-3 max-w-[520px] text-[16px] leading-[1.75] text-[#6e6e73]">
                写真集、应援棒、随机小卡和套组周边的集中入口。先看公司、艺人和价格，再决定要不要继续走下单流程。
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {["正品代购", "直邮支持", "预售提醒"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-[#fafafa] px-4 py-2 font-cn text-[13px] font-bold text-[#6e6e73]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#f07030]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[68px] z-40 border-b border-[#e8e8e8] bg-white">
        <div className="page-shell mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto">
          {["全部", "写真集", "应援套组", "随机小卡", "亚克力周边", "衣服配件"].map((tab, index) => (
            <button
              key={tab}
              className={`shrink-0 border-b-2 px-5 py-4 font-cn text-[13px] font-bold ${
                index === 0 ? "border-[#f07030] text-[#f07030]" : "border-transparent text-[#aeaeb2]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-[#fafafa] px-[min(6vw,80px)] py-10">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-8 lg:sticky lg:top-[124px] lg:h-fit">
            <div>
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#aeaeb2]">公司</h2>
              <div className="mt-4 space-y-2">
                {["全部", ...primarySourceShowcaseEntries.map((entry) => entry.company)].map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 rounded-[10px] px-3 py-[10px] font-cn text-[14px] font-semibold ${
                      index === 0 ? "bg-[#fff4ee] text-[#f07030]" : "text-[#6e6e73] hover:bg-[#f3f3f3]"
                    }`}
                  >
                    {index === 0 ? (
                      <span className="h-2 w-2 rounded-full bg-[#f07030]" />
                    ) : (
                      <span className="relative h-6 w-6 overflow-hidden rounded-full bg-white">
                        <Image
                          src={primarySourceShowcaseEntries[index - 1].logoPath}
                          alt={primarySourceShowcaseEntries[index - 1].company}
                          fill
                          className="object-contain p-1"
                        />
                      </span>
                    )}
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#aeaeb2]">价格范围</h2>
              <div className="mt-4 flex items-center gap-2">
                <input className="w-20 rounded-[8px] border border-[#e8e8e8] px-3 py-2 text-[13px]" placeholder="50" />
                <span className="text-[#aeaeb2]">—</span>
                <input className="w-20 rounded-[8px] border border-[#e8e8e8] px-3 py-2 text-[13px]" placeholder="500" />
              </div>
            </div>
            <div className="rounded-[18px] bg-[#1c1c1e] p-6">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#f07030]">Promo</p>
              <p className="mt-3 font-cn text-[20px] font-extrabold text-white">先看热卖，再决定要不要下单。</p>
              <p className="mt-2 font-cn text-[13px] leading-[1.75] text-white/50">如果你刚进站，先从最热的写真集、套组和小卡开始，不用一次看完整个商城。</p>
              <Link
                href="/services"
                className="mt-5 inline-flex rounded-full bg-[#f07030] px-5 py-3 font-cn text-[13px] font-bold text-white transition-all hover:-translate-y-px hover:bg-[#ff9050]"
              >
                需要代购支持
              </Link>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="font-cn text-[14px] text-[#6e6e73]">
                共 <strong className="font-en text-[#1c1c1e]">{products.length}</strong> 件推荐周边
              </p>
              <div className="flex gap-1">
                <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#f07030] bg-[#fff4ee] text-[#f07030]">
                  ⊞
                </button>
                <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#e8e8e8] bg-white text-[#6e6e73]">
                  ☰
                </button>
              </div>
            </div>

            <div className="mb-8 overflow-hidden rounded-[18px] bg-[#1c1c1e] p-7">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#f07030]">Featured Collection</p>
              <p className="mt-2 font-cn text-[20px] font-extrabold text-white">本周最适合先看的周边入口</p>
              <p className="mt-1 font-cn text-[13px] text-white/50">先从价格清晰、视觉完整、粉丝最常买的几件开始。</p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              {sourceShowcaseEntries.slice(0, 4).map((entry) => (
                <Link key={`${entry.slug}-shop-source`} href={entry.url} className="rounded-[18px] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-[12px] bg-[#fafafa]">
                      <Image src={entry.logoPath} alt={entry.company} fill className="object-contain p-2" />
                    </div>
                    <div>
                      <p className="font-en text-[13px] font-black text-[#1c1c1e]">{entry.company}</p>
                      <p className="font-cn mt-1 text-[11px] text-[#aeaeb2]">{entry.meta}</p>
                    </div>
                  </div>
                  <p className="font-cn mt-3 line-clamp-2 text-[13px] font-bold leading-[1.7] text-[#1c1c1e]">{entry.title}</p>
                </Link>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-[18px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                >
                  <div className="relative aspect-square" style={{ backgroundColor: tones[index % tones.length] }}>
                    <Image
                      src={product.star.coverUrl}
                      alt={product.star.nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(product.star.coverUrl, "poster") }}
                    />
                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                      <span className="rounded-full bg-[#f07030] px-3 py-1 font-sans text-[10px] font-extrabold text-white">
                        {product.badge}
                      </span>
                    </div>
                    <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[16px]">♡</button>
                  </div>
                  <div className="p-4">
                    <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#f07030]">{product.company}</p>
                    <p className="mt-2 font-cn text-[14px] font-bold leading-[1.45] text-[#1c1c1e]">
                      {product.star.nameCn} {product.kind}
                    </p>
                    <p className="mt-2 font-cn text-[12px] leading-[1.7] text-[#6e6e73]">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-en text-[20px] font-black text-[#1c1c1e]">{product.price}</p>
                      <button className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f07030] text-[20px] text-white shadow-[0_4px_12px_rgba(240,112,48,0.3)]">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
