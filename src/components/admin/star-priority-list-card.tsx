"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Star } from "@/types/domain";

type StarPriorityListCardProps = {
  stars: Star[];
  processingStarSlug: string | null;
  starAgencyFilter: string;
  starTagFilter: string;
  highPriorityOnly: boolean;
  starAgencyOptions: string[];
  starTagOptions: string[];
  onExportStarPriorityList: () => void;
  onExportStarPriorityPlainText: () => void;
  onCopyTopThreeBrief: () => void;
  onCopyTopThreeChatBrief: () => void;
  onCopyTopOneRecommendation: () => void;
  onCopyTopThreeNewFanPitch: () => void;
  onCopyTopOneShortPitch: () => void;
  onCopyTopOneEventPitch: () => void;
  onCopyTopOneCpPitch: () => void;
  onCopyTopOneBrandPitch: () => void;
  onCopyTopOneFashionPitch: () => void;
  onCopyNewFanThreeLinePitch: () => void;
  onCopyNewFanSingleParagraphPitch: () => void;
  onCopyActivityOrNewsChoicePitch: () => void;
  onCopyUltraShortPitch: () => void;
  onCopyUltraShortActivityPitch: () => void;
  onCopyUltraShortNewsPitch: () => void;
  onCopyThreeMinutePitch: () => void;
  onCopySingleUpdatePitch: () => void;
  onCopyHeadlineOnlyPitch: () => void;
  onCopyNoTimePitch: () => void;
  onCopyOneNamePitch: () => void;
  onCopyOneClickPitch: () => void;
  onCopyOneGlancePitch: () => void;
  onCopyMinimumEffortPitch: () => void;
  onResetRecommendedOrder: () => void;
  onClearFilters: () => void;
  onToggleHighPriorityOnly: () => void;
  onStarAgencyFilterChange: (value: string) => void;
  onStarTagFilterChange: (value: string) => void;
  onSetStarAsTopOne: (star: Star) => void;
  onMoveStarPriorityUp: (star: Star) => void;
  onMoveStarPriorityDown: (star: Star) => void;
  onEditStar: (star: Star) => void;
  onDeleteStar: (slug: string) => void;
};

export function StarPriorityListCard({
  stars,
  processingStarSlug,
  starAgencyFilter,
  starTagFilter,
  highPriorityOnly,
  starAgencyOptions,
  starTagOptions,
  onExportStarPriorityList,
  onExportStarPriorityPlainText,
  onCopyTopThreeBrief,
  onCopyTopThreeChatBrief,
  onCopyTopOneRecommendation,
  onCopyTopThreeNewFanPitch,
  onCopyTopOneShortPitch,
  onCopyTopOneEventPitch,
  onCopyTopOneCpPitch,
  onCopyTopOneBrandPitch,
  onCopyTopOneFashionPitch,
  onCopyNewFanThreeLinePitch,
  onCopyNewFanSingleParagraphPitch,
  onCopyActivityOrNewsChoicePitch,
  onCopyUltraShortPitch,
  onCopyUltraShortActivityPitch,
  onCopyUltraShortNewsPitch,
  onCopyThreeMinutePitch,
  onCopySingleUpdatePitch,
  onCopyHeadlineOnlyPitch,
  onCopyNoTimePitch,
  onCopyOneNamePitch,
  onCopyOneClickPitch,
  onCopyOneGlancePitch,
  onCopyMinimumEffortPitch,
  onResetRecommendedOrder,
  onClearFilters,
  onToggleHighPriorityOnly,
  onStarAgencyFilterChange,
  onStarTagFilterChange,
  onSetStarAsTopOne,
  onMoveStarPriorityUp,
  onMoveStarPriorityDown,
  onEditStar,
  onDeleteStar,
}: StarPriorityListCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>已录入明星（按优先级）</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-white/55">
          明星卡片采用 `中文称呼 + 官方原文名` 的双层展示，方便中国用户理解，也方便后续去外网搜索。
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onExportStarPriorityList}>
            导出当前顺序
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onExportStarPriorityPlainText}>
            导出纯文本
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopThreeBrief}>
            复制 TOP 1-3 简报
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopThreeChatBrief}>
            复制发群版简报
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneRecommendation}>
            复制 TOP 1 推荐文案
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopThreeNewFanPitch}>
            复制 TOP 1-3 新粉安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneShortPitch}>
            复制单人短安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneEventPitch}>
            复制活动向安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneCpPitch}>
            复制 CP 向安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneBrandPitch}>
            复制品牌向安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyTopOneFashionPitch}>
            复制时尚向安利版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyNewFanThreeLinePitch}>
            复制新粉三句话版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyNewFanSingleParagraphPitch}>
            复制一段式新粉总安利
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyActivityOrNewsChoicePitch}>
            复制活动/动态二选一版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyUltraShortPitch}>
            复制超短一句话安利
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyUltraShortActivityPitch}>
            复制超短活动党版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyUltraShortNewsPitch}>
            复制超短动态党版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyThreeMinutePitch}>
            复制 3 分钟入门版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopySingleUpdatePitch}>
            复制 1 条更新版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyHeadlineOnlyPitch}>
            复制只看标题版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyNoTimePitch}>
            复制完全没时间版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyOneNamePitch}>
            复制只记一个名字版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyOneClickPitch}>
            复制只点 1 次版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyOneGlancePitch}>
            复制只刷一眼版
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCopyMinimumEffortPitch}>
            复制最低限度版
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={processingStarSlug === "reset-order"}
            onClick={onResetRecommendedOrder}
          >
            重置为推荐排序
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onClearFilters}>
            清空筛选
          </Button>
          <Button
            type="button"
            size="sm"
            variant={highPriorityOnly ? "default" : "outline"}
            onClick={onToggleHighPriorityOnly}
          >
            只看高优先级明星
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Select value={starAgencyFilter} onValueChange={(value) => onStarAgencyFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="所属机构" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部机构</SelectItem>
              {starAgencyOptions.map((agency) => (
                <SelectItem key={agency} value={agency}>
                  {agency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={starTagFilter} onValueChange={(value) => onStarTagFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部标签</SelectItem>
              {starTagOptions.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {stars.map((star) => (
          <div key={star.slug} className="rounded-2xl bg-[#0d1425] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#ff7a59] px-2.5 py-1 text-xs font-medium text-[#0f1729]">
                    TOP {star.chinaFanPriority ?? "-"}
                  </span>
                  <p className="font-medium">{star.nameCn}</p>
                </div>
                <p className="mt-1 text-sm text-white/55">{star.nameEn} · {star.slug}</p>
                <p className="mt-1 text-xs text-white/45">官方原文名保留，中文页常用称呼单独展示。</p>
                <p className="mt-1 text-xs text-[#ffd7c9]">
                  中国粉丝优先级：{star.chinaFanPriority ?? "未设置"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={processingStarSlug === star.slug}
                  onClick={() => onSetStarAsTopOne(star)}
                >
                  设为 TOP 1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={processingStarSlug === star.slug}
                  onClick={() => onMoveStarPriorityUp(star)}
                >
                  上移
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={processingStarSlug === star.slug}
                  onClick={() => onMoveStarPriorityDown(star)}
                >
                  下移
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEditStar(star)}>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={processingStarSlug === star.slug}
                  onClick={() => onDeleteStar(star.slug)}
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
