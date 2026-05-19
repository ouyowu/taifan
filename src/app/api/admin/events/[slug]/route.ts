import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  type: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  venue: z.string().min(2).optional(),
  startsAt: z.string().min(5).optional(),
  summary: z.string().min(10).optional(),
  status: z.string().min(2).optional(),
  starSlugs: z.array(z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
  }

  const payload: Record<string, string> = {};
  if (parsed.data.title) payload.title = parsed.data.title;
  if (parsed.data.type) payload.type = parsed.data.type;
  if (parsed.data.city) payload.city = parsed.data.city;
  if (parsed.data.venue) payload.venue = parsed.data.venue;
  if (parsed.data.summary) payload.summary = parsed.data.summary;
  if (parsed.data.status) payload.status = parsed.data.status;
  if (parsed.data.startsAt) payload.starts_at = new Date(parsed.data.startsAt).toISOString();

  const { data: eventRow, error } = await supabase
    .from("events")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (parsed.data.starSlugs && eventRow?.id) {
    await supabase.from("event_stars").delete().eq("event_id", eventRow.id);

    if (parsed.data.starSlugs.length) {
      const { data: starRows } = await supabase
        .from("stars")
        .select("id, slug")
        .in("slug", parsed.data.starSlugs);

      if (starRows?.length) {
        await supabase.from("event_stars").insert(
          starRows.map((star) => ({
            event_id: eventRow.id,
            star_id: star.id,
            role: "guest",
          })),
        );
      }
    }
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

  const { error } = await supabase.from("events").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
