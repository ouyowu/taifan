import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  nameCn: z.string().min(2).optional(),
  nameEn: z.string().min(2).optional(),
  fandomName: z.string().optional(),
  agency: z.string().optional(),
  baseCity: z.string().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).optional(),
  chinaFanPriority: z.number().int().positive().optional(),
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

  const payload: Record<string, unknown> = {};
  if (parsed.data.nameCn) payload.name_cn = parsed.data.nameCn;
  if (parsed.data.nameEn) payload.name_en = parsed.data.nameEn;
  if (parsed.data.fandomName !== undefined) payload.fandom_name = parsed.data.fandomName;
  if (parsed.data.agency !== undefined) payload.agency = parsed.data.agency;
  if (parsed.data.baseCity !== undefined) payload.base_city = parsed.data.baseCity;
  if (parsed.data.bio !== undefined) payload.bio = parsed.data.bio;
  if (parsed.data.tags) payload.tags = parsed.data.tags;
  if (parsed.data.chinaFanPriority !== undefined) payload.china_fan_priority = parsed.data.chinaFanPriority;

  const { error } = await supabase
    .from("stars")
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

  const { error } = await supabase.from("stars").delete().eq("slug", slug);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
