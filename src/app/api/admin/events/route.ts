import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  type: z.string().min(2),
  city: z.string().min(2),
  venue: z.string().min(2),
  startsAt: z.string().min(5),
  summary: z.string().min(10),
  starSlugs: z.array(z.string()).default([]),
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

  const { data, error } = await supabase
    .from("events")
    .insert({
      slug: parsed.data.slug,
      title: parsed.data.title,
      type: parsed.data.type,
      city: parsed.data.city,
      venue: parsed.data.venue,
      starts_at: new Date(parsed.data.startsAt).toISOString(),
      summary: parsed.data.summary,
      status: "scheduled",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (parsed.data.starSlugs.length) {
    const { data: starRows } = await supabase
      .from("stars")
      .select("id, slug")
      .in("slug", parsed.data.starSlugs);

    if (starRows?.length) {
      await supabase.from("event_stars").insert(
        starRows.map((star) => ({
          event_id: data.id,
          star_id: star.id,
          role: "guest",
        })),
      );
    }
  }

  return NextResponse.json({ ok: true });
}
