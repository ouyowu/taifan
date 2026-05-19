import { NextResponse } from "next/server";
import { z } from "zod";

import { runIngestionPipeline } from "@/lib/ai/pipeline";
import { deriveSourceMetadata } from "@/lib/source-metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  rawContent: z.string().min(20),
  sourceUrl: z.string().url(),
  task: z.enum(["translate", "summarize", "extract-event"]),
  vendor: z.enum(["openai", "anthropic", "google"]).optional(),
  jobId: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "参数错误" }, { status: 400 });
  }

  const result = await runIngestionPipeline(parsed.data);
  const sourceMeta = deriveSourceMetadata(parsed.data.sourceUrl, parsed.data.rawContent);

  if (parsed.data.jobId) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const updatePayload =
        parsed.data.task === "extract-event"
          ? {
              status: "processed",
              extracted_payload:
                result && typeof result === "object"
                  ? {
                      ...result,
                      sourceCompany: sourceMeta.sourceCompany,
                      sourceHandle: sourceMeta.sourceHandle,
                      sourceLabel: sourceMeta.sourceLabel,
                    }
                  : result,
              summary: sourceMeta.sourceLabel ? `event extracted · ${sourceMeta.sourceLabel}` : "event extracted",
              updated_at: new Date().toISOString(),
            }
          : parsed.data.task === "translate"
            ? {
                status: "processed",
                translated_content: "text" in result ? result.text : null,
                summary: sourceMeta.sourceLabel ? `translated · ${sourceMeta.sourceLabel}` : "translated",
                updated_at: new Date().toISOString(),
              }
            : {
                status: "processed",
                summary:
                  "text" in result
                    ? sourceMeta.sourceLabel
                      ? `${sourceMeta.sourceLabel} · ${result.text}`
                      : result.text
                    : "summarized",
                updated_at: new Date().toISOString(),
              };

      await supabase.from("ingestion_jobs").update(updatePayload).eq("id", parsed.data.jobId);
    }
  }

  return NextResponse.json(result);
}
