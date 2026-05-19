"use client";

import { Loader2, Sparkles, WandSparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SourceCatalogItem } from "@/lib/source-catalog";

type IngestValues = {
  sourceUrl: string;
  rawContent: string;
  task: "translate" | "summarize" | "extract-event";
  vendor: "openai" | "anthropic" | "google";
};

type AiIngestionCardProps = {
  officialSources: SourceCatalogItem[];
  selectedOfficialSource: string;
  scraping: boolean;
  draftCreated: boolean;
  submittingIngest: boolean;
  ingestResult: string;
  ingestForm: UseFormReturn<IngestValues>;
  onSubmit: (values: IngestValues) => void | Promise<void>;
  onApplyOfficialSource: (value: string | null) => void;
  onScrapeSource: () => void;
};

export function AiIngestionCard({
  officialSources,
  selectedOfficialSource,
  scraping,
  draftCreated,
  submittingIngest,
  ingestResult,
  ingestForm,
  onSubmit,
  onApplyOfficialSource,
  onScrapeSource,
}: AiIngestionCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>AI 抓取与处理控制台</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={ingestForm.handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="sourceUrl">来源链接</Label>
              <Input id="sourceUrl" {...ingestForm.register("sourceUrl")} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>官方来源</Label>
              <Select value={selectedOfficialSource} onValueChange={onApplyOfficialSource}>
                <SelectTrigger>
                  <SelectValue placeholder="选择官方 Instagram" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">手动输入</SelectItem>
                  {officialSources.map((source) => (
                    <SelectItem key={source.slug} value={source.slug}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>模型供应商</Label>
              <Select
                defaultValue="openai"
                onValueChange={(value) =>
                  ingestForm.setValue("vendor", value as "openai" | "anthropic" | "google")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Claude</SelectItem>
                  <SelectItem value="google">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedOfficialSource !== "custom" ? (
            <p className="text-sm text-white/50">
              已回填官方账号链接，抓取和 AI 任务会自动附带来源公司与账号标记。
            </p>
          ) : null}
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={onScrapeSource} disabled={scraping}>
              {scraping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
              先抓取正文
            </Button>
            <p className="text-sm text-white/50">适合海报详情页、活动介绍页、品牌活动页。</p>
          </div>
          {draftCreated ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              已根据 AI 提取结果回填“活动管理”里的创建表单，你可以切回上一标签直接落成活动草稿。
            </div>
          ) : null}
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select
                defaultValue="extract-event"
                onValueChange={(value) =>
                  ingestForm.setValue("task", value as "translate" | "summarize" | "extract-event")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extract-event">提取活动字段</SelectItem>
                  <SelectItem value="translate">翻译</SelectItem>
                  <SelectItem value="summarize">摘要</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rawContent">原始内容</Label>
              <Textarea id="rawContent" rows={10} {...ingestForm.register("rawContent")} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={submittingIngest}>
              {submittingIngest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              运行 AI 处理
            </Button>
            <p className="text-sm text-white/50">会先入队到后台，再调用 `/api/ai/process` 返回结果。</p>
          </div>
          {ingestResult ? (
            <pre className="overflow-x-auto rounded-2xl bg-[#0d1425] p-4 text-xs text-white/80">
              {ingestResult}
            </pre>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
