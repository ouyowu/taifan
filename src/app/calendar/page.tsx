import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { listEvents, listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { CalendarFilter } from "@/components/calendar-filter";

export const metadata: Metadata = buildPageMetadata({
  title: "活动日历",
  description: "查看泰国明星活动日历，按日期和艺人名称筛选，中文整理场馆、票务状态和官方来源。",
  path: "/calendar",
});

export default async function CalendarPage() {
  const [events, stars] = await Promise.all([listEvents(), listStars()]);

  const showEmptyState = events.length === 0;

  return (
    <SiteShell>
      <section className="page-shell mx-auto max-w-[1440px] py-10 md:py-14">
        {/* ── HEADER ── */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-[2px] w-5 rounded bg-[#f07030]" />
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#f07030]">Calendar</p>
            </div>
            <h1 className="font-sans text-[clamp(36px,6vw,72px)] font-extrabold leading-[0.98] tracking-tight text-[#1c1c1e]">
              活动日历
            </h1>
            <p className="font-cn mt-3 max-w-[560px] text-[15px] leading-[1.85] text-[#6e6e73]">
              点击日历上有圆点的日期可直接筛选当天活动，也可以按艺人查询。活动官方标题、场馆名保留原文，中文说明帮你先看懂再去搜票。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-[14px] border border-[#e8e8e8] bg-white px-5 py-3 text-center shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <p className="font-en text-[28px] font-black text-[#f07030] leading-none">{events.length}</p>
              <p className="font-cn text-[11px] text-[#6e6e73] mt-1">条活动</p>
            </div>
            <div className="rounded-[14px] border border-[#e8e8e8] bg-white px-5 py-3 text-center shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <p className="font-en text-[28px] font-black text-[#f07030] leading-none">{stars.length}</p>
              <p className="font-cn text-[11px] text-[#6e6e73] mt-1">位艺人</p>
            </div>
          </div>
        </div>

        {showEmptyState ? (
          <div className="rounded-[24px] border border-[#e8e8e8] bg-white p-12 text-center shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
            <p className="font-cn text-[15px] text-[#6e6e73]">暂无活动，请在后台录入活动数据。</p>
          </div>
        ) : (
          <CalendarFilter events={events} stars={stars} />
        )}
      </section>
    </SiteShell>
  );
}
