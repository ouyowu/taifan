import { NextResponse } from "next/server";
import { z } from "zod";

import { deriveSourceMetadata } from "@/lib/source-metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  sourceUrl: z.string().url(),
  sourceType: z.string().min(2),
  vendor: z.enum(["openai", "anthropic", "google"]),
  rawContent: z.string().min(20),
  task: z.enum(["translate", "summarize", "extract-event"]),
});

const batchSchema = z.object({
  sources: z.array(
    z.object({
      sourceUrl: z.string().url(),
      sourceType: z.string().min(2),
      vendor: z.enum(["openai", "anthropic", "google"]),
      task: z.enum(["translate", "summarize", "extract-event"]),
    }),
  ).min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const batchParsed = batchSchema.safeParse(body);
  if (batchParsed.success) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
    }

    const rows = batchParsed.data.sources.map((item) => {
      const sourceMeta = deriveSourceMetadata(item.sourceUrl);
      return {
        source_url: item.sourceUrl,
        source_type: item.sourceType,
        model_vendor: item.vendor,
        raw_content: `巡检占位：${item.sourceUrl}`,
        status: "queued",
        extracted_payload: {
          task: item.task,
          batchMode: true,
          sourceCompany: sourceMeta.sourceCompany,
          sourceHandle: sourceMeta.sourceHandle,
          sourceLabel: sourceMeta.sourceLabel,
        },
      };
    });

    const { data, error } = await supabase.from("ingestion_jobs").insert(rows).select("id");
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ids: (data ?? []).map((row) => row.id) });
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase 未配置" }, { status: 503 });
  }

  const sourceMeta = deriveSourceMetadata(parsed.data.sourceUrl, parsed.data.rawContent);

  const { data, error } = await supabase.from("ingestion_jobs").insert({
    source_url: parsed.data.sourceUrl,
    source_type: parsed.data.sourceType,
    model_vendor: parsed.data.vendor,
    raw_content: parsed.data.rawContent,
    status: "queued",
    extracted_payload: {
      task: parsed.data.task,
      sourceCompany: sourceMeta.sourceCompany,
      sourceHandle: sourceMeta.sourceHandle,
      sourceLabel: sourceMeta.sourceLabel,
    },
  }).select("id").single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
