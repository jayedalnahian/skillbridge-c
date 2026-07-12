"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMinutes } from "date-fns";
import { CalendarIcon, Clock, ChevronRight, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ITutorWithRelations } from "@/types/tutor.types";
import { GlassCard } from "./ui/GlassCard";
import { MagneticButton } from "./ui/MagneticButton";
import { cn } from "@/lib/utils";

interface BookingSidebarProps {
  tutor: ITutorWithRelations;
  onBook: (date: Date, time: string, duration: number) => void;
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00"
];

const durations = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hr" },
  { value: 120, label: "2 hours" },
];

export function BookingSidebar({ tutor, onBook }: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState<number>(60);
  const displayName = tutor.name || tutor.User?.name || "Tutor";

  const calculatedPrice = useMemo(() => {
    return (tutor.hourlyRate * duration) / 60;
  }, [tutor.hourlyRate, duration]);

  const availableDays = useMemo(() => {
    const dayMap: Record<string, number> = {
      SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
      THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
    };
    return tutor.availableDays?.map((day) => dayMap[day]) || [1, 2, 3, 4, 5];
  }, [tutor.availableDays]);

  const availableTimeSlots = useMemo(() => {
    if (!tutor.availabilityStartTime || !tutor.availabilityEndTime) return timeSlots;
    const [startHour] = tutor.availabilityStartTime.split(":").map(Number);
    const [endHour] = tutor.availabilityEndTime.split(":").map(Number);
    return timeSlots.filter((time) => {
      const hour = parseInt(time.split(":")[0]);
      return hour >= startHour && hour < endHour;
    });
  }, [tutor.availabilityStartTime, tutor.availabilityEndTime]);

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    onBook(selectedDate, selectedTime, duration);
  };

  return (
    <div className="sticky top-6 space-y-4">
      {/* Tutor mini card */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 text-base font-bold text-foreground ring-2 ring-border">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">${tutor.hourlyRate}/hr</p>
          </div>
        </div>
      </GlassCard>

      {/* Booking card */}
      <GlassCard className="overflow-hidden">
        <div className="p-5 space-y-5">
          {/* Section header */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-primary to-primary/50" />
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-syne)" }}>
              Book a Session
            </h3>
          </div>

          {/* Date */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Choose Date</p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(undefined);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today) return true;
                if (!availableDays.includes(date.getDay())) return true;
                return false;
              }}
              className="w-full"
                          classNames={{
                            months: "w-full flex-col",
                            month: "w-full space-y-3",
                            month_caption: "flex justify-center relative items-center text-sm text-foreground",
                            caption_label: "text-sm font-semibold text-foreground",
                            nav: "flex items-center gap-1",
                            button_previous: "h-7 w-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors absolute left-1",
                            button_next: "h-7 w-7 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors absolute right-1",
                            month_grid: "w-full border-collapse",
                            weekdays: "flex w-full",
                            weekday: "w-full text-[11px] font-medium uppercase tracking-wider text-muted-foreground py-2",
                            week: "flex w-full mt-1",
                            day: "flex-1 text-center text-sm p-0 relative",
                            today: "text-primary font-semibold",
                            outside: "text-muted-foreground/30",
                            disabled: "text-muted-foreground/30 opacity-100",
                            hidden: "invisible",
                            range_middle: "aria-selected:bg-primary/10 aria-selected:text-primary",
                          }}
            />
          </div>

          {/* Time slots - show when date selected */}
          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key="time-slots"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
                className="space-y-2.5 overflow-hidden"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Clock className="mr-1.5 inline h-3 w-3" />
                  Choose Time
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "rounded-lg py-2 text-xs font-medium transition-all duration-200",
                        selectedTime === time
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duration + Price */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4 pt-1"
            >
              {/* Duration */}
              <div className="space-y-2.5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</p>
                <div className="flex gap-1.5">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDuration(d.value)}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-xs font-medium transition-all duration-200",
                        duration === d.value
                          ? "bg-muted text-foreground border border-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price break down */}
              <div className="rounded-xl bg-muted border border-border p-4 space-y-2.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Duration</span>
                  <span className="text-foreground/70">{duration} min</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rate</span>
                  <span className="text-foreground/70">${tutor.hourlyRate}/hr</span>
                </div>
                <div className="border-t border-border pt-2.5 flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <MagneticButton
                onClick={handleBook}
                className="w-full h-12 text-sm"
              >
                <CalendarIcon className="h-4 w-4" />
                Confirm Booking
                <ChevronRight className="h-4 w-4" />
              </MagneticButton>

              <p className="text-[11px] text-center text-muted-foreground">
                Free cancellation up to 24h before
              </p>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
