import { generateObject, generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const extractionSchema = z.object({
  title: z.string(),
  city: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
});

export type IngestionInput = {
  rawContent: string;
  sourceUrl: string;
  task: "translate" | "summarize" | "extract-event" | "classify";
  vendor?: "openai" | "anthropic" | "google";
};

function getModel(vendor: IngestionInput["vendor"]) {
  if (vendor === "anthropic") return anthropic("claude-3-5-sonnet-latest");
  if (vendor === "google") return google("gemini-2.0-flash");
  return openai("gpt-4.1-mini");
}

export async function runIngestionPipeline(input: IngestionInput) {
  if (input.task === "extract-event") {
    const result = await generateObject({
      model: getModel(input.vendor),
      schema: extractionSchema,
      prompt: `从以下内容中提取泰国明星活动信息，输出中文字段。\n来源: ${input.sourceUrl}\n内容:\n${input.rawContent}`,
    });

    return result.object;
  }

  if (input.task === "classify") {
    const result = await generateObject({
      model: getModel(input.vendor),
      schema: z.object({
        category: z.enum(["直播", "活动速递", "品牌活动", "官宣"]),
      }),
      prompt: `请判断以下泰娱资讯最适合归入哪一类，只能返回这四类之一：直播、活动速递、品牌活动、官宣。\n来源: ${input.sourceUrl}\n内容:\n${input.rawContent}`,
    });

    return result.object;
  }

  const prompt =
    input.task === "translate"
      ? `把以下泰娱资讯翻译成简体中文，并保留时间、地点和专有名词。\n${input.rawContent}`
      : `把以下泰娱资讯总结成给中国粉丝看的中文摘要，控制在 120 到 220 字之间，突出活动时间、购票、地点和风险提示。如果来源看起来更像 YouTube 视频、公开视频、频道更新、vlog、幕后或预告，不要只重复标题，要补出对中国粉丝有用的上下文说明：它更像哪种更新、和近期活动或艺人内容线有什么关系、为什么值得先看。\n${input.rawContent}`;

  const result = await generateText({
    model: getModel(input.vendor),
    prompt,
  });

  return { text: result.text };
}
