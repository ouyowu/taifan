import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().min(3),
  nameCn: z.string().min(2),
  nameEn: z.string().min(2),
  fandomName: z.string().optional(),
  agency: z.string().optional(),
  baseCity: z.string().optional(),
  bio: z.string().optional(),
  tags: z.array(z.string()).default([]),
  chinaFanPriority: z.number().int().positive().optional(),
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

  const { error } = await supabase.from("stars").insert({
    slug: parsed.data.slug,
    name_cn: parsed.data.nameCn,
    name_en: parsed.data.nameEn,
    fandom_name: parsed.data.fandomName,
    agency: parsed.data.agency,
    base_city: parsed.data.baseCity,
    bio: parsed.data.bio,
    tags: parsed.data.tags,
    china_fan_priority: parsed.data.chinaFanPriority ?? 999,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
