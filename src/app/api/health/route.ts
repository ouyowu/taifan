import { siteConfig } from "@/lib/constants";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type HealthState = "ok" | "warning" | "error";

type HealthCheck = {
  state: HealthState;
  summary: string;
  details?: string[];
};

function hasAnyAiKey() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );
}

async function checkPublicSupabase(): Promise<HealthCheck> {
  const client = await createSupabaseServerClient();
  if (!client) {
    return {
      state: "error",
      summary: "前台 Supabase 读取未配置",
      details: ["缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY。"],
    };
  }

  const { count: publishedNewsCount, error: newsError } = await client
    .from("news_posts")
    .select("slug", { head: true, count: "exact" })
    .eq("review_status", "published");

  if (newsError) {
    return {
      state: "error",
      summary: "前台 Supabase 读取失败",
      details: [newsError.message],
    };
  }

  const { count: starCount, error: starError } = await client
    .from("stars")
    .select("slug", { head: true, count: "exact" });

  if (starError) {
    return {
      state: "error",
      summary: "前台 Supabase 读取失败",
      details: [starError.message],
    };
  }

  const { count: eventCount, error: eventError } = await client
    .from("events")
    .select("slug", { head: true, count: "exact" });

  if (eventError) {
    return {
      state: "error",
      summary: "前台 Supabase 读取失败",
      details: [eventError.message],
    };
  }

  return {
    state: "ok",
    summary: "前台 Supabase 读取正常",
    details: [
      `stars: ${starCount ?? 0}`,
      `events: ${eventCount ?? 0}`,
      `published news: ${publishedNewsCount ?? 0}`,
    ],
  };
}

async function checkAdminSupabase(): Promise<HealthCheck> {
  const client = createSupabaseAdminClient();
  if (!client) {
    return {
      state: "error",
      summary: "后台 Supabase 写入未配置",
      details: ["缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY。"],
    };
  }

  const { error } = await client
    .from("ingestion_jobs")
    .select("id", { head: true, count: "exact" });

  if (error) {
    return {
      state: "error",
      summary: "后台 Supabase 连接失败",
      details: [error.message],
    };
  }

  return {
    state: "ok",
    summary: "后台 Supabase 连接正常",
  };
}

function checkSiteUrl(): HealthCheck {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return {
      state: "warning",
      summary: "正式站点地址未显式配置",
      details: [
        "当前仍会回退到 Vercel 地址或 localhost。",
        "正式上线前请明确设置 NEXT_PUBLIC_SITE_URL。",
      ],
    };
  }

  if (!siteConfig.hasPublicSiteUrl) {
    return {
      state: "warning",
      summary: "站点地址仍是本地地址",
      details: ["NEXT_PUBLIC_SITE_URL 目前看起来仍是 localhost。"],
    };
  }

  return {
    state: "ok",
    summary: `站点地址已配置：${siteConfig.siteUrl}`,
  };
}

function checkAi(): HealthCheck {
  if (!hasAnyAiKey()) {
    return {
      state: "warning",
      summary: "未配置 AI key，当前以人工抓取/审核模式运行",
      details: [
        "网站前台、Supabase、后台审核仍可正常使用。",
        "只有自动摘要、自动分类、自动正文生成功能暂时不可用。",
      ],
    };
  }

  const vendors = [
    process.env.OPENAI_API_KEY ? "OpenAI" : null,
    process.env.ANTHROPIC_API_KEY ? "Anthropic" : null,
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Google" : null,
  ].filter(Boolean);

  return {
    state: "ok",
    summary: `AI 已配置：${vendors.join(" / ")}`,
  };
}

function checkCron(): HealthCheck {
  if (!process.env.CRON_SECRET && !process.env.DAILY_NEWS_CRON_SECRET) {
    return {
      state: "warning",
      summary: "定时任务密钥未配置",
      details: ["daily news 的 cron 目前还不能安全开启。"],
    };
  }

  if (!hasAnyAiKey()) {
    return {
      state: "warning",
      summary: "定时任务密钥已配置，但当前建议保持人工模式",
      details: ["未配置 AI key 时，不建议开启 daily news 自动生成。"],
    };
  }

  return {
    state: "ok",
    summary: "定时任务密钥已配置",
  };
}

function summarizeStatus(checks: HealthCheck[]) {
  if (checks.some((item) => item.state === "error")) return "error";
  if (checks.some((item) => item.state === "warning")) return "warning";
  return "ok";
}

export async function GET() {
  const checks = {
    siteUrl: checkSiteUrl(),
    publicSupabase: await checkPublicSupabase(),
    adminSupabase: await checkAdminSupabase(),
    ai: checkAi(),
    cron: checkCron(),
  };

  const overall = summarizeStatus(Object.values(checks));

  return Response.json({
    ok: overall !== "error",
    status: overall,
    checkedAt: new Date().toISOString(),
    project: {
      name: siteConfig.name,
      siteUrl: siteConfig.siteUrl,
    },
    checks,
  });
}
