"use client";

import { Search, Plus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface DataExplorerToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
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
  onCreate,
  createButtonLabel = "Create New",
  queryKey,
  isFiltered,
  onReset,
}: DataExplorerToolbarProps) {
  const queryClient = useQueryClient();

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
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

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
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
              className="h-8 px-3 bg-primary hover:bg-primary/90 text-white whitespace-nowrap"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">{createButtonLabel}</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
