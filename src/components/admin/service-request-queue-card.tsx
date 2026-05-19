"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ServiceRequestRow = {
  id: string;
  fan_name: string;
  service_type: string;
  status: string;
  created_at: string;
};

type ServiceRequestQueueCardProps = {
  pendingCount: number;
  requestQuery: string;
  requests: ServiceRequestRow[];
  processingRequestId: string | null;
  onRequestQueryChange: (value: string) => void;
  onUpdateRequestStatus: (id: string, status: string) => void;
};

export function ServiceRequestQueueCard({
  pendingCount,
  requestQuery,
  requests,
  processingRequestId,
  onRequestQueryChange,
  onUpdateRequestStatus,
}: ServiceRequestQueueCardProps) {
  return (
    <Card className="border-[#26324b] bg-[#10182c] text-white">
      <CardHeader>
        <CardTitle>服务需求队列</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/60">当前待处理 {pendingCount} 条</p>
        <Input
          value={requestQuery}
          onChange={(event) => onRequestQueryChange(event.target.value)}
          placeholder="搜索粉丝、服务、状态"
        />
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>粉丝</TableHead>
              <TableHead>服务</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length ? (
              requests.map((row) => (
                <TableRow key={row.id} className="border-white/10">
                  <TableCell>{row.fan_name}</TableCell>
                  <TableCell>{row.service_type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processingRequestId === row.id}
                        onClick={() => onUpdateRequestStatus(row.id, "reviewing")}
                      >
                        跟进
                      </Button>
                      <Button
                        size="sm"
                        disabled={processingRequestId === row.id}
                        onClick={() => onUpdateRequestStatus(row.id, "done")}
                      >
                        完成
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-white/50">
                  当前未接入数据库或暂无服务需求
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
