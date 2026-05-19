import { NextResponse } from "next/server";
import { z } from "zod";

import { scrapeWebPage } from "@/lib/scrape";

const schema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  try {
    const result = await scrapeWebPage(parsed.data.url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "抓取失败" },
      { status: 500 },
    );
  }
}
