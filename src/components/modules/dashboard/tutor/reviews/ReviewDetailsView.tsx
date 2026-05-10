"use client";

import { IReview } from "@/types/review.types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Copy, Check, Star, User, Hash } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface ReviewDetailsViewProps {
  item: IReview;
}

const formatDate = (dateString: string | Date) => {
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

export function ReviewDetailsView({ item }: ReviewDetailsViewProps) {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copyText(text);
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);

  const studentName = item.Student?.User?.name || "Anonymous Student";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#00ADB5]/10 flex items-center justify-center text-[#00ADB5]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{studentName}</h3>
            <div className="flex items-center gap-1 text-[#00ADB5]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(item.rating) ? "fill-current" : "text-slate-300"
                  }`}
                />
              ))}
              <span className="text-xs font-semibold ml-1">{item.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <Badge
          variant={item.isDeleted ? "destructive" : "secondary"}
          className="h-6"
        >
          {item.isDeleted ? "Deleted" : "Active"}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Comment Section */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Review Comment
          </Label>
          <div className="p-4 rounded-xl border bg-slate-50/30 text-sm text-slate-600 whitespace-pre-wrap min-h-[100px] leading-relaxed border-slate-200 shadow-sm">
            {item.comment || (
              <span className="italic opacity-50">No comment provided</span>
            )}
          </div>
        </div>

        {/* IDs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Review ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.id}
                className="font-mono text-[10px] bg-slate-50/50 h-8 border-slate-200"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.id)}
                className="shrink-0 h-8 w-8 border-slate-200 hover:bg-slate-100"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Booking ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.bookingId}
                className="font-mono text-[10px] bg-slate-50/50 h-8 border-slate-200"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.bookingId)}
                className="shrink-0 h-8 w-8 border-slate-200 hover:bg-slate-100"
              >
                <Hash className="h-3.5 w-3.5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Last Updated
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
        </div>
      </div>
    </div>
  );
}
