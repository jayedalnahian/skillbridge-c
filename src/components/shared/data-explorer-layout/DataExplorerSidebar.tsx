"use client";

import { X, SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FilterConfig } from "./useDataExplorerState";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DataExplorerSidebarProps {
  filtersConfig?: FilterConfig[];
  renderFilters?: () => React.ReactNode;
  filterState: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onResetFilters: () => void;
}

function FacetedFilter({
  config,
  selectedValues,
  onChange,
}: {
  config: FilterConfig;
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) {
  const selectedSet = new Set(selectedValues);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full justify-start border-dashed bg-white"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {config.label}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedSet.size} selected
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white" align="start">
        <div className="flex flex-col p-1">
          {config.options.map((option) => {
            const isSelected = selectedSet.has(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (isSelected) {
                    selectedSet.delete(option.value);
                  } else {
                    selectedSet.add(option.value);
                  }
                  const nextValues = Array.from(selectedSet);
                  onChange(nextValues);
                }}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100",
                  isSelected && "bg-slate-100",
                )}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
                {option.icon && (
                  <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
          {selectedSet.size > 0 && (
            <>
              <Separator className="my-1" />
              <button
                onClick={() => onChange([])}
                className="relative flex cursor-default select-none items-center justify-center rounded-sm py-1.5 text-sm outline-none hover:bg-slate-100"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DataExplorerSidebar({
  filtersConfig,
  renderFilters,
  filterState,
  onFilterChange,
  onResetFilters,
}: DataExplorerSidebarProps) {
  // Calculate active filter count
  const activeFilterCount = Object.values(filterState).reduce(
    (count, values) => count + values.length,
    0,
  );

  // If custom renderFilters is provided, use it exclusively
  if (renderFilters) {
    return (
      <div className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
        <SidebarProvider defaultOpen={true} className="min-h-fit">
          <Sidebar
            variant="floating"
            collapsible="none"
            className="relative h-fit w-full border border-slate-200 rounded-xl shadow-sm"
          >
            <SidebarHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-auto px-2 py-1 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4 pt-0">
              {renderFilters()}
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
    );
  }

  // Config-driven filters
  if (!filtersConfig || filtersConfig.length === 0) {
    return null;
  }

  return (
    <div className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
      <SidebarProvider defaultOpen={true} className="min-h-fit">
        <Sidebar
          variant="floating"
          collapsible="none"
          className="relative h-fit w-full border border-slate-200 rounded-xl shadow-sm"
        >
          <SidebarHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetFilters}
                  className="h-auto px-2 py-1 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4 pt-0">
            <SidebarGroup className="p-0">
              <SidebarGroupContent className="space-y-2">
                {filtersConfig.map((config) => (
                  <FacetedFilter
                    key={config.key}
                    config={config}
                    selectedValues={filterState[config.key] ?? []}
                    onChange={(values) => onFilterChange(config.key, values)}
                  />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
