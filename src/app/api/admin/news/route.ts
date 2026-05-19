import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  category: z.string().min(2),
  bodyMd: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "reviewed", "published", "rejected"]).optional(),
  relatedStars: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
  }

  const { error } = await supabase.from("news_posts").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    category: parsed.data.category,
    body_md: parsed.data.bodyMd,
    source_url: parsed.data.sourceUrl || null,
    review_status: parsed.data.status ?? "draft",
    related_star_slugs: parsed.data.relatedStars,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
