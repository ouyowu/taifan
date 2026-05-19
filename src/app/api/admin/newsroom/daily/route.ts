import { NextResponse } from "next/server";
import { z } from "zod";

import { runDailyNewsPipeline } from "@/lib/daily-news";

function hasAnyAiKey() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  );
}

const schema = z.object({
  sourceSlugs: z.array(z.string()).optional(),
  vendor: z.enum(["openai", "anthropic", "google"]).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  if (!hasAnyAiKey()) {
    return NextResponse.json(
      {
        message: "当前未配置 AI key。请先使用来源板的先试抓和人工审核模式，稍后再接 AI 自动生成。",
        mode: "manual-only",
      },
      { status: 409 },
    );
  }

  try {
    const result = await runDailyNewsPipeline(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "每日 news 生成失败" },
      { status: 500 },
    );
  }
}
