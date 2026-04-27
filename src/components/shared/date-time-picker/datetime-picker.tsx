"use client"


import { format } from "date-fns"
import { ChevronDownIcon, CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  showTime?: boolean
  timeLabel?: string
  dateLabel?: string
  id?: string
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  showTime = true,
  timeLabel = "Time",
  dateLabel = "Date",
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [timeValue, setTimeValue] = useState<string>("")

  useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0")
      const minutes = value.getMinutes().toString().padStart(2, "0")
      setTimeValue(`${hours}:${minutes}`)
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange?.(undefined)
      return
    }

    const newDate = value ? new Date(value) : new Date()
    newDate.setFullYear(selectedDate.getFullYear())
    newDate.setMonth(selectedDate.getMonth())
    newDate.setDate(selectedDate.getDate())
    onChange?.(newDate)
    setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeValue(newTime)

    if (!value) return

    const [hours, minutes] = newTime.split(":").map(Number)
    const newDate = new Date(value)
    newDate.setHours(hours || 0)
    newDate.setMinutes(minutes || 0)
    onChange?.(newDate)
  }

  const dateId = id ? `${id}-date` : "datetime-picker-date"
  const timeId = id ? `${id}-time` : "datetime-picker-time"

  return (
    <div className={cn("grid gap-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-row gap-2">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={dateId}
              disabled={disabled}
              className={cn(
                "w-40 justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PP") : placeholder}
              <ChevronDownIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        {showTime && (
          <div className="flex flex-col gap-1.5">
            <Input
              type="time"
              id={timeId}
              value={timeValue}
              onChange={handleTimeChange}
              disabled={disabled || !value}
              className="w-32 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const dateId = id || "date-picker"

  return (
    <div className={cn("grid gap-2", className)}>
      {label && <Label htmlFor={dateId}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={dateId}
            disabled={disabled}
            className={cn(
              "w-48 justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : placeholder}
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  label?: string
  disabled?: boolean
  className?: string
  id?: string
  minuteStep?: number
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

export function TimePicker({
  value = "",
  onChange,
  label,
  disabled = false,
  className,
  id,
  minuteStep = 15,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const timeId = id || "time-picker"

  const generateMinutes = () => {
    const steps = 60 / minuteStep
    return Array.from({ length: steps }, (_, i) =>
      (i * minuteStep).toString().padStart(2, "0")
    )
  }

  const MINUTES = generateMinutes()

  const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""]

  const handleTimeSelect = (hour: string, minute: string) => {
    onChange?.(`${hour}:${minute}`)
    setOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      {label && <Label htmlFor={timeId}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={timeId}
            disabled={disabled}
            className={cn(
              "w-full sm:w-32 justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value || "--:--"}
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-2">
            {/* Hours */}
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-muted-foreground text-center py-1">
                Hour
              </div>
              <div className="h-48 overflow-y-auto">
                {HOURS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeSelect(hour, selectedMinute || "00")}
                    className={cn(
                      "block w-10 py-1 px-2 text-sm rounded hover:bg-accent",
                      selectedHour === hour && "bg-[#00ADB5] text-white hover:bg-[#008f96]"
                    )}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
            {/* Minutes */}
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-muted-foreground text-center py-1">
                Min
              </div>
              <div className="h-48 overflow-y-auto">
                {MINUTES.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeSelect(selectedHour || "00", minute)}
                    className={cn(
                      "block w-10 py-1 px-2 text-sm rounded hover:bg-accent",
                      selectedMinute === minute && "bg-[#00ADB5] text-white hover:bg-[#008f96]"
                    )}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Time picker that works with Date objects (extracts time from Date)
interface DateTimeTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  disabled?: boolean
  className?: string
  id?: string
  minuteStep?: number
}

export function DateTimeTimePicker({
  value,
  onChange,
  label,
  disabled = false,
  className,
  id,
  minuteStep = 15,
}: DateTimeTimePickerProps) {
  const timeId = id || "datetime-time-picker"

  // Convert Date to time string
  const timeValue = value
    ? `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
    : ""

  const handleTimeChange = (newTime: string) => {
    if (!newTime) {
      onChange?.(undefined)
      return
    }

    const [hours, minutes] = newTime.split(":").map(Number)
    const newDate = value ? new Date(value) : new Date()
    newDate.setHours(hours || 0)
    newDate.setMinutes(minutes || 0)
    onChange?.(newDate)
  }

  return (
    <TimePicker
      value={timeValue}
      onChange={handleTimeChange}
      label={label}
      disabled={disabled}
      className={className}
      id={timeId}
      minuteStep={minuteStep}
    />
  )
}
