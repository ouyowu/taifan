import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { guideSections } from "@/lib/mock-data";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "新粉攻略",
  description: "给中国新粉的泰娱入门手册，先搞懂看哪里、怎么买票、哪些活动值得去，少踩坑，更快进入追星状态。",
  path: "/guides",
});

const GUIDE_ACCENTS = ["#f07030", "#4d7b93", "#708230", "#8b5cf6"];

export default async function GuidesPage() {
  const tones = ["#f0f8ff", "#fff4ee", "#f5fff0", "#f8f0ff"];
  const starterGuides = guideSections.slice(0, 3);

  return (
    <SiteShell>
      <section className="page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Starter Guide</p>
          <h1 className="lattice-title mt-3 text-[42px] md:mt-4 md:text-[76px]">Start smarter.</h1>
          <p className="font-cn mt-3 text-[22px] font-bold text-[#111111]">新粉攻略</p>
          <p className="font-cn mt-3 text-[13px] leading-[1.8] text-[#6e6e73] md:mt-4 md:text-[15px] md:leading-[1.9]">
            先解决“我该先看哪里、怎么买票、哪些活动值得去、哪些信息必须核对”的核心问题，让第一次接触泰娱的新粉也能少踩坑。
          </p>
        </div>
        <div className="mt-7 lattice-card p-5 md:mt-8 md:p-8">
          <div className="mb-5 md:mb-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030]">Read order</p>
            <h2 className="lattice-title mt-3 text-[28px] md:text-[40px]">Start with these chapters.</h2>
            <p className="font-cn mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#6e6e73] md:text-[14px] md:leading-[1.85]">
              如果你不想一上来就把所有攻略都看完，先从这三章开始。它们最适合第一次接触泰娱、第一次看活动、第一次想抢票或围观的新粉。
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-3 md:gap-4">
            {starterGuides.map((section, index) => (
              <div
                key={`${section.title}-starter`}
                className="lattice-soft-card p-4 md:p-5"
                style={{ backgroundColor: tones[index % tones.length] }}
              >
                <p className="lattice-title text-[24px]">0{index + 1}</p>
                <p className="lattice-title mt-3 text-[24px]">{section.title}</p>
                <p className="font-cn mt-3 text-[14px] leading-[1.8] text-[#6e6e73]">{section.points[0]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3 md:gap-6">
          {guideSections.map((section, index) => (
            <div
              key={section.title}
              className="lattice-card overflow-hidden p-4"
            >
              <div
                className="flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] md:h-[250px] md:rounded-[24px]"
                style={{ background: `linear-gradient(135deg, #0f0f10, ${GUIDE_ACCENTS[index % GUIDE_ACCENTS.length]}33)` }}
              >
                <span className="select-none font-en text-[96px] font-black leading-none" style={{ color: `${GUIDE_ACCENTS[index % GUIDE_ACCENTS.length]}22` }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-1 pt-4 md:p-2 md:pt-5">
                <h2 className="lattice-title text-[26px] md:text-[30px]">{section.title}</h2>
                <ul className="font-cn mt-4 space-y-2 text-[13px] leading-[1.75] text-[#6e6e73] md:space-y-3 md:text-[14px] md:leading-[1.8]">
                  {section.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
