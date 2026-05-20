import type { Metadata } from "next";
import { ClipboardList, Headphones, Languages, SendHorizonal } from "lucide-react";
import { connection } from "next/server";

import { SiteShell } from "@/components/layout/site-shell";
import { ServiceRequestForm } from "@/components/service-request-form";
import { listServices } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "代办服务",
  description: "面向中国粉丝的泰娱服务支持入口。",
  path: "/services",
});

export default async function ServicesPage() {
  await connection();
  const services = await listServices();

  return (
    <SiteShell>
      <section className="editorial-page-shell mx-auto max-w-[1440px] py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="editorial-kicker">Service desk</p>
            <h1 className="mt-4 font-sans text-[clamp(38px,6vw,82px)] font-black leading-[0.92] tracking-[-0.06em] text-[#1c1c1e]">
              代办服务
              <br />
              先讲清楚你需要什么。
            </h1>
            <p className="font-cn mt-6 max-w-[720px] text-[16px] leading-[1.95] text-[#5d6268]">
              这页不再做大海报式展示，而是像服务 desk。你先看我们能帮你处理哪些事，再用表单把需求讲清楚，后台会按人工模式逐条跟进。
            </p>
          </div>

          <aside className="editorial-sidebar-block">
            <p className="editorial-kicker">Service stats</p>
            <div className="editorial-brief-grid mt-5">
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><ClipboardList className="h-4 w-4" /></span>
                <p className="editorial-brief-number">{services.length}</p>
                <p className="editorial-brief-label">服务项</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Headphones className="h-4 w-4" /></span>
                <p className="editorial-brief-number">24h</p>
                <p className="editorial-brief-label">平均响应</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><SendHorizonal className="h-4 w-4" /></span>
                <p className="editorial-brief-number">100%</p>
                <p className="editorial-brief-label">人工处理</p>
              </div>
              <div className="editorial-brief-card">
                <span className="editorial-icon-badge"><Languages className="h-4 w-4" /></span>
                <p className="editorial-brief-number">CN</p>
                <p className="editorial-brief-label">中文沟通</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page-shell mx-auto max-w-[1440px] pb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="editorial-sidebar-block">
            <p className="editorial-kicker">Service menu</p>
            <div className="mt-5 space-y-3">
              {services.map((service, index) => (
                <div key={service.slug} className="editorial-directory-row">
                  <div className="flex items-start gap-4">
                    <span className="editorial-list-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-cn text-[15px] font-bold text-[#1c1c1e]">{service.title}</p>
                      <p className="font-cn mt-2 text-[13px] leading-[1.8] text-[#666b70]">{service.description}</p>
                    </div>
                  </div>
                  <span className="editorial-chip-muted">{service.turnaround}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-sidebar-block">
            <p className="editorial-kicker">Request support</p>
            <h2 className="mt-4 font-sans text-[28px] font-black tracking-[-0.04em] text-[#1c1c1e]">提交你的需求</h2>
            <p className="font-cn mt-3 text-[14px] leading-[1.9] text-[#666b70]">
              直接把想追哪位、卡在哪一步、希望什么时候得到帮助写清楚。系统不会自动回复，后台会人工查看并安排后续支持。
            </p>
            <div className="editorial-inline-note mt-4">
              <SendHorizonal className="h-4 w-4" />
              <span>表单写得越具体，后台越容易直接给到路线和处理建议。</span>
            </div>
            <div className="mt-6">
              <ServiceRequestForm />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
