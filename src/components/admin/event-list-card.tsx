"use client";

import { format } from "date-fns";
import { Pencil, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Event } from "@/types/domain";

type EventListCardProps = {
  events: Event[];
  eventQuery: string;
  eventTypeFilter: string;
  eventStatusFilter: string;
  processingEventSlug: string | null;
  onEventQueryChange: (value: string) => void;
  onEventTypeFilterChange: (value: string) => void;
  onEventStatusFilterChange: (value: string) => void;
  onEditEvent: (event: Event) => void;
  onUpdateEventStatus: (slug: string, status: string) => void;
  onDeleteEvent: (slug: string) => void;
};

export function EventListCard({
  events,
  eventQuery,
  eventTypeFilter,
  eventStatusFilter,
  processingEventSlug,
  onEventQueryChange,
  onEventTypeFilterChange,
  onEventStatusFilterChange,
  onEditEvent,
  onUpdateEventStatus,
  onDeleteEvent,
}: EventListCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>活动列表管理</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-white/55">
          这里的活动标题默认按官方原文展示，下面的小块说明负责给中国用户补中文解释。
        </p>
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <Input
            value={eventQuery}
            onChange={(event) => onEventQueryChange(event.target.value)}
            placeholder="搜索活动标题、slug、城市、明星"
          />
          <Select value={eventTypeFilter} onValueChange={(value) => onEventTypeFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="活动类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="fanmeeting">见面会</SelectItem>
              <SelectItem value="concert">演唱会</SelectItem>
              <SelectItem value="brand">品牌活动</SelectItem>
              <SelectItem value="broadcast">直播/播出</SelectItem>
              <SelectItem value="airport">机场行程</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventStatusFilter} onValueChange={(value) => onEventStatusFilterChange(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="活动状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="scheduled">已排期</SelectItem>
              <SelectItem value="rumor">传闻</SelectItem>
              <SelectItem value="selling">售票中</SelectItem>
              <SelectItem value="done">已结束</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>标题</TableHead>
              <TableHead>时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.slug} className="border-white/10">
                <TableCell>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#ffb39d]/85">官方标题保留</p>
                      <p>{event.title}</p>
                      <p className="text-xs text-white/45">{event.city} · {event.venue}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">中文说明</p>
                      <p className="mt-1 text-xs text-white/65">{event.summary}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(event.startsAt), "MM-dd HH:mm")}</TableCell>
                <TableCell>{event.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingEventSlug === event.slug}
                      onClick={() => onEditEvent(event)}
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={processingEventSlug === event.slug}
                      onClick={() => onUpdateEventStatus(event.slug, "selling")}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      售票中
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={processingEventSlug === event.slug}
                      onClick={() => onDeleteEvent(event.slug)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
