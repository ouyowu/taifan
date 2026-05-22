import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarClock, FileText, Radio, Sparkles, Users } from "lucide-react";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { listEvents, listServices, listStars } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { EVENT_TYPE_LABELS } from "@/lib/constants";
import { primarySourceShowcaseEntries } from "@/lib/source-showcase";

export const metadata: Metadata = buildPageMetadata({
  title: "泰国艺人一站式追星平台",
  description:
    "泰饭网 taifan.club — 用中文整理泰国艺人、活动日历、官方来源和人工运营快读。",
  path: "/",
});

export default async function HomePage() {
  await connection();
  const [stars, events, services] = await Promise.all([listStars(), listEvents(), listServices()]);

  const topStars = stars.slice(0, 10);
  const servicePreview = services.slice(0, 3);

  const monthGroups = events.slice(0, 18).reduce<
    Array<{ key: string; label: string; items: typeof events }>
  >((groups, event) => {
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
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="editorial-kicker">Editorial desk</p>
            <h1 className="mt-4 max-w-[860px] font-sans text-[clamp(40px,6.8vw,92px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              用中文进入
              <br />
              泰娱内容现场。
            </h1>
            <p className="font-cn mt-6 max-w-[700px] text-[17px] leading-[1.95] text-[#5d6268]">
              泰饭网把七家公司艺人、未来几个月活动、最新动态和服务支持收在一个入口里。
              这一版先回到文字优先，让你先读懂谁值得追、接下来哪里有活动、今天最该先看哪条内容。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/artists" className="editorial-button-primary">
                进入艺人库
              </Link>
              <Link href="/news" className="editorial-button-secondary">
                查看动态 desk
              </Link>
              <Link href="/calendar" className="editorial-button-secondary">
                打开活动日历
              </Link>
            </div>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">At a glance</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Users className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{stars.length}</p>
                <p className="editorial-brief-label">追踪艺人</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><CalendarClock className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{events.length}</p>
                <p className="editorial-brief-label">活动条目</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Radio className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{primarySourceShowcaseEntries.length}</p>
                <p className="editorial-brief-label">官方来源</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><FileText className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{servicePreview.length}</p>
                <p className="editorial-brief-label">服务入口</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 border-t border-[#ece8e2] pt-6">
              <p className="font-cn text-[13px] font-bold text-[#1c1c1e]">这一版怎么读</p>
              <p className="font-cn text-[13px] leading-[1.85] text-[#666b70]">
                上面先给你总览，下面分成四条主线：重点艺人、接下来几个月活动、七家公司来源入口，以及人工服务 desk。
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="editorial-lead-card">
            <p className="editorial-kicker">Cover story</p>
            <h2 className="mt-4 font-sans text-[30px] font-black leading-[1] tracking-[-0.04em] text-[#1c1c1e] md:text-[42px]">
              先从头部艺人进入，再决定你要追哪条线。
            </h2>
            <div className="editorial-inline-note mt-4">
              <Sparkles className="h-4 w-4" />
              <span>建议先从 3 到 5 位主追艺人开始，再往活动和动态页延伸。</span>
            </div>
            <p className="font-cn mt-4 max-w-[760px] text-[14px] leading-[1.9] text-[#5d6268]">
              这不是图库首页，而是一张编辑入口页。先用 Top roster 看中国粉丝最常追的艺人，再去活动和动态页接住今天的更新。
            </p>
            <div className="mt-8 space-y-3">
              {topStars.slice(0, 6).map((star, index) => (
                <Link key={star.slug} href={`/stars/${star.slug}`} className="editorial-directory-row">
                  <div className="flex items-start gap-4">
                    <span className="editorial-list-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-en text-[17px] font-black text-[#1c1c1e]">{star.nameEn}</p>
                      <p className="font-cn mt-1 text-[13px] text-[#7a7f85]">{star.nameCn}</p>
                    </div>
                  </div>
                  <p className="font-cn text-[12px] text-[#f07030]">{star.agency}</p>
                </Link>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="editorial-sidebar-block">
              <p className="editorial-kicker">Reading order</p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    index: "01",
                    title: "先看头部艺人",
                    description: "先从左侧 Top roster 选 3 到 5 位艺人，建立你自己的主追名单。",
                  },
                  {
                    index: "02",
                    title: "再看未来活动",
                    description: "接着去看 6 到 10 月的活动月份区，先圈出你会真正跟的城市和场次。",
                  },
                  {
                    index: "03",
                    title: "最后补动态与原文",
                    description: "确认要追哪条线后，再进动态页和官方来源索引，补整理稿和原文入口。",
                  },
                ].map((item) => (
                  <div key={item.index} className="editorial-list-card-compact">
                    <div className="flex items-start gap-3">
                      <span className="editorial-list-index">{item.index}</span>
                      <div>
                        <p className="font-cn text-[14px] font-bold text-[#1c1c1e]">{item.title}</p>
                        <p className="font-cn mt-1 text-[12px] leading-[1.8] text-[#6c7076]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="editorial-sidebar-block">
              <p className="editorial-kicker">Service desk</p>
              <div className="mt-4 space-y-4">
                {servicePreview.map((service) => (
                  <div key={service.slug} className="editorial-list-card-compact">
                    <div>
                      <p className="font-cn text-[15px] font-bold text-[#1c1c1e]">{service.title}</p>
                      <p className="font-cn mt-1 text-[12px] leading-[1.75] text-[#6c7076]">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/services" className="editorial-link">
                  去服务页 →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12 md:pb-16">
        <div className="mb-8">
          <p className="editorial-kicker">Calendar watch</p>
          <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e] md:text-[42px]">
            未来几个月活动
          </h2>
          <p className="font-cn mt-3 max-w-[760px] text-[14px] leading-[1.9] text-[#5d6268]">
            截止到 10 月前，先把值得提前准备的活动排清楚。重点是让你快速知道哪个月有什么、哪条线是谁在跑、该先补哪场活动的攻略。
          </p>
          <div className="editorial-inline-note mt-4">
            <CalendarClock className="h-4 w-4" />
            <span>每个月先看 3 到 4 场重点活动，避免一开始信息量太满。</span>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {monthGroups.map((group) => (
            <section key={group.key} className="editorial-month-card">
              <div className="flex items-center justify-between gap-3 border-b border-[#ece8e2] pb-4">
                <div>
                  <p className="font-en text-[18px] font-black text-[#1c1c1e]">{group.label}</p>
                  <p className="font-cn mt-1 text-[12px] text-[#7a7f85]">{group.items.length} 场已排入站内日历</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {group.items.slice(0, 4).map((event) => (
                  <Link key={event.slug} href={`/events/${event.slug}`} className="editorial-list-card-compact">
                    <div>
                      <p className="font-cn text-[14px] font-bold leading-[1.65] text-[#1c1c1e]">{event.title}</p>
                      <p className="font-cn mt-1 text-[12px] text-[#6c7076]">
                        {format(new Date(event.startsAt), "M 月 d 日 HH:mm", { locale: zhCN })} · {event.city}
                      </p>
                    </div>
                    <span className="editorial-chip-muted">{EVENT_TYPE_LABELS[event.type] ?? "活动"}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12 md:pb-16">
        <div className="mb-8">
          <p className="editorial-kicker">Official sources</p>
          <h2 className="mt-3 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e] md:text-[42px]">
            七家公司最新一条
          </h2>
          <p className="font-cn mt-3 max-w-[760px] text-[14px] leading-[1.9] text-[#5d6268]">
            这一块不靠图，直接把来源、公司、标题和一句用途讲清楚。你可以先看是哪家公司、是视频更新还是预售帖，再决定要不要继续追全文。
          </p>
          <div className="editorial-inline-note mt-4">
            <Radio className="h-4 w-4" />
            <span>这里更像一张来源索引卡，方便你先辨认公司和入口类型。</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {primarySourceShowcaseEntries.map((entry) => (
            <Link key={entry.slug} href={entry.url} className="editorial-list-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-en text-[16px] font-black text-[#1c1c1e]">{entry.company}</p>
                  <p className="font-cn mt-1 text-[12px] text-[#f07030]">{entry.meta}</p>
                </div>
                <span className="editorial-chip-muted">
                  {entry.ingestion?.mode === "youtube-videos"
                    ? "视频更新"
                    : entry.ingestion?.mode === "facebook-posts"
                      ? "预售/上新"
                      : "官网更新"}
                </span>
              </div>
              <p className="font-cn mt-4 text-[14px] font-bold leading-[1.8] text-[#1c1c1e]">{entry.title}</p>
              <p className="font-cn mt-3 text-[13px] leading-[1.85] text-[#666b70]">{entry.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
