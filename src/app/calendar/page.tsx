import type { Metadata } from "next";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarRange, MapPin, Ticket, UserRound } from "lucide-react";
import { connection } from "next/server";

import { CalendarFilter } from "@/components/calendar-filter";
import { SiteShell } from "@/components/layout/site-shell";
import { listEvents, listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { EVENT_TYPE_LABELS } from "@/lib/constants";

export const metadata: Metadata = buildPageMetadata({
  title: "活动日历",
  description: "查看泰国艺人活动日历，按日期和艺人筛选活动。",
  path: "/calendar",
});

export default async function CalendarPage() {
  await connection();
  const [events, stars] = await Promise.all([listEvents(), listStars()]);
  const showEmptyState = events.length === 0;

  const monthGroups = events.reduce<Array<{ key: string; label: string; items: typeof events }>>((groups, event) => {
    const date = new Date(event.startsAt);
    const key = format(date, "yyyy-MM");
    const label = format(date, "yyyy 年 M 月", { locale: zhCN });
    const existing = groups.find((group) => group.key === key);
    if (existing) {
      existing.items.push(event);
      return groups;
    }
    groups.push({ key, label, items: [event] });
    return groups;
  }, []);

  return (
    <SiteShell>
      <section className="editorial-page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="editorial-kicker">Calendar desk</p>
            <h1 className="mt-4 font-sans text-[clamp(38px,6vw,82px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              活动日历
              <br />
              先看月份，再看场次。
            </h1>
            <p className="font-cn mt-6 max-w-[760px] text-[16px] leading-[1.95] text-[#5d6268]">
              这一页改成时间表和目录的混合结构。你不用先看海报，先看月份、城市、活动类型和关联艺人，确认值得追的场次后再进入单条活动页。
            </p>
            <div className="editorial-inline-note mt-5">
              <CalendarRange className="h-4 w-4" />
              <span>先看月份块，再用下面的筛选器查具体日期和艺人，会比一上来扫完整列表更轻松。</span>
            </div>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">Calendar stats</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><CalendarRange className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{events.length}</p>
                <p className="editorial-brief-label">活动条目</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><UserRound className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{stars.length}</p>
                <p className="editorial-brief-label">关联艺人</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Ticket className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{monthGroups.length}</p>
                <p className="editorial-brief-label">覆盖月份</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><MapPin className="h-4 w-4" /></span>
                <p className="editorial-brief-number">
                  {new Set(events.map((event) => event.city).filter(Boolean)).size}
                </p>
                <p className="editorial-brief-label">城市</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {!showEmptyState ? (
        <section className="editorial-page-shell mx-auto max-w-[1440px] pb-10">
          <div className="grid gap-4 lg:grid-cols-3">
            {monthGroups.map((group) => (
              <section key={group.key} className="editorial-month-card">
                <div className="border-b border-[#ece8e2] pb-4">
                  <p className="font-en text-[18px] font-black text-[#1c1c1e]">{group.label}</p>
                  <p className="font-cn mt-1 text-[12px] text-[#7a7f85]">{group.items.length} 场活动</p>
                </div>
                <div className="mt-4 space-y-3">
                  {group.items.slice(0, 4).map((event) => (
                    <a key={event.slug} href={`/events/${event.slug}`} className="editorial-list-card-compact">
                      <div>
                        <p className="font-cn text-[14px] font-bold leading-[1.7] text-[#1c1c1e]">{event.title}</p>
                        <p className="font-cn mt-1 text-[12px] text-[#6c7076]">
                          {format(new Date(event.startsAt), "M 月 d 日 HH:mm", { locale: zhCN })} · {event.city}
                        </p>
                      </div>
                      <span className="editorial-chip-muted">{EVENT_TYPE_LABELS[event.type] ?? "活动"}</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-16">
        {showEmptyState ? (
          <div className="editorial-empty-card">
            <p className="editorial-kicker">Calendar check</p>
            <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e]">当前还没有活动数据</h2>
            <p className="font-cn mt-3 text-[14px] leading-[1.9] text-[#666b70]">
              先在后台补活动，或者先导入首批活动数据，这一页就会亮起来。
            </p>
          </div>
        ) : (
          <CalendarFilter events={events} stars={stars} />
        )}
      </section>
    </SiteShell>
  );
}
