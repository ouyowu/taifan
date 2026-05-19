"use client";

import { CheckCircle2, Pencil, ShieldX, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewsItem } from "@/types/domain";

type NewsListCardProps = {
  newsItems: NewsItem[];
  newsQuery: string;
  newsStatusFilter: string;
  newsEditorialFilter: string;
  processingNewsSlug: string | null;
  onNewsQueryChange: (value: string) => void;
  onNewsStatusFilterChange: (value: string) => void;
  onNewsEditorialFilterChange: (value: string) => void;
  onEditNews: (item: NewsItem) => void;
  onUpdateNewsStatus: (slug: string, status: "reviewed" | "published" | "rejected") => void;
  onDeleteNews: (slug: string) => void;
};

export function NewsListCard({
  newsItems,
  newsQuery,
  newsStatusFilter,
  newsEditorialFilter,
  processingNewsSlug,
  onNewsQueryChange,
  onNewsStatusFilterChange,
  onNewsEditorialFilterChange,
  onEditNews,
  onUpdateNewsStatus,
  onDeleteNews,
}: NewsListCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>已录入动态</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/55">
          动态列表里标题保留官方原文，摘要区负责给中国用户做中文快读。
        </p>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_200px]">
          <Input
            value={newsQuery}
            onChange={(event) => onNewsQueryChange(event.target.value)}
            placeholder="搜索动态标题、slug、分类"
          />
          <Select value={newsStatusFilter} onValueChange={(value) => onNewsStatusFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="筛选审核状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="reviewed">只看待发布</SelectItem>
              <SelectItem value="published">只看已发布</SelectItem>
              <SelectItem value="rejected">只看已驳回</SelectItem>
              <SelectItem value="draft">只看草稿</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newsEditorialFilter} onValueChange={(value) => onNewsEditorialFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="筛选内容来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部内容</SelectItem>
              <SelectItem value="daily-auto">只看自动整理</SelectItem>
              <SelectItem value="manual">只看人工整理</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {newsItems.map((item) => (
          <div key={item.slug} className="rounded-2xl bg-[#0d1425] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#ffb39d]/85">原始标题 / 官方写法</p>
                <p className="font-medium">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/55">
                  <span>{item.category}</span>
                  {item.editorialMode === "daily-auto" ? (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-[#ffdf9e]">今日自动整理</span>
                  ) : null}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">
                    {formatReviewStatus(item.reviewStatus)}
                  </span>
                  <span>{item.slug}</span>
                </div>
                <div className="mt-3 rounded-2xl border border-white/8 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">中文摘要</p>
                  <p className="mt-1 text-sm text-white/70">{item.excerpt}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {item.reviewStatus !== "published" ? (
                  <Button size="sm" onClick={() => onUpdateNewsStatus(item.slug, "published")}>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    发布
                  </Button>
                ) : null}
                {item.reviewStatus !== "rejected" ? (
                  <Button size="sm" variant="outline" onClick={() => onUpdateNewsStatus(item.slug, "rejected")}>
                    <ShieldX className="mr-1 h-3.5 w-3.5" />
                    驳回
                  </Button>
                ) : null}
                <Button size="sm" variant="outline" onClick={() => onEditNews(item)}>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={processingNewsSlug === item.slug}
                  onClick={() => onDeleteNews(item.slug)}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  删除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatReviewStatus(status?: NewsItem["reviewStatus"]) {
  switch (status) {
    case "draft":
      return "草稿";
    case "reviewed":
      return "待发布";
    case "published":
      return "已发布";
    case "rejected":
      return "已驳回";
    default:
      return "已发布";
  }
}
