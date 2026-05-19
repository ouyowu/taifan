import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["queued", "processed", "reviewed", "rejected", "published"]),
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

  const { error } = await supabase
    .from("ingestion_jobs")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .in("id", parsed.data.ids);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
