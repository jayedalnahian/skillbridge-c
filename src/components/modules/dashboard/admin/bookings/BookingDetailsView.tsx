"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Copy, Check, DollarSign } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { BookingDetailsViewProps } from "./bookingTypes";

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return { variant: "default" as const, className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" };
    case "ACCEPTED":
      return { variant: "default" as const, className: "bg-blue-100 text-blue-700 hover:bg-blue-200" };
    case "REJECTED":
      return { variant: "destructive" as const, className: "bg-red-100 text-red-700 hover:bg-red-200" };
    case "COMPLETED":
      return { variant: "default" as const, className: "bg-green-100 text-green-700 hover:bg-green-200" };
    case "CANCELLED":
      return { variant: "outline" as const, className: "bg-slate-100 text-slate-700 hover:bg-slate-200" };
    default:
      return { variant: "secondary" as const, className: "" };
  }
};

const getPaymentStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "PAID":
      return { variant: "default" as const, className: "bg-green-100 text-green-700 hover:bg-green-200" };
    case "UNPAID":
      return { variant: "destructive" as const, className: "bg-red-100 text-red-700 hover:bg-red-200" };
    case "REFUNDED":
      return { variant: "outline" as const, className: "bg-slate-100 text-slate-700 hover:bg-slate-200" };
    default:
      return { variant: "secondary" as const, className: "" };
  }
};

export function BookingDetailsView({ item }: BookingDetailsViewProps) {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copyText(text);
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);
  const statusBadge = getStatusBadgeVariant(item.status);
  const paymentBadge = getPaymentStatusBadgeVariant(item.paymentStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Booking Details</h3>
          <p className="text-sm text-slate-500 mt-0.5 font-mono italic">
            ID: {item.id.slice(0, 8)}...
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={statusBadge.variant}
            className={`h-6 ${statusBadge.className}`}
          >
            {item.status}
          </Badge>
          {item.isDeleted && (
            <Badge variant="destructive" className="h-6">
              Deleted
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Booking ID */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Booking ID
          </Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={item.id}
              className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopy(item.id)}
              className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
            >
              {hasCopiedRecently ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        {/* Student & Tutor IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Student ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.studentId}
                className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.studentId)}
                className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
              >
                <Copy className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tutor ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.tutorId}
                className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.tutorId)}
                className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
              >
                <Copy className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status & Payment Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border bg-slate-50/30 border-slate-200 shadow-sm">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Status
            </Label>
            <Badge
              variant={statusBadge.variant}
              className={`h-6 ${statusBadge.className}`}
            >
              {item.status}
            </Badge>
          </div>
          <div className="p-4 rounded-xl border bg-slate-50/30 border-slate-200 shadow-sm">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Payment Status
            </Label>
            <Badge
              variant={paymentBadge.variant}
              className={`h-6 ${paymentBadge.className}`}
            >
              {item.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Price */}
        <div className="p-4 rounded-xl border bg-slate-50/30 border-slate-200 shadow-sm">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
            Price
          </Label>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <DollarSign className="h-5 w-5 text-[#00ADB5]" />
            <span>${item.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Deleted Status */}
        <div className="p-4 rounded-xl border bg-slate-50/30 border-slate-200 shadow-sm">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
            Deleted Status
          </Label>
          <Badge
            variant={item.isDeleted ? "destructive" : "default"}
            className={item.isDeleted ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}
          >
            {item.isDeleted ? "Yes" : "No"}
          </Badge>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {createdAt && (
            <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Created At
              </Label>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                  <span className="font-medium">{createdAt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="h-3 w-3 opacity-50" />
                  <span>{createdAt.time}</span>
                </div>
              </div>
            </div>
          )}
          {updatedAt && (
            <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Updated At
              </Label>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                  <span className="font-medium">{updatedAt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="h-3 w-3 opacity-50" />
                  <span>{updatedAt.time}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
