import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { headers } from "next/headers";

import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export async function SiteHeader() {
  const headerStore = await headers();
  const pathname = headerStore.get("x-current-pathname") ?? "";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[68px] border-b border-[#f07030]/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[18px] sm:px-8 lg:px-[80px]">
        <Link href="/" className="flex items-center gap-3 text-[#1c1c1e]">
          <div>
            <p className="font-cn text-[22px] font-extrabold tracking-tight text-[#1c1c1e]">
              泰<span className="text-[#f07030]">饭</span>网
            </p>
            <p className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[#aeaeb2]">taifan.club</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-cn text-[13px] font-semibold tracking-[0.02em] transition-colors duration-200 hover:text-[#f07030] ${
                active ? "text-[#f07030]" : "text-[#6e6e73]"
              }`}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4ee] px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f07030]">
            <ShieldCheck className="h-3.5 w-3.5" />
            已审核内容
          </span>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e8e8e8] px-5 py-2 text-[13px] font-bold text-[#1c1c1e] transition-all duration-200 hover:border-[#f07030] hover:text-[#f07030]"
          >
            🛒 购物车
          </Link>
          <Link
            href="/services"
            className="shadow-[0_8px_28px_rgba(240,112,48,0.22)] inline-flex items-center gap-2 rounded-full bg-[#f07030] px-5 py-2 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#d95820]"
          >
            立即预约
          </Link>
        </div>

        <Sheet>
          <SheetTrigger
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1c1c1e] transition-colors duration-200 hover:bg-[#fff4ee] lg:hidden",
            )}
          >
            <span className="flex flex-col gap-[5px] p-1">
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
              <span className="block h-[2px] w-6 rounded bg-[#1c1c1e]" />
            </span>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-[#e8e8e8] bg-white text-[#1c1c1e]">
            <SheetHeader>
              <SheetTitle className="font-cn text-[#1c1c1e]">站点导航</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-[#e8e8e8] py-3 font-cn text-[15px] font-bold text-[#1c1c1e]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/services"
                className="mt-6 rounded-[10px] bg-[#f07030] py-[14px] text-center font-cn text-[15px] font-extrabold text-white transition-all duration-200 hover:bg-[#d95820]"
              >
                立即预约
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
