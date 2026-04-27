"use client"

import * as React from "react"
import { forwardRef, useEffect, useState, useRef, useCallback } from "react"
import { format } from "date-fns"
import { ChevronDownIcon, CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// ============================================================================
// CONSTANTS (outside component to prevent re-renders)
// ============================================================================

const HOURS_12 = Array.from({ length: 12 }, (_, i) => ((i + 1) % 12 || 12).toString().padStart(2, "0"))
const PERIODS = ["AM", "PM"]

const generateMinutes = (minuteStep: number = 15) => {
  const steps = 60 / minuteStep
  return Array.from({ length: steps }, (_, i) =>
    (i * minuteStep).toString().padStart(2, "0")
  )
}

// ============================================================================
// TYPES
// ============================================================================

export type PickerMode = "date" | "time" | "datetime"

export interface UniversalDateTimePickerProps {
  /** The mode of the picker: date, time, or datetime */
  mode?: PickerMode
  /** Current value - Date for date/datetime, string (HH:MM) for time */
  value?: Date | string
  /** Callback when value changes */
  onChange?: (value: Date | string | undefined) => void
  /** Label displayed above the picker */
  label?: string
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Disable the picker */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** ID for accessibility */
  id?: string
  /** Step interval for minutes (default: 15) */
  minuteStep?: number
  /** Read-only mode for view/details pages - renders as static display */
  isReadOnly?: boolean
  /** Date format for display in read-only mode */
  dateFormat?: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract time string (HH:MM) from a Date object or string (24-hour format)
 */
const extractTimeString = (value: Date | string | undefined): string => {
  if (!value) return ""
  if (typeof value === "string") {
    // Handle ISO string with T separator
    if (value.includes("T")) {
      return value.split("T")[1].slice(0, 5)
    }
    // Already in HH:MM format
    return value.slice(0, 5)
  }
  // Date object
  return `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
}

/**
 * Convert 24-hour time string to 12-hour display format
 */
const to12HourFormat = (time24: string): { hour: string; minute: string; period: string } => {
  if (!time24 || !time24.includes(":")) {
    return { hour: "12", minute: "00", period: "AM" }
  }
  const [hours24, mins] = time24.split(":")
  let hours = parseInt(hours24, 10)
  const period = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return {
    hour: hours.toString().padStart(2, "0"),
    minute: mins,
    period
  }
}

/**
 * Convert 12-hour format to 24-hour time string
 */
const to24HourFormat = (hour12: string, minute: string, period: string): string => {
  let hours = parseInt(hour12, 10)
  if (period === "PM" && hours !== 12) {
    hours += 12
  } else if (period === "AM" && hours === 12) {
    hours = 0
  }
  return `${hours.toString().padStart(2, "0")}:${minute}`
}

/**
 * Format time for display in 12-hour format
 */
const formatTime12Hour = (time24: string): string => {
  if (!time24) return ""
  const { hour, minute, period } = to12HourFormat(time24)
  return `${hour}:${minute} ${period}`
}

/**
 * Extract Date object from value (for date/datetime modes)
 */
const extractDateObject = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined
  if (value instanceof Date) return value
  // Try to parse ISO string
  if (typeof value === "string" && value.includes("T")) {
    return new Date(value)
  }
  return undefined
}

/**
 * Combine date and time into a single Date object
 */
const combineDateAndTime = (date: Date | undefined, timeString: string): Date | undefined => {
  if (!date && !timeString) return undefined
  
  const baseDate = date ? new Date(date) : new Date()
  
  if (timeString) {
    const [hours, minutes] = timeString.split(":").map(Number)
    baseDate.setHours(hours || 0)
    baseDate.setMinutes(minutes || 0)
    baseDate.setSeconds(0)
    baseDate.setMilliseconds(0)
  }
  
  return baseDate
}

// ============================================================================
// SCROLLABLE TIME COLUMN COMPONENT
// ============================================================================

interface TimeColumnProps {
  items: string[]
  selectedValue: string
  label: string
  onSelect: (value: string) => void
}

function TimeColumn({ items, selectedValue, label, onSelect }: TimeColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to selected value when popover opens
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({ block: "center", behavior: "instant" })
    }
  }, [selectedValue])

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-medium text-muted-foreground text-center py-1">
        {label}
      </div>
      <div ref={scrollRef} className="h-48 overflow-y-auto">
        {items.map((item) => {
          const isSelected = selectedValue === item
          return (
            <button
              key={item}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "block w-full py-1.5 px-2 text-sm rounded transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// READ-ONLY VIEW COMPONENT
// ============================================================================

interface ReadOnlyViewProps {
  mode: PickerMode
  value: Date | string | undefined
  label?: string
  placeholder?: string
  dateFormat?: string
}

function ReadOnlyView({ mode, value, label, placeholder, dateFormat }: ReadOnlyViewProps) {
  const displayValue = React.useMemo(() => {
    if (!value) return placeholder || "—"

    switch (mode) {
      case "date": {
        const date = extractDateObject(value)
        return date ? format(date, dateFormat || "PPP") : placeholder || "—"
      }
      case "time":
        return formatTime12Hour(extractTimeString(value)) || placeholder || "—"
      case "datetime": {
        const date = extractDateObject(value)
        const time = extractTimeString(value)
        if (date && time) {
          return `${format(date, dateFormat || "PPP")} at ${formatTime12Hour(time)}`
        }
        return placeholder || "—"
      }
      default:
        return placeholder || "—"
    }
  }, [mode, value, placeholder, dateFormat])

  const Icon = mode === "time" ? Clock : CalendarIcon

  return (
    <div className={cn("grid gap-2", label ? "" : "inline-flex items-center gap-2")}>
      {label && <Label className="text-muted-foreground">{label}</Label>}
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-foreground">{displayValue}</span>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const UniversalDateTimePicker = forwardRef<
  HTMLDivElement,
  UniversalDateTimePickerProps
>(function UniversalDateTimePicker(
  {
    mode = "datetime",
    value,
    onChange,
    label,
    placeholder,
    disabled = false,
    className,
    id,
    minuteStep = 15,
    isReadOnly = false,
    dateFormat,
  },
  ref
) {
  const [open, setOpen] = useState(false)
  const MINUTES = React.useMemo(() => generateMinutes(minuteStep), [minuteStep])

  // Derived values based on mode
  const dateValue = mode !== "time" ? extractDateObject(value) : undefined
  const timeValue = mode !== "date" ? extractTimeString(value) : ""
  const external12Hour = to12HourFormat(timeValue)

  // Local draft state for time selection - only commit on popover close
  const [draftHour, setDraftHour] = useState(external12Hour.hour)
  const [draftMinute, setDraftMinute] = useState(external12Hour.minute)
  const [draftPeriod, setDraftPeriod] = useState(external12Hour.period)

  // Sync draft state when popover opens or external value changes
  useEffect(() => {
    if (open) {
      setDraftHour(external12Hour.hour)
      setDraftMinute(external12Hour.minute)
      setDraftPeriod(external12Hour.period)
    }
  }, [open, external12Hour.hour, external12Hour.minute, external12Hour.period])

  // Commit time changes when popover closes
  // Using refs to avoid stale closures with draft state
  const draftHourRef = useRef(draftHour)
  const draftMinuteRef = useRef(draftMinute)
  const draftPeriodRef = useRef(draftPeriod)

  // Keep refs in sync with state
  useEffect(() => {
    draftHourRef.current = draftHour
    draftMinuteRef.current = draftMinute
    draftPeriodRef.current = draftPeriod
    // console.log("[DEBUG] Refs synced:", { hour: draftHour, minute: draftMinute, period: draftPeriod })
  }, [draftHour, draftMinute, draftPeriod])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    // console.log("[DEBUG] handleOpenChange:", { newOpen, open, mode, refs: { h: draftHourRef.current, m: draftMinuteRef.current, p: draftPeriodRef.current } })
    if (!newOpen && open) {
      // Popover is closing - commit the draft time using refs to avoid stale closure
      if (mode === "time" || mode === "datetime") {
        const newTime = to24HourFormat(draftHourRef.current, draftMinuteRef.current, draftPeriodRef.current)
        // console.log("[DEBUG] Committing time:", newTime)
        if (mode === "time") {
          onChange?.(newTime)
        } else {
          // datetime mode
          const newValue = combineDateAndTime(dateValue, newTime)
          onChange?.(newValue)
        }
      }
    }
    setOpen(newOpen)
  }, [open, mode, dateValue, onChange])

  // Callbacks
  const handleDateSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (mode === "date") {
        onChange?.(selectedDate)
        setOpen(false)
        return
      }

      // datetime mode - just update date, time is handled via refs to avoid stale closure
      const newValue = combineDateAndTime(selectedDate, to24HourFormat(draftHourRef.current, draftMinuteRef.current, draftPeriodRef.current))
      onChange?.(newValue)
      setOpen(false)
    },
    [mode, onChange]
  )

  // Generate display text for the trigger button
  // When popover is open, show draft preview; otherwise show committed value
  const displayText = React.useMemo(() => {
    // For time/datetime, show draft preview when open
    if ((mode === "time" || mode === "datetime") && open) {
      const draftTime = to24HourFormat(draftHour, draftMinute, draftPeriod)
      const timeDisplay = formatTime12Hour(draftTime)
      if (mode === "time") return timeDisplay
      // datetime mode
      const date = extractDateObject(value)
      if (date) {
        return `${format(date, "PP")} ${timeDisplay}`
      }
      return timeDisplay
    }

    if (!value) return placeholder || getDefaultPlaceholder(mode)

    switch (mode) {
      case "date": {
        const date = extractDateObject(value)
        return date ? format(date, "PP") : placeholder || getDefaultPlaceholder(mode)
      }
      case "time":
        return formatTime12Hour(extractTimeString(value)) || placeholder || getDefaultPlaceholder(mode)
      case "datetime": {
        const date = extractDateObject(value)
        const time = extractTimeString(value)
        if (date && time) {
          return `${format(date, "PP")} ${formatTime12Hour(time)}`
        }
        return placeholder || getDefaultPlaceholder(mode)
      }
      default:
        return placeholder || getDefaultPlaceholder(mode)
    }
  }, [mode, value, placeholder, open, draftHour, draftMinute, draftPeriod])

  // Determine which icon to show
  const TriggerIcon = mode === "time" ? Clock : CalendarIcon

  // READ-ONLY MODE: Return static display
  if (isReadOnly) {
    return (
      <div ref={ref} className={className}>
        <ReadOnlyView
          mode={mode}
          value={value}
          label={label}
          placeholder={placeholder}
          dateFormat={dateFormat}
        />
      </div>
    )
  }

  // EDIT/CREATE MODE: Return interactive picker
  return (
    <div ref={ref} className={cn("grid gap-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <TriggerIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{displayText}</span>
            <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          sideOffset={4}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Date Calendar - shown for date and datetime modes */}
            {(mode === "date" || mode === "datetime") && (
              <div className={cn("p-0", mode === "datetime" && "border-b sm:border-b-0 sm:border-r border-border")}>
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </div>
            )}

            {/* Time Columns - shown for time and datetime modes */}
            {(mode === "time" || mode === "datetime") && (
              <div className="p-3">
                <div className="flex gap-3">
                  <TimeColumn
                    items={HOURS_12}
                    selectedValue={draftHour}
                    label="Hour"
                    onSelect={setDraftHour}
                  />
                  <TimeColumn
                    items={MINUTES}
                    selectedValue={draftMinute}
                    label="Min"
                    onSelect={setDraftMinute}
                  />
                  <TimeColumn
                    items={PERIODS}
                    selectedValue={draftPeriod}
                    label="AM/PM"
                    onSelect={setDraftPeriod}
                  />
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultPlaceholder(mode: PickerMode): string {
  switch (mode) {
    case "date":
      return "Select date"
    case "time":
      return "Select time"
    case "datetime":
      return "Select date & time"
    default:
      return "Select"
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default UniversalDateTimePicker
