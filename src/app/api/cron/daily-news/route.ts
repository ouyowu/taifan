import { NextResponse } from "next/server";

import { runDailyNewsPipeline } from "@/lib/daily-news";

function hasAnyAiKey() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET ?? process.env.DAILY_NEWS_CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasAnyAiKey()) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      mode: "manual-only",
      message: "当前未配置 AI key，daily news 自动生成已跳过。",
    });
  }

  try {
    const result = await runDailyNewsPipeline();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "每日 news cron 失败" },
      { status: 500 },
    );
  }
}
