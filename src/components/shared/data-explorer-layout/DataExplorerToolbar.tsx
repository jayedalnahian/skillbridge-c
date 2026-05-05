"use client";

import { Search, Plus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { SortOption } from "./useDataExplorerState";

interface DataExplorerToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortValue: string | null;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  onCreate?: () => void;
  createButtonLabel?: string;
  queryKey?: string[];
  isFiltered?: boolean;
  onReset?: () => void;
}

export function DataExplorerToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortValue,
  onSortChange,
  sortOptions,
  onCreate,
  createButtonLabel = "Create New",
  queryKey,
  isFiltered,
  onReset,
}: DataExplorerToolbarProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Row 1: Search and Sort */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-9 pl-9 w-full"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={sortValue ?? ""} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 w-full lg:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Row 2: Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {isFiltered && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {queryKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey });
              }}
              className="h-9"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
          {onCreate && (
            <Button
              size="sm"
              onClick={onCreate}
              className="h-9 bg-[#00ADB5] hover:bg-[#008f96] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
