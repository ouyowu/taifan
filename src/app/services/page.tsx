import Image from "next/image";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { ServiceRequestForm } from "@/components/service-request-form";
import { listServices, listStars } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "代办服务",
  description: "面向中国粉丝的泰娱服务支持入口，包含资讯翻译、行程规划、票务梳理和现场信息支持，让追星更省心。",
  path: "/services",
});

const SERVICE_ICONS: Record<string, string> = {
  "trip-planning": "✈️",
  "ticket-briefing": "🎫",
  "translation-pack": "📋",
};

const SERVICE_TINTS: { bg: string; accent: string }[] = [
  { bg: "#fff4ee", accent: "#f07030" },
  { bg: "#f0f6ff", accent: "#4a90d9" },
  { bg: "#f1faef", accent: "#4caf78" },
  { bg: "#f6f0ff", accent: "#9b6eff" },
  { bg: "#fff0f0", accent: "#e84040" },
  { bg: "#fff8e8", accent: "#e6a73c" },
];

export default async function ServicesPage() {
  const [services, stars] = await Promise.all([listServices(), listStars()]);

  const starVisualMap: Record<string, string> = {
    "trip-planning": stars.find((s) => s.slug === "bright-vaid")?.coverUrl ?? stars[0]?.coverUrl ?? "",
    "ticket-briefing": stars.find((s) => s.slug === "billkin")?.coverUrl ?? stars[1]?.coverUrl ?? "",
    "translation-pack": stars.find((s) => s.slug === "pp-krit")?.coverUrl ?? stars[2]?.coverUrl ?? "",
  };

  return (
    <SiteShell>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-[120px] -top-[120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(240,112,48,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-[100px] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(74,144,217,0.05)_0%,transparent_70%)]" />
        <div className="page-shell mx-auto max-w-[1440px] py-14 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-[2px] w-5 rounded bg-[#f07030]" />
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Fan Services</p>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h1 className="font-sans text-[clamp(40px,6vw,80px)] font-extrabold leading-[0.96] tracking-tight text-[#1c1c1e]">
                代办服务
              </h1>
              <p className="font-cn mt-5 max-w-[600px] text-[16px] leading-[1.85] text-[#6e6e73]">
                面向中国大陆粉丝的泰娱追星服务入口。资讯翻译、行程规划、票务梳理、现场信息支持，让你先把关键信息看明白，再去搜索和核对原始来源。
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {["官方来源优先", "人工审核内容", "中文整理说明", "24–48 小时反馈"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-3.5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f07030]" />
                    <span className="font-cn text-[12px] font-bold text-[#1c1c1e] whitespace-nowrap">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stat strip */}
            <div className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030] mb-4">本月数据</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-en text-[32px] font-black text-[#1c1c1e] leading-none">{services.length}</p>
                  <p className="font-cn mt-2 text-[11px] text-[#6e6e73]">项服务</p>
                </div>
                <div>
                  <p className="font-en text-[32px] font-black text-[#f07030] leading-none">100%</p>
                  <p className="font-cn mt-2 text-[11px] text-[#6e6e73]">人工审核</p>
                </div>
                <div>
                  <p className="font-en text-[32px] font-black text-[#1c1c1e] leading-none">24h</p>
                  <p className="font-cn mt-2 text-[11px] text-[#6e6e73]">平均响应</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES — clean vertical cards ── */}
      <section className="border-t border-[#e8e8e8] bg-[#fafafa]">
        <div className="page-shell mx-auto max-w-[1440px] py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[2px] w-5 rounded bg-[#f07030]" />
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Service Menu</p>
              </div>
              <h2 className="font-sans text-[28px] font-extrabold tracking-[-0.01em] text-[#1c1c1e] md:text-[36px]">
                可代办的服务
              </h2>
            </div>
            <p className="font-cn text-[12px] text-[#aeaeb2] hidden md:block">下方表单可以直接提交需求</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const tint = SERVICE_TINTS[index % SERVICE_TINTS.length];
              const icon = SERVICE_ICONS[service.slug] ?? "⭐";
              const coverUrl = starVisualMap[service.slug];

              return (
                <article key={service.slug}
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-[#e8e8e8] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]">

                  {/* Image header */}
                  <div className="relative h-[180px] overflow-hidden" style={{ backgroundColor: tint.bg }}>
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={service.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.05]"
                        style={{ objectPosition: getImageObjectPosition(coverUrl, "wide") }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

                    {/* Top-left: index */}
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur font-en text-[12px] font-black text-[#1c1c1e]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-white/90 backdrop-blur px-2.5 py-1 font-cn text-[11px] font-bold" style={{ color: tint.accent }}>
                        {service.turnaround}
                      </span>
                    </div>

                    {/* Bottom-left: emoji icon */}
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[26px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">{icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-sans text-[18px] font-extrabold tracking-[-0.01em] text-[#1c1c1e] md:text-[19px]">
                      {service.title}
                    </h3>
                    <p className="font-cn mt-2.5 text-[13px] leading-[1.75] text-[#6e6e73]">
                      {service.description}
                    </p>

                    {service.deliverables?.length ? (
                      <ul className="mt-4 space-y-1.5 border-t border-[#f0f0f0] pt-4">
                        {service.deliverables.slice(0, 4).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ backgroundColor: tint.accent }} />
                            <span className="font-cn text-[12px] leading-[1.6] text-[#6e6e73]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REQUEST FORM — full-width clean section ── */}
      <section className="page-shell mx-auto max-w-[1440px] py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-12">

          {/* Left: pitch + steps */}
          <div className="lg:sticky lg:top-[88px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[2px] w-5 rounded bg-[#f07030]" />
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Request support</p>
            </div>
            <h2 className="font-sans text-[32px] font-extrabold tracking-[-0.02em] text-[#1c1c1e] md:text-[44px] md:leading-[1.05]">
              告诉我们<br />你需要什么
            </h2>
            <p className="font-cn mt-5 max-w-[460px] text-[14px] leading-[1.85] text-[#6e6e73]">
              表单会进入后台处理队列，说清楚想追哪位、目前卡在哪一步、希望什么时候得到支持就可以了。所有请求由人工处理，不会自动回复。
            </p>

            {/* Steps */}
            <div className="mt-7 space-y-3">
              {[
                { n: "01", label: "提交需求", desc: "填好表单，描述具体场景" },
                { n: "02", label: "人工分配", desc: "24–48 小时内由对应方向负责人接手" },
                { n: "03", label: "反馈方案", desc: "中文整理 + 官方来源链接同步发出" },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-4 rounded-[14px] border border-[#e8e8e8] bg-white p-4">
                  <span className="font-en text-[18px] font-black text-[#f07030] leading-none shrink-0">{step.n}</span>
                  <div>
                    <p className="font-cn text-[13px] font-bold text-[#1c1c1e]">{step.label}</p>
                    <p className="font-cn mt-1 text-[11px] leading-[1.65] text-[#6e6e73]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="rounded-[24px] border border-[#e8e8e8] bg-white p-6 shadow-[0_2px_18px_rgba(0,0,0,0.06)] md:p-8">
            <div className="mb-5 flex flex-wrap gap-2">
              {["行程规划", "票务梳理", "资讯翻译", "现场支持"].map((tag) => (
                <span key={tag} className="font-cn rounded-full border border-[#e8e8e8] bg-[#fafafa] px-3 py-1.5 text-[11px] text-[#6e6e73]">
                  {tag}
                </span>
              ))}
            </div>

            <ServiceRequestForm />

            <p className="font-cn mt-5 border-t border-[#f0f0f0] pt-4 text-[11px] leading-[1.7] text-[#aeaeb2]">
              提交后系统不会自动回复，由后台人工跟进。如有紧急时间需求，请在备注中标明。
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
