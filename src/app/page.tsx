import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { listEvents, listServices, listStars } from "@/lib/data";
import { getImageObjectPosition } from "@/lib/image-focus";
import { buildPageMetadata } from "@/lib/metadata";
import { primarySourceShowcaseEntries, sourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "泰国艺人一站式追星平台",
  description:
    "泰饭网 taifan.club — 泰国顶级艺人一站式追星平台，汇总七大公司艺人、活动日历、代办服务和周边入口。",
  path: "/",
});

const posterTones = ["#fff4ee", "#e8f4ff", "#f0fff0", "#fff0f7"];
const eventTypeLabels: Record<string, string> = {
  fanmeeting: "见面会",
  concert: "演唱会",
  brand: "品牌活动",
  broadcast: "直播",
  variety: "综艺",
  airport: "机场行程",
  event: "活动",
};

const productTemplates = [
  { kind: "写真集", price: "¥299", badge: "NEW" },
  { kind: "亚克力立牌", price: "¥129", badge: "HOT" },
  { kind: "随机小卡", price: "¥49", badge: "LIMITED" },
  { kind: "应援套组", price: "¥239", badge: "PREORDER" },
];

export default async function HomePage() {
  await connection();
  const [stars, events, services] = await Promise.all([listStars(), listEvents(), listServices()]);
  const serviceIcons = ["🎫", "🧭", "📝"];
  const heroStars = stars.slice(0, 3);
  const featuredArtists = stars.slice(0, 8);
  const upcomingEvents = events.slice(0, 18);
  const servicePreview = services.slice(0, 3);
  const groupedCompanies = primarySourceShowcaseEntries.map((entry) => ({
    ...entry,
    members: stars.filter((star) => entry.commonStarSlugs?.includes(star.slug)),
  }));

  const shopPreview = featuredArtists.slice(0, 4).map((star, index) => ({
    star,
    ...productTemplates[index % productTemplates.length],
  }));

  const miniCalendarDays = Array.from({ length: 35 }, (_, index) => {
    const day = index - 2;
    const label = day < 1 ? day + 30 : day > 31 ? day - 31 : day;
    const eventCount = upcomingEvents.filter((event) => new Date(event.startsAt).getDate() === day).length;
    return {
      key: `${index}-${label}`,
      label,
      isOther: day < 1 || day > 31,
      isToday: day === 18,
      dots: Math.min(eventCount, 3),
    };
  });

  const upcomingMonths = upcomingEvents.reduce<
    Array<{
      key: string;
      label: string;
      events: typeof upcomingEvents;
    }>
  >((groups, event) => {
    const date = new Date(event.startsAt);
    const key = format(date, "yyyy-MM");
    const label = format(date, "yyyy 年 M 月", { locale: zhCN });
    const existing = groups.find((group) => group.key === key);

    if (existing) {
      existing.events.push(event);
      return groups;
    }

    groups.push({ key, label, events: [event] });
    return groups;
  }, []);

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[680px] w-[680px] rounded-full bg-[radial-gradient(ellipse,rgba(240,112,48,0.1)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-[-120px] left-[120px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(ellipse,rgba(240,112,48,0.06)_0%,transparent_70%)]" />
        <div className="page-shell mx-auto grid min-h-screen max-w-[1440px] items-center gap-10 pb-[60px] pt-[108px] lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4ee] px-[18px] py-[7px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#f07030]">
              Fan platform
            </span>
            <h1 className="mt-6 max-w-[720px] font-sans text-[clamp(42px,5.5vw,80px)] font-extrabold leading-[1.08] tracking-[-0.05em] text-[#1c1c1e]">
              泰国艺人
              <br />
              一站式追星平台
            </h1>
            <p className="font-cn mt-6 max-w-[520px] text-[17px] leading-[1.85] text-[#6e6e73]">
              聚合七大泰国娱乐公司艺人、活动日历、代办服务和周边入口。用中文解释重点，同时保留原始名字，方便你继续搜官方内容、票务页和场馆信息。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 rounded-full bg-[#f07030] px-8 py-[14px] text-[15px] font-extrabold text-white shadow-[0_8px_28px_rgba(240,112,48,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d95820]"
              >
                查看艺人
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8e8e8] px-8 py-[14px] text-[15px] font-extrabold text-[#1c1c1e] transition-all duration-200 hover:border-[#f07030] hover:text-[#f07030]"
              >
                立即预约
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[370px] w-[305px] sm:h-[410px] sm:w-[338px] lg:h-[445px] lg:w-[365px]">
              {heroStars[1] ? (
                <div className="absolute left-0 top-1/2 z-[2] h-[205px] w-[146px] -translate-y-1/2 rotate-[-6deg] overflow-hidden rounded-[22px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.1)] opacity-80 sm:h-[228px] sm:w-[160px] lg:h-[246px] lg:w-[172px]">
                  <div className="relative h-[70%] w-full bg-[linear-gradient(135deg,#e8f4ff,#cce0ff)]">
                    <Image
                      src={heroStars[1].coverUrl}
                      alt={heroStars[1].nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(heroStars[1].coverUrl, "poster") }}
                    />
                  </div>
                  <div className="p-[14px]">
                    <p className="font-en text-[14px] font-black text-[#1c1c1e]">{heroStars[1].nameEn}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#f07030]">{heroStars[1].agency}</p>
                  </div>
                </div>
              ) : null}
              {heroStars[2] ? (
                <div className="absolute right-0 top-1/2 z-[2] h-[205px] w-[146px] -translate-y-1/2 rotate-[6deg] overflow-hidden rounded-[22px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.1)] opacity-80 sm:h-[228px] sm:w-[160px] lg:h-[246px] lg:w-[172px]">
                  <div className="relative h-[70%] w-full bg-[linear-gradient(135deg,#f0fff0,#c8f0c8)]">
                    <Image
                      src={heroStars[2].coverUrl}
                      alt={heroStars[2].nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(heroStars[2].coverUrl, "poster") }}
                    />
                  </div>
                  <div className="p-[14px]">
                    <p className="font-en text-[14px] font-black text-[#1c1c1e]">{heroStars[2].nameEn}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#f07030]">{heroStars[2].agency}</p>
                  </div>
                </div>
              ) : null}
              {heroStars[0] ? (
                <div className="absolute left-1/2 top-1/2 z-[3] h-[268px] w-[196px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.1)] sm:h-[292px] sm:w-[214px] lg:h-[312px] lg:w-[228px]">
                  <div className="relative h-[70%] w-full bg-[linear-gradient(135deg,#fff4ee,#ffe0cc)]">
                    <Image
                      src={heroStars[0].coverUrl}
                      alt={heroStars[0].nameEn}
                      fill
                      className="object-cover"
                      style={{ objectPosition: getImageObjectPosition(heroStars[0].coverUrl, "hero") }}
                    />
                  </div>
                  <div className="p-[14px]">
                    <p className="font-en text-[14px] font-black text-[#1c1c1e]">{heroStars[0].nameEn}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#f07030]">{heroStars[0].agency}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1c1c1e]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap">
            {[
              { value: `${stars.length}`, label: "追踪艺人" },
              { value: `${groupedCompanies.length}`, label: "合作公司" },
              { value: `${events.length}`, label: "活动条目" },
              { value: `${sourceShowcaseEntries.length}`, label: "官方来源" },
            ].map((item) => (
            <div
              key={item.label}
              className="min-w-1/2 flex-1 border-b border-r border-white/[0.08] px-5 py-7 text-center last:border-r-0 md:min-w-0 md:border-b-0"
            >
              <p className="font-en text-[36px] font-black leading-none text-[#f07030]">{item.value}</p>
              <p className="mt-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-white/45">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="page-shell mx-auto max-w-[1440px]">
          <div className="mb-12">
            <div className="sec-tag">Companies</div>
            <h2 className="lattice-title text-[clamp(26px,3.5vw,44px)]">合作公司</h2>
            <p className="font-cn mt-3 max-w-[620px] text-[16px] leading-[1.75] text-[#6e6e73]">这里先帮你看清公司版图和关联艺人。重点是快速分清哪个公司更偏活动、哪个公司更偏视频或预售，不再和下面“最新一条”重复。</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {groupedCompanies.map((company) => (
              <div
                key={company.slug}
                className="rounded-[24px] border-2 border-transparent bg-[#fafafa] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#f07030] hover:bg-white hover:shadow-[0_12px_32px_rgba(240,112,48,0.15)]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-[16px] border border-[#f2e6df] bg-white">
                    <Image src={company.logoPath} alt={company.company} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <p className="font-en text-[15px] font-black text-[#1c1c1e]">{company.company}</p>
                    <p className="mt-1 font-cn text-[12px] text-[#aeaeb2]">
                      {company.members.length ? `${company.members.length} 位关联艺人` : "官方来源已接入"}
                    </p>
                  </div>
                </div>
                <p className="font-cn mt-4 text-[12px] font-bold text-[#f07030]">{company.meta}</p>
                <p className="font-cn mt-2 line-clamp-2 text-[13px] leading-[1.75] text-[#6e6e73]">
                  {company.members.length
                    ? `当前站内重点覆盖 ${company.members
                        .slice(0, 3)
                        .map((member) => member.nameCn)
                        .join("、")}${company.members.length > 3 ? " 等艺人" : ""}。`
                    : "当前先接入了这家公司的官方公开入口，后续会继续补艺人资料和活动线。"}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-cn text-[12px] text-[#1c1c1e]">
                    {company.ingestion?.mode === "youtube-videos"
                      ? "视频更新型"
                      : company.ingestion?.mode === "facebook-posts"
                        ? "预售/上新型"
                        : "新闻/活动型"}
                  </span>
                  <Link href="/artists" className="font-cn text-[12px] font-bold text-[#1c1c1e]">
                    看艺人库
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="page-shell mx-auto max-w-[1440px]">
          <div className="mb-12">
            <div className="sec-tag">Official updates</div>
            <h2 className="lattice-title text-[clamp(26px,3.5vw,44px)]">七家公司最新一条</h2>
            <p className="font-cn mt-3 max-w-[620px] text-[16px] leading-[1.75] text-[#6e6e73]">把我们已经接好的七家主来源直接铺出来。你不用先去外站翻，先在站里看标题、公司、来源模式，再决定要追哪条内容。</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {primarySourceShowcaseEntries.map((entry) => (
              <Link
                key={`${entry.slug}-update`}
                href={entry.url}
                className="rounded-[22px] border border-[#ece8e2] bg-white p-5 shadow-[0_2px_18px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(240,112,48,0.12)]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-[14px] bg-[#fff7f3]">
                    <Image src={entry.logoPath} alt={entry.company} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <p className="font-en text-[14px] font-black text-[#1c1c1e]">{entry.company}</p>
                    <p className="font-cn mt-1 text-[11px] text-[#aeaeb2]">{entry.meta}</p>
                  </div>
                </div>
                <p className="font-cn mt-4 line-clamp-2 text-[15px] font-bold leading-[1.7] text-[#1c1c1e]">{entry.title}</p>
                <p className="font-cn mt-3 line-clamp-3 text-[13px] leading-[1.8] text-[#6e6e73]">{entry.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap bg-[#fafafa]">
        <div className="page-shell mx-auto max-w-[1440px]">
          <div className="mb-12">
            <div className="sec-tag">Featured Artists</div>
            <h2 className="lattice-title text-[clamp(26px,3.5vw,44px)]">热门艺人</h2>
            <p className="font-cn mt-3 max-w-[520px] text-[16px] leading-[1.75] text-[#6e6e73]">先从最常被中国粉丝关注的几位开始，快速进入状态。</p>
          </div>
          <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredArtists.map((star, index) => (
              <Link
                key={star.slug}
                href={`/stars/${star.slug}`}
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-[7px] hover:shadow-[0_16px_40px_rgba(240,112,48,0.18)]"
              >
                <div
                  className="relative aspect-[7/8] sm:aspect-[5/6] lg:aspect-[7/8]"
                  style={{ backgroundColor: posterTones[index % posterTones.length] }}
                >
                  <Image
                    src={star.coverUrl}
                    alt={star.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(star.coverUrl, "poster") }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 font-cn text-[11px] font-bold text-[#6e6e73]">
                    {star.baseCity || "Thailand"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-en text-[17px] font-black text-[#1c1c1e]">{star.nameEn}</p>
                  <p className="font-cn mt-1 text-[12px] text-[#aeaeb2]">{star.nameCn}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-cn text-[12px] font-bold text-[#f07030]">{star.agency}</span>
                    <span className="font-cn text-[12px] text-[#aeaeb2]">{star.tags[0] ?? "艺人"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="page-shell mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-2">
          <div className="rounded-[24px] bg-[#fafafa] p-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-en text-[22px] font-black text-[#1c1c1e]">May 2026</p>
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#e8e8e8] text-[#6e6e73]">←</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#e8e8e8] text-[#6e6e73]">→</button>
              </div>
            </div>
            <div className="mb-2 grid grid-cols-7">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-1 text-center font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#aeaeb2]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-[2px]">
              {miniCalendarDays.map((day) => (
                <div
                  key={day.key}
                  className={`aspect-square rounded-[10px] px-[3px] py-[6px] ${
                    day.isToday ? "bg-[#f07030]" : "hover:bg-[#fff4ee]"
                  } ${day.isOther ? "opacity-30" : ""}`}
                >
                  <p className={`text-center text-[12px] font-bold ${day.isToday ? "text-white" : "text-[#1c1c1e]"}`}>{day.label}</p>
                  <div className="mt-[2px] flex justify-center gap-[2px]">
                    {Array.from({ length: day.dots }).map((_, index) => (
                      <span key={`${day.key}-${index}`} className="h-1 w-1 rounded-full bg-[#f07030]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-en text-[22px] font-black text-[#1c1c1e]">未来几个月活动</h3>
                <p className="font-cn mt-1 text-[12px] text-[#aeaeb2]">按月份看接下来几个月已经写进日历的公开活动。</p>
              </div>
              <Link href="/calendar" className="font-sans text-[13px] font-bold text-[#f07030]">
                查看全部
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMonths.map((month) => (
                <div key={month.key} className="rounded-[18px] border border-[#ece8e2] bg-white p-4 shadow-[0_2px_18px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-cn text-[15px] font-bold text-[#1c1c1e]">{month.label}</p>
                    <span className="font-cn rounded-full bg-[#fff4ee] px-3 py-1 text-[11px] font-bold text-[#f07030]">
                      {month.events.length} 场已排进日历
                    </span>
                  </div>
                  <div className="space-y-3">
                    {month.events.map((event) => (
                      <Link
                        key={event.slug}
                        href={`/events/${event.slug}`}
                        className="block rounded-[12px] border-l-4 border-[#f07030] bg-[#fafafa] p-4 transition-all duration-200 hover:translate-x-1 hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                      >
                        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#aeaeb2]">
                          {format(new Date(event.startsAt), "M 月 d 日 · EEEE", { locale: zhCN })}
                        </p>
                        <p className="mt-1 font-cn text-[14px] font-bold text-[#1c1c1e]">{event.title}</p>
                        <p className="mt-1 font-cn text-[12px] text-[#6e6e73]">
                          {event.city} · {event.venue}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-[#fff4ee] px-3 py-1 font-cn text-[11px] font-bold text-[#f07030]">
                          {eventTypeLabels[event.type] ?? event.type}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap bg-[#fafafa]">
        <div className="page-shell mx-auto max-w-[1440px]">
          <div className="mb-12">
            <div className="sec-tag">Services</div>
            <h2 className="lattice-title text-[clamp(26px,3.5vw,44px)]">代办服务</h2>
            <p className="font-cn mt-3 max-w-[520px] text-[16px] leading-[1.75] text-[#6e6e73]">从抢票、行程、翻译到礼物代送，把容易卡住的环节先帮你处理掉。</p>
          </div>
          <div className="grid gap-[22px] lg:grid-cols-3">
            {servicePreview.map((service, index) => (
              <Link
                key={service.slug}
                href="/services"
                className="relative overflow-hidden rounded-[20px] bg-white px-[26px] py-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(240,112,48,0.15)]"
              >
                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-[#f07030] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="text-[40px]">{serviceIcons[index % serviceIcons.length]}</div>
                <p className="mt-4 font-cn text-[18px] font-extrabold text-[#1c1c1e]">{service.title}</p>
                <p className="mt-3 font-cn text-[13px] leading-[1.7] text-[#6e6e73]">{service.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-sans text-[13px] font-extrabold text-[#f07030]">
                  查看服务
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="page-shell mx-auto max-w-[1440px]">
          <div className="mb-12">
            <div className="sec-tag">Shop</div>
            <h2 className="lattice-title text-[clamp(26px,3.5vw,44px)]">周边商城</h2>
            <p className="font-cn mt-3 max-w-[520px] text-[16px] leading-[1.75] text-[#6e6e73]">写真集、应援棒、随机小卡和套组周边，先看当前最热的几件。</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {shopPreview.map((item, index) => (
              <Link
                key={`${item.star.slug}-${item.kind}`}
                href="/shop"
                className="overflow-hidden rounded-[20px] bg-[#fafafa] shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <div className="relative aspect-square" style={{ backgroundColor: posterTones[index % posterTones.length] }}>
                  <Image
                    src={item.star.coverUrl}
                    alt={item.star.nameEn}
                    fill
                    className="object-cover"
                    style={{ objectPosition: getImageObjectPosition(item.star.coverUrl, "poster") }}
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-[#f07030] px-3 py-1 font-sans text-[10px] font-extrabold text-white">
                    {item.badge}
                  </span>
                </div>
                <div className="bg-white p-4">
                  <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#f07030]">{item.star.agency}</p>
                  <p className="mt-2 font-cn text-[13px] font-bold leading-[1.45] text-[#1c1c1e]">
                    {item.star.nameCn} {item.kind}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-en text-[20px] font-black text-[#1c1c1e]">{item.price}</p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f07030] text-white">+</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1c1c1e] px-[min(6vw,80px)] py-20 text-center">
        <div className="mx-auto max-w-[760px]">
          <h2 className="font-sans text-[clamp(28px,4vw,52px)] font-extrabold tracking-[-0.04em] text-white">
            一站进入
            <span className="text-[#f07030]"> 泰娱现场。</span>
          </h2>
          <p className="font-cn mx-auto mt-4 max-w-[500px] text-[17px] leading-[1.8] text-white/55">
            从艺人、活动、周边到代办服务，把新粉最容易迷路的地方都收进同一个入口。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-[14px] text-[15px] font-extrabold text-[#1c1c1e] shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-[#fff4ee] hover:text-[#f07030]"
            >
              立即预约
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-[14px] text-[15px] font-extrabold text-white transition-all duration-200 hover:border-[#f07030] hover:text-[#f07030]"
            >
              浏览周边
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
