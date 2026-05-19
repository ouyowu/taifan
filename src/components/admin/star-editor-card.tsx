"use client";

import { Loader2, Plus, Star as StarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type StarEditorValues = {
  slug: string;
  nameCn: string;
  nameEn: string;
  fandomName?: string;
  agency?: string;
  baseCity?: string;
  bio?: string;
  tags?: string;
  chinaFanPriority?: string;
};

type StarEditorCardProps = {
  editingStarSlug: string | null;
  submittingStar: boolean;
  starForm: UseFormReturn<StarEditorValues>;
  onSubmit: (values: StarEditorValues) => void | Promise<void>;
  onCancelEdit: () => void;
};

export function StarEditorCard({
  editingStarSlug,
  submittingStar,
  starForm,
  onSubmit,
  onCancelEdit,
}: StarEditorCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StarIcon className="h-4 w-4" />
          明星录入
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d1425] p-4 text-sm text-white/70">
          明星页推荐用 `英文名主展示 + 中文说明补充`：英文名方便粉丝搜外网内容，中文简介负责降低入坑门槛。
        </div>
        <div className="mb-4 rounded-2xl border border-[#ff7a59]/15 bg-[#ff7a59]/6 p-4 text-xs text-white/65">
          <p className="text-[#ffd7c9]">示例写法</p>
          <p className="mt-2">中文页常用称呼：`小四 / Fourth` 这类中国粉丝常见叫法</p>
          <p className="mt-1">官方英文名：`Fourth Nattawat`</p>
          <p className="mt-1">中文简介：`新生代高关注艺人，适合从校园剧线、品牌活动和近期公开行程开始追。`</p>
        </div>
        <form onSubmit={starForm.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input placeholder="slug" disabled={Boolean(editingStarSlug)} {...starForm.register("slug")} />
          <Input placeholder="中文页常用称呼" {...starForm.register("nameCn")} />
          <Input placeholder="官方英文名 / 常用原文名" {...starForm.register("nameEn")} />
          <Input placeholder="粉丝名" {...starForm.register("fandomName")} />
          <Input placeholder="所属机构（建议保留原文）" {...starForm.register("agency")} />
          <Input placeholder="常驻城市" {...starForm.register("baseCity")} />
          <Input placeholder="中国粉丝优先级，数字越小越靠前" {...starForm.register("chinaFanPriority")} />
          <div className="md:col-span-2">
            <Input placeholder="标签，逗号分隔" {...starForm.register("tags")} />
          </div>
          <div className="md:col-span-2">
            <Textarea rows={4} placeholder="中文简介，解释这位艺人的代表方向、适合追什么内容" {...starForm.register("bio")} />
          </div>
          <div className="md:col-span-2">
            <div className="flex gap-3">
              <Button type="submit" disabled={submittingStar}>
                {submittingStar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingStarSlug ? "保存明星" : "新增明星"}
              </Button>
              {editingStarSlug ? (
                <Button type="button" variant="outline" onClick={onCancelEdit}>
                  取消编辑
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
