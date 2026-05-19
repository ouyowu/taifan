import { Bot, CalendarRange, Languages, LayoutDashboard } from "lucide-react";

import { AdminConsole } from "@/components/admin-console";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOverview, listEventsForAdmin, listNewsForAdmin } from "@/lib/data";
import { officialSourceCatalog } from "@/lib/source-catalog";
import { events, newsItems, services, weekPlan } from "@/lib/mock-data";

const queues = [
  {
    title: "待审核抓取内容",
    value: 12,
    description: "等待编辑确认来源和字段的 AI 抓取结果",
    icon: Bot,
  },
  {
    title: "活动排期",
    value: events.length,
    description: "待发布和已发布的活动日历条目",
    icon: CalendarRange,
  },
  {
    title: "翻译摘要",
    value: newsItems.length,
    description: "生成后的中文摘要和快读内容",
    icon: Languages,
  },
  {
    title: "服务需求",
    value: services.length,
    description: "来自粉丝的咨询与定制服务请求",
    icon: LayoutDashboard,
  },
];

export default async function AdminPage() {
  const [overview, adminEvents, adminNews] = await Promise.all([
    getAdminOverview(),
    listEventsForAdmin(),
    listNewsForAdmin(),
  ]);
  const eventCount = overview.events.length || events.length;
  const newsCount = overview.news.length || newsItems.length;
  const requestCount = overview.requests.length || services.length;

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#ffb39d]">Admin Console</p>
            <h1 className="mt-3 text-4xl font-semibold">后台管理系统</h1>
            <p className="mt-3 max-w-2xl text-white/70">
              这里先提供运营最核心的四块：活动、内容、AI 抓取和服务需求。后续再接权限、编辑器和审计日志。
            </p>
          </div>
          <Badge className="w-fit bg-[#ff7a59] px-4 py-1 text-[#0f1729] hover:bg-[#ff7a59]">
            MVP 运营看板
          </Badge>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {queues.map((item) => {
            const Icon = item.icon;
            const value =
              item.title === "活动排期"
                ? eventCount
                : item.title === "翻译摘要"
                  ? newsCount
                  : item.title === "服务需求"
                    ? requestCount
                    : overview.jobs.length || item.value;
            return (
              <Card key={item.title} className="border-[#26324b] bg-[#10182c] text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <Icon className="h-5 w-5 text-[#ffb39d]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-semibold">{value}</p>
                  <p className="mt-3 text-sm text-white/65">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-[#26324b] bg-[#10182c] text-white">
            <CardHeader>
              <CardTitle>AI 内容流水线</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/75">
              <p>1. 抓取：录入 X / 微博 / 海报页 / 官方站链接</p>
              <p>2. 翻译：将泰文或英文转为中文</p>
              <p>3. 摘要：生成粉丝可快速理解的中文快读</p>
              <p>4. 提取：抽取活动时间、地点、票务状态、关联明星</p>
              <p>5. 审核：编辑确认后进入公开站点</p>
            </CardContent>
          </Card>

          <Card className="border-[#26324b] bg-[#10182c] text-white">
            <CardHeader>
              <CardTitle>四周执行计划</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekPlan.map((item) => (
                <div key={item.week} className="rounded-2xl bg-[#0d1425] p-4">
                  <p className="text-sm text-[#ffb39d]">{item.week}</p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  <p className="mt-2 text-sm text-white/65">{item.tasks.join(" · ")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <AdminConsole
          events={adminEvents}
          newsItems={adminNews}
          stars={overview.stars}
          serviceRequests={overview.requests.map((row) => ({
            id: row.id,
            fan_name: row.fan_name,
            service_type: row.service_type,
            status: row.status,
            created_at: row.created_at,
          }))}
          ingestionJobs={overview.jobs.map((row) => ({
            id: row.id,
            source_url: row.source_url,
            source_type: row.source_type,
            model_vendor: row.model_vendor,
            status: row.status,
            raw_content: row.raw_content,
            translated_content: row.translated_content,
            summary: row.summary,
            extracted_payload: row.extracted_payload,
            created_at: row.created_at,
          }))}
          officialSources={officialSourceCatalog}
        />
      </section>
    </SiteShell>
  );
}
