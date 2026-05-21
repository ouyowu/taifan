import Link from "next/link";
import Image from "next/image";

import { primarySourceShowcaseEntries } from "@/lib/source-showcase";

export function SiteFooter() {
  return (
    <footer className="bg-[#1c1c1e] px-[18px] pt-[72px] sm:px-8 lg:px-[80px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[60px] border-b border-white/[0.08] pb-[60px] md:grid-cols-2 md:gap-10 sm:grid-cols-1">
          <div>
            <Link href="/" className="block text-[22px] font-extrabold tracking-tight text-white">
              <span className="font-cn">泰</span>
              <span className="font-cn text-[#f07030]">饭</span>
              <span className="font-cn">网</span>
            </Link>
            <p className="mt-3 max-w-[260px] font-cn text-[14px] leading-[1.8] text-white/40">
              taifan.club — 泰国顶级艺人一站式追星平台，官方来源优先，内容经过人工审核。
            </p>
            <div className="mt-6 flex gap-2">
              {["📘", "📷", "🐦", "🌸", "🌐"].map((icon) => (
                <span
                  key={icon}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[15px] text-white transition-all hover:border-[#f07030] hover:bg-[#f07030]"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-[18px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#f07030]">发现内容</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">首页</Link>
              <Link href="/artists" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">艺人</Link>
              <Link href="/calendar" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">活动日历</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-[18px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#f07030]">粉丝入口</h4>
            <div className="flex flex-col gap-3">
              <Link href="/services" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">代办服务</Link>
              <Link href="/shop" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">周边商城</Link>
              <Link href="/guides" className="font-cn text-[14px] font-medium text-white/45 transition-colors hover:text-white">新粉攻略</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-[18px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#f07030]">站点原则</h4>
            <div className="flex flex-col gap-3">
              <p className="font-cn text-[14px] font-medium leading-[1.7] text-white/45">官方来源优先</p>
              <p className="font-cn text-[14px] font-medium leading-[1.7] text-white/45">中文解释 + 原文保留</p>
              <p className="font-cn text-[14px] font-medium leading-[1.7] text-white/45">适合中国粉丝快速进入状态</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-b border-white/[0.08] py-8 md:grid-cols-4 sm:grid-cols-2">
          {primarySourceShowcaseEntries.map((entry) => (
            <div key={`${entry.slug}-footer`} className="flex items-center gap-3 rounded-[16px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-[12px] bg-white">
                <Image src={entry.logoPath} alt={entry.company} fill className="object-contain p-2" />
              </div>
              <div>
                <p className="font-en text-[13px] font-black text-white">{entry.company}</p>
                <p className="font-cn mt-1 text-[11px] text-white/40">{entry.meta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between py-[22px] sm:flex-col sm:gap-2 sm:text-center">
          <p className="text-[13px] font-normal text-white/30">© 2025 泰饭网 taifan.club · All rights reserved.</p>
          <p className="text-[13px] font-normal text-white/30">泰国追星 · 专业代办 · 正品保障</p>
        </div>
      </div>
    </footer>
  );
}
