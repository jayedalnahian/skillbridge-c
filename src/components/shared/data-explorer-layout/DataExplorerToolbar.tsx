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
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {/* Single row layout with golden ratio: ~62% search, ~38% controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search: Golden ratio major (~61.8%) */}
        <div className="relative sm:w-[61.8%]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-8 pl-9 pr-8 w-full"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Controls: Golden ratio minor (~38.2%) */}
        <div className="flex gap-2 sm:w-[38.2%]">
          {/* Sort dropdown: takes 60% of minor section */}
          <Select value={sortValue ?? ""} onValueChange={onSortChange}>
            <SelectTrigger className="h-8 flex-1 min-w-0">
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

          {/* Action buttons grouped */}
          <div className="flex gap-1.5">
            {isFiltered && onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {queryKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey })}
                className="h-8 px-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onCreate && (
              <Button
                size="sm"
                onClick={onCreate}
                className="h-8 px-3 bg-[#00ADB5] hover:bg-[#008f96] text-white whitespace-nowrap"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{createButtonLabel}</span>
                <span className="sm:hidden">New</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
