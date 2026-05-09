"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DaysOfWeek } from "@/types/user.types";
import { DAYS_OF_WEEK } from "@/lib/constants";

interface DaysOfWeekSelectorProps {
  /** Selected days */
  value?: DaysOfWeek[];
  /** Callback when days change */
  onChange?: (days: DaysOfWeek[]) => void;
  /** Label displayed above the selector */
  label?: string;
  /** Helper text displayed below label */
  helperText?: string;
  /** Disable the selector */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Required field indicator */
  required?: boolean;
}

/**
 * DaysOfWeekSelector - A reusable component for selecting days of the week.
 *
 * Displays toggle badges for each day (MON, TUE, WED, etc.) that can be selected/deselected.
 * Supports form integration via value/onChange pattern.
 *
 * @example
 * ```tsx
 * <DaysOfWeekSelector
 *   label="Available Days"
 *   value={availableDays}
 *   onChange={setAvailableDays}
 *   helperText="Select at least one day"
 * />
 * ```
 */
export function DaysOfWeekSelector({
  value = [],
  onChange,
  label,
  helperText,
  disabled = false,
  error,
  className,
  required = false,
}: DaysOfWeekSelectorProps) {
  const toggleDay = (day: DaysOfWeek) => {
    if (disabled) return;

    const newDays = value.includes(day)
      ? value.filter((d) => d !== day)
      : [...value, day];

    onChange?.(newDays);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {helperText && (
            <span className="text-xs text-muted-foreground ml-2 font-normal">
              {helperText}
            </span>
          )}
        </Label>
      )}

      <div className="flex flex-wrap gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = value.includes(day);
          return (
            <Badge
              key={day}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer select-none transition-colors",
                isSelected
                  ? "bg-[#00ADB5] hover:bg-[#008f96] text-white border-[#00ADB5]"
                  : "hover:bg-gray-100 border-gray-200",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => toggleDay(day)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleDay(day);
                }
              }}
              aria-pressed={isSelected}
              aria-label={`${day.charAt(0) + day.slice(1).toLowerCase()}, ${isSelected ? "selected" : "not selected"}`}
            >
              {day.slice(0, 3)}
            </Badge>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default DaysOfWeekSelector;
