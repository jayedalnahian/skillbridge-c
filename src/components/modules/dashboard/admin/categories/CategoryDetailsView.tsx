"use client";

import { ICategory } from "@/types/category.types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { CategoryDetailsViewProps } from "./categoryTypes";



const formatDate = (dateString: string) => {
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

export function CategoryDetailsView({ item }: CategoryDetailsViewProps) {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = () => {
    copyText(item.id);
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5 font-mono italic">
            /{item.slug}
          </p>
        </div>
        <Badge
          variant={item.isDeleted ? "destructive" : "secondary"}
          className="h-6"
        >
          {item.isDeleted ? "Deleted" : "Active"}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* ID Section */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Internal ID
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
              onClick={handleCopy}
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

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Description
          </Label>
          <div className="p-4 rounded-xl border bg-slate-50/30 text-sm text-slate-600 whitespace-pre-wrap min-h-[80px] leading-relaxed border-slate-200 shadow-sm">
            {item.description || (
              <span className="italic opacity-50">No description provided</span>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Registration
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
              Last Update
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
