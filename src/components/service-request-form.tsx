"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  fanName: z.string().min(2, "请填写称呼"),
  contactHandle: z.string().min(2, "请填写联系方式"),
  serviceType: z.string().min(1, "请选择服务类型"),
  targetStar: z.string().optional(),
  desiredDate: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().min(10, "请至少描述 10 个字"),
});

type FormValues = z.infer<typeof schema>;

export function ServiceRequestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fanName: "",
      contactHandle: "",
      serviceType: "",
      targetStar: "",
      desiredDate: "",
      budgetRange: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { message: string };
      setMessage(result.message);
      form.reset();
    } catch {
      setMessage("提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 rounded-[28px] border border-[#26324b] bg-[#10182c] p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fanName">称呼</Label>
          <Input id="fanName" {...form.register("fanName")} placeholder="例如：小七" />
          <p className="text-xs text-rose-300">{form.formState.errors.fanName?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactHandle">联系方式</Label>
          <Input id="contactHandle" {...form.register("contactHandle")} placeholder="微信 / 邮箱 / Telegram" />
          <p className="text-xs text-rose-300">{form.formState.errors.contactHandle?.message}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label>服务类型</Label>
          <Select onValueChange={(value) => form.setValue("serviceType", String(value))}>
            <SelectTrigger>
              <SelectValue placeholder="选择服务类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trip-planning">追星行程规划</SelectItem>
              <SelectItem value="ticket-briefing">票务情报</SelectItem>
              <SelectItem value="translation-pack">资讯翻译包</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-rose-300">{form.formState.errors.serviceType?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetStar">目标明星</Label>
          <Input id="targetStar" {...form.register("targetStar")} placeholder="可填 Bright / PP Krit" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desiredDate">目标日期</Label>
          <Input id="desiredDate" type="date" {...form.register("desiredDate")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budgetRange">预算范围</Label>
        <Input id="budgetRange" {...form.register("budgetRange")} placeholder="例如：3000-5000 元" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">需求说明</Label>
        <Textarea id="notes" {...form.register("notes")} rows={5} placeholder="描述你想追的活动、希望的帮助和时间限制。" />
        <p className="text-xs text-rose-300">{form.formState.errors.notes?.message}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting} className="bg-[#ff7a59] text-[#0f1729] hover:bg-[#ff8c70]">
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          提交需求
        </Button>
        {message ? <p className="text-sm text-[#ffd7c9]">{message}</p> : null}
      </div>
    </form>
  );
}
