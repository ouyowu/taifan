import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  fanName: z.string().min(2),
  contactHandle: z.string().min(2),
  serviceType: z.string().min(1),
  targetStar: z.string().optional(),
  desiredDate: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().min(10),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "表单校验失败" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.from("service_requests").insert({
      fan_name: parsed.data.fanName,
      contact_handle: parsed.data.contactHandle,
      service_type: parsed.data.serviceType,
      target_star: parsed.data.targetStar,
      desired_date: parsed.data.desiredDate || null,
      budget_range: parsed.data.budgetRange,
      notes: parsed.data.notes,
    });
  }

  return NextResponse.json({ message: "已收到需求，我们会尽快联系你。" });
}
