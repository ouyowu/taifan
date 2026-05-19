"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Event, Star } from "@/types/domain";

const TYPE_LABEL: Record<string, string> = {
  fanmeeting: "见面会",
  concert: "演唱会",
  brand: "品牌活动",
  broadcast: "直播",
  variety: "综艺",
  event: "活动",
};

const MONTH_NAMES = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

interface CalendarFilterProps {
  events: Event[];
  stars: Star[];
}

function groupByMonth(events: Event[]) {
  const map = new Map<string, Event[]>();
  for (const ev of events) {
    const d = new Date(ev.startsAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return map;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function CalendarFilter({ events, stars }: CalendarFilterProps) {
  const today = useMemo(() => new Date(), []);

  // Determine starting month: first event's month, or today if none
  const initialDate = events.length > 0 ? new Date(events[0].startsAt) : today;
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<string>("all");
  const [starSearch, setStarSearch] = useState("");
  const [showStarPicker, setShowStarPicker] = useState(false);

  const starsMap = useMemo(() => new Map(stars.map((s) => [s.slug, s])), [stars]);

  // Build day-key index of events for fast lookup
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const ev of events) {
      const d = new Date(ev.startsAt);
      const k = dateKey(d);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(ev);
    }
    return map;
  }, [events]);

  // Filtered events
  const filtered = useMemo(() => {
    return events.filter((ev) => {
      if (selectedStar !== "all" && !ev.starSlugs.includes(selectedStar)) return false;
      if (selectedDayKey) {
        const d = new Date(ev.startsAt);
        if (dateKey(d) !== selectedDayKey) return false;
      }
      return true;
    });
  }, [events, selectedStar, selectedDayKey]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  // Star picker filtered list
  const filteredStars = useMemo(() => {
    if (!starSearch) return stars;
    const q = starSearch.toLowerCase();
    return stars.filter((s) => s.nameEn.toLowerCase().includes(q) || s.nameCn.includes(q));
  }, [stars, starSearch]);

  const selectedStarObj = selectedStar !== "all" ? starsMap.get(selectedStar) : null;
  const WARM_TONES = ["#fff4ee", "#f8f0ff", "#f0f8ff", "#f5fff0"];

  // === Calendar grid math ===
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
  const trailingCells = (7 - ((firstDay + daysInMonth) % 7)) % 7;

  const navMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const onClickDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const k = dateKey(d);
    // Toggle off if clicking same date
    setSelectedDayKey(selectedDayKey === k ? null : k);
  };

  const selectedDateLabel = (() => {
    if (!selectedDayKey) return null;
    const [y, m, d] = selectedDayKey.split("-").map(Number);
    return `${y} 年 ${MONTH_NAMES[m]} ${d} 日`;
  })();

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start lg:gap-8">

      {/* ── LEFT: sticky filter panel ── */}
      <aside className="space-y-4 lg:sticky lg:top-[88px]">

        {/* Interactive mini-calendar */}
        <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
          {/* Header with nav */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-en text-[22px] font-black leading-none tracking-[-0.02em] text-[#1c1c1e]">
                {MONTH_NAMES[viewMonth]}
              </p>
              <p className="font-en text-[11px] text-[#aeaeb2] mt-1">{viewYear}</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => navMonth(-1)}
                aria-label="上一月"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] text-[#6e6e73] transition hover:border-[#f07030] hover:text-[#f07030]"
              >‹</button>
              <button
                onClick={() => navMonth(1)}
                aria-label="下一月"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] text-[#6e6e73] transition hover:border-[#f07030] hover:text-[#f07030]"
              >›</button>
            </div>
          </div>

          {/* Weekday row */}
          <div className="grid grid-cols-7 mb-1">
            {["日","一","二","三","四","五","六"].map((d) => (
              <div key={d} className="text-center font-sans text-[10px] font-bold text-[#aeaeb2] py-1">{d}</div>
            ))}
          </div>

          {/* Day grid (tighter — fixed height cells, not aspect-square) */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`p${i}`} className="h-9 flex items-center justify-center">
                <span className="font-en text-[11px] text-[#e0e0e0]">{daysInPrev - firstDay + i + 1}</span>
              </div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const d = new Date(viewYear, viewMonth, day);
              const k = dateKey(d);
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              const hasEvent = eventsByDay.has(k);
              const isSelected = selectedDayKey === k;

              return (
                <button
                  key={day}
                  onClick={() => hasEvent && onClickDay(day)}
                  disabled={!hasEvent}
                  className={`group relative h-9 flex items-center justify-center rounded-[8px] transition-all select-none
                    ${isSelected ? "bg-[#f07030] shadow-[0_2px_10px_rgba(240,112,48,0.4)]" :
                      hasEvent ? "cursor-pointer hover:bg-[#fff4ee]" :
                      "cursor-default"}`}
                  aria-label={`${MONTH_NAMES[viewMonth]} ${day} 日${hasEvent ? "（有活动）" : ""}`}
                >
                  <span className={`font-en text-[12px] leading-none transition
                    ${isSelected ? "font-black text-white" :
                      isToday ? "font-black text-[#f07030]" :
                      hasEvent ? "font-bold text-[#1c1c1e]" :
                      "text-[#c8c8c8]"}`}>
                    {day}
                  </span>
                  {hasEvent && !isSelected && (
                    <span className={`absolute bottom-1 h-[3px] w-[3px] rounded-full ${isToday ? "bg-[#f07030]" : "bg-[#f07030]/60"}`} />
                  )}
                  {isToday && !isSelected && (
                    <span className="absolute inset-x-1.5 bottom-0.5 h-px bg-[#f07030]/30" />
                  )}
                </button>
              );
            })}
            {Array.from({ length: trailingCells }).map((_, i) => (
              <div key={`n${i}`} className="h-9 flex items-center justify-center">
                <span className="font-en text-[11px] text-[#e0e0e0]">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Legend + clear */}
          <div className="mt-4 pt-4 border-t border-[#e8e8e8] flex items-center justify-between gap-3 text-[10px]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-[6px] w-[6px] rounded-full bg-[#f07030]" />
                <span className="font-cn text-[#6e6e73]">有活动</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-[6px] w-[6px] rounded-sm bg-[#f07030]" />
                <span className="font-cn text-[#6e6e73]">已选</span>
              </div>
            </div>
            {selectedDayKey && (
              <button
                onClick={() => setSelectedDayKey(null)}
                className="font-cn text-[10px] font-bold text-[#f07030] hover:underline"
              >
                清除日期
              </button>
            )}
          </div>
        </div>

        {/* Star picker */}
        <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030] mb-3">选艺人</p>
          <div className="relative">
            <button
              onClick={() => setShowStarPicker(!showStarPicker)}
              className="flex w-full items-center gap-3 rounded-[12px] border border-[#e8e8e8] bg-[#fafafa] px-3 py-2.5 text-left transition hover:border-[#f07030]"
            >
              {selectedStarObj ? (
                <>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f07030] font-en text-[12px] font-black text-white">
                    {selectedStarObj.nameEn.charAt(0)}
                  </div>
                  <span className="font-cn text-[13px] font-bold text-[#1c1c1e] truncate">{selectedStarObj.nameEn}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setSelectedStar("all"); setShowStarPicker(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setSelectedStar("all"); setShowStarPicker(false); } }}
                    className="ml-auto cursor-pointer text-[#aeaeb2] hover:text-[#f07030] text-[16px] leading-none"
                  >×</span>
                </>
              ) : (
                <>
                  <span className="text-[14px]">👤</span>
                  <span className="font-cn text-[13px] text-[#aeaeb2]">选择艺人筛选…</span>
                  <span className="ml-auto text-[#aeaeb2] text-[11px]">▾</span>
                </>
              )}
            </button>

            {showStarPicker && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-[16px] border border-[#e8e8e8] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.15)]">
                <div className="p-3 border-b border-[#e8e8e8]">
                  <input
                    autoFocus
                    value={starSearch}
                    onChange={(e) => setStarSearch(e.target.value)}
                    placeholder="搜索艺人名字…"
                    className="w-full rounded-[10px] border border-[#e8e8e8] bg-[#fafafa] px-3 py-2 font-cn text-[13px] outline-none focus:border-[#f07030]"
                  />
                </div>
                <div className="max-h-[280px] overflow-y-auto p-2">
                  <button
                    onClick={() => { setSelectedStar("all"); setShowStarPicker(false); setStarSearch(""); }}
                    className="w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 hover:bg-[#fafafa] transition"
                  >
                    <span className="text-[18px]">🌟</span>
                    <span className="font-cn text-[13px] text-[#6e6e73]">全部艺人</span>
                  </button>
                  {filteredStars.map((star) => (
                    <button
                      key={star.slug}
                      onClick={() => { setSelectedStar(star.slug); setShowStarPicker(false); setStarSearch(""); }}
                      className={`w-full flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition hover:bg-[#fff4ee] ${selectedStar === star.slug ? "bg-[#fff4ee]" : ""}`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f07030] font-en text-[11px] font-black text-white">
                        {star.nameEn.charAt(0)}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-en text-[13px] font-bold text-[#1c1c1e] truncate">{star.nameEn}</p>
                        <p className="font-cn text-[11px] text-[#aeaeb2] truncate">{star.nameCn}</p>
                      </div>
                      {selectedStar === star.slug && (
                        <span className="ml-auto text-[#f07030] text-[14px]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result summary */}
          <div className="mt-4 pt-4 border-t border-[#e8e8e8] flex items-baseline gap-2">
            <span className="font-en text-[22px] font-black text-[#f07030] leading-none">{filtered.length}</span>
            <span className="font-cn text-[12px] text-[#aeaeb2]">场活动</span>
            {(selectedStar !== "all" || selectedDayKey) && (
              <button
                onClick={() => { setSelectedStar("all"); setSelectedDayKey(null); }}
                className="ml-auto font-cn text-[11px] text-[#f07030] hover:underline"
              >
                清除全部 ×
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── RIGHT: results ── */}
      <div>
        {/* Context bar */}
        <div className="mb-6 flex items-end justify-between gap-3 border-b border-[#e8e8e8] pb-4">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f07030] mb-1.5">活动列表</p>
            <h2 className="font-sans text-[22px] font-extrabold tracking-[-0.01em] text-[#1c1c1e] md:text-[26px]">
              {selectedDateLabel
                ? selectedDateLabel
                : selectedStarObj
                  ? `${selectedStarObj.nameEn} 的活动`
                  : "未来几个月活动"}
            </h2>
          </div>
          <p className="font-cn text-[12px] text-[#aeaeb2]">
            共 <span className="font-en text-[14px] font-black text-[#f07030]">{filtered.length}</span> 场
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[20px] border border-[#e8e8e8] bg-white p-12 text-center">
            <p className="text-[36px] mb-3">🔍</p>
            <p className="font-cn text-[15px] font-bold text-[#1c1c1e] mb-2">没有找到匹配的活动</p>
            <p className="font-cn text-[12px] text-[#6e6e73]">试试换个筛选条件，或清除筛选查看全部</p>
            <button
              onClick={() => { setSelectedStar("all"); setSelectedDayKey(null); }}
              className="mt-5 font-cn rounded-full bg-[#f07030] px-5 py-2 text-[12px] font-bold text-white hover:bg-[#d95820] transition"
            >
              显示全部活动
            </button>
          </div>
        ) : (
          <div className="space-y-9">
            {Array.from(grouped.entries()).map(([key, monthEvents]) => {
              const [year, monthIdx] = key.split("-").map(Number);
              return (
                <div key={key}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-en text-[18px] font-black tracking-[-0.02em] text-[#1c1c1e] md:text-[20px]">
                      {year} 年 {MONTH_NAMES[monthIdx]}
                    </h3>
                    <span className="font-cn rounded-full bg-[#fff4ee] px-3 py-1 text-[10px] font-bold text-[#f07030]">
                      {monthEvents.length} 场
                    </span>
                  </div>

                  <div className="space-y-3">
                    {monthEvents.map((event, index) => {
                      const date = new Date(event.startsAt);
                      const posterStar = event.starSlugs.map((sl) => starsMap.get(sl)).filter(Boolean)[0];

                      return (
                        <Link key={event.slug} href={`/events/${event.slug}`}
                          className="group flex gap-4 rounded-[18px] border border-[#e8e8e8] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:border-[#f07030]/20 hover:shadow-[0_8px_24px_rgba(240,112,48,0.12)] md:p-5">

                          <div className="w-[58px] shrink-0 rounded-[12px] py-2.5 text-center border border-[#e8e8e8]"
                               style={{ backgroundColor: WARM_TONES[index % WARM_TONES.length] }}>
                            <p className="font-en text-[24px] font-black leading-none text-[#1c1c1e]">
                              {format(date, "dd")}
                            </p>
                            <p className="font-en text-[9px] uppercase tracking-[0.1em] text-[#f07030] mt-1">
                              {format(date, "EEE", { locale: zhCN })}
                            </p>
                          </div>

                          {posterStar ? (
                            <div className="hidden h-[68px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#0f0f10] font-en text-[22px] font-black text-[#f07030]/30 sm:flex">
                              {posterStar.nameEn.charAt(0)}
                            </div>
                          ) : null}

                          <div className="flex-1 min-w-0">
                            {posterStar ? (
                              <p className="font-en text-[10px] uppercase tracking-[0.1em] text-[#f07030] font-bold mb-1">
                                {posterStar.nameEn}
                              </p>
                            ) : null}
                            <p className="font-cn text-[14px] font-bold text-[#1c1c1e] leading-[1.45] md:text-[15px]">
                              {event.summary}
                            </p>
                            <p className="font-en mt-1 text-[10px] text-[#aeaeb2] truncate">{event.title}</p>
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {event.city ? (
                                <span className="font-cn rounded-full border border-[#e8e8e8] bg-[#fafafa] px-2.5 py-0.5 text-[10px] text-[#6e6e73]">
                                  📍 {event.city}
                                </span>
                              ) : null}
                              {event.venue ? (
                                <span className="font-cn rounded-full border border-[#e8e8e8] bg-[#fafafa] px-2.5 py-0.5 text-[10px] text-[#6e6e73]">
                                  {event.venue}
                                </span>
                              ) : null}
                              <span className="font-cn rounded-full bg-[#fff4ee] px-2.5 py-0.5 text-[10px] text-[#f07030] font-bold">
                                {TYPE_LABEL[event.type] ?? event.type}
                              </span>
                              {event.ticketStatus ? (
                                <span className="font-cn rounded-full border border-[#e8e8e8] bg-[#fafafa] px-2.5 py-0.5 text-[10px] text-[#6e6e73]">
                                  {event.ticketStatus}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="hidden shrink-0 items-center self-center md:flex">
                            <span className="font-en text-[18px] text-[#d0d0d0] transition group-hover:text-[#f07030]">›</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
