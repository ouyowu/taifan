import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  category: z.string().min(2).optional(),
  bodyMd: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "reviewed", "published", "rejected"]).optional(),
  relatedStars: z.array(z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
  }

  const { data: existingRow, error: existingError } = await supabase
    .from("news_posts")
    .select("review_status,published_at")
    .eq("slug", slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ message: existingError.message }, { status: 500 });
  }

  const payload: Record<string, unknown> = {};
  if (parsed.data.title) payload.title = parsed.data.title;
  if (parsed.data.excerpt) payload.excerpt = parsed.data.excerpt;
  if (parsed.data.category) payload.category = parsed.data.category;
  if (parsed.data.bodyMd !== undefined) payload.body_md = parsed.data.bodyMd;
  if (parsed.data.sourceUrl !== undefined) payload.source_url = parsed.data.sourceUrl || null;
  if (parsed.data.status) payload.review_status = parsed.data.status;
  if (parsed.data.relatedStars) payload.related_star_slugs = parsed.data.relatedStars;
  if (
    parsed.data.status === "published" &&
    existingRow &&
    existingRow.review_status !== "published" &&
    !existingRow.published_at
  ) {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("news_posts")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
  }

  const { error } = await supabase.from("news_posts").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
