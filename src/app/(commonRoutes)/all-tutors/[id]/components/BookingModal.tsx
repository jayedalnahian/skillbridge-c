"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMinutes, parseISO } from "date-fns";
import {
  X,
  CalendarDays,
  Clock,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/services/booking.service";
import { toast } from "sonner";
import { ITutorWithRelations } from "@/types/tutor.types";
import { GlassCard } from "./ui/GlassCard";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: ITutorWithRelations;
  prefill?: {
    date: Date;
    time: string;
    duration: number;
  } | null;
}

interface BookingResult {
  booking: { id: string; startDateTime: string; endDateTime: string; price: number; duration: number; status: string };
  payment: { id: string; amount: number; status: string };
  paymentUrl: string;
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

const steps = [
  { id: 1, label: "Date", icon: CalendarDays },
  { id: 2, label: "Time", icon: Clock },
  { id: 3, label: "Confirm", icon: CreditCard },
];

export function BookingModal({ isOpen, onClose, tutor, prefill }: BookingModalProps) {
  const [step, setStep] = useState(prefill ? 3 : 1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(prefill?.date);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(prefill?.time);
  const [duration, setDuration] = useState<number>(prefill?.duration ?? 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

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

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startDateTime = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes
      ));
      const endDateTime = addMinutes(startDateTime, duration);
      const payload = {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      };

      const result = await createBooking(tutor.id, payload);
      if (result.success && result.data) {
        setBookingResult(result.data as BookingResult);
        toast.success("Booking created successfully!");
      } else {
        toast.error(result.message || "Failed to create booking");
      }
    } catch {
      toast.error("An error occurred while creating the booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNow = () => {
    if (bookingResult?.paymentUrl) {
      window.location.href = bookingResult.paymentUrl;
    }
  };

  const handleClose = () => {
    setStep(prefill ? 3 : 1);
    setSelectedDate(prefill?.date ?? undefined);
    setSelectedTime(prefill?.time ?? undefined);
    setDuration(prefill?.duration ?? 60);
    setBookingResult(null);
    onClose();
  };

  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0, 1] as const } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence onExitComplete={handleClose}>
      <motion.div
        key="overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm dark:bg-black/70 p-4"
        onClick={handleClose}
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <GlassCard className="p-0 overflow-hidden border-border">
            {!bookingResult ? (
              <>
                {/* Header */}
                <div className="relative flex items-center justify-between p-5 border-b border-border">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="h-8 w-8" />
                  )}

                  <div className="flex items-center gap-1.5">
                    <h2
                      className="text-sm font-semibold text-foreground"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      Book with {displayName.split(" ")[0]}
                    </h2>
                  </div>

                  <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center gap-0 px-5 pt-5 pb-2">
                  {steps.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300",
                            step === s.id
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                              : step > s.id
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {step > s.id ? <CheckCircle className="h-3.5 w-3.5" /> : s.id}
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-medium hidden sm:inline",
                            step === s.id
                              ? "text-foreground"
                              : step > s.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={cn(
                            "mx-2 h-px w-10 sm:w-16 transition-colors duration-300",
                            step > s.id ? "bg-primary/40" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step content */}
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Date */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-muted-foreground text-center">
                          Select your preferred date for the session
                        </p>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) setStep(2);
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
                            month_caption: "flex justify-center relative items-center text-sm",
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
                        {selectedDate && (
                          <p className="text-center text-sm text-primary">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Step 2: Time + Duration */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <p className="text-xs text-muted-foreground text-center">
                          {selectedDate && format(selectedDate, "EEEE, MMMM d")}
                        </p>

                        {/* Time */}
                        <div className="space-y-2.5">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Available Times
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {availableTimeSlots.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                  "rounded-lg py-2.5 text-xs font-medium transition-all duration-200",
                                  selectedTime === time
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2.5">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</p>
                          <div className="flex gap-2">
                            {durations.map((d) => (
                              <button
                                key={d.value}
                                type="button"
                                onClick={() => setDuration(d.value)}
                                className={cn(
                                  "flex-1 rounded-lg py-2.5 text-xs font-medium transition-all duration-200",
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

                        {/* Continue */}
                        <Button
                          onClick={() => setStep(3)}
                          disabled={!selectedTime}
                          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                          Continue to Confirm
                        </Button>
                      </motion.div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="rounded-xl bg-muted border border-border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Tutor</span>
                            <span className="text-sm text-foreground/80 font-medium">{displayName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Date</span>
                            <span className="text-sm text-foreground/80">
                              {selectedDate && format(selectedDate, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Time</span>
                            <span className="text-sm text-foreground/80">{selectedTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Duration</span>
                            <span className="text-sm text-foreground/80">{duration} minutes</span>
                          </div>
                          <div className="border-t border-border pt-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Total</span>
                            <span className="text-xl font-bold text-primary">${calculatedPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Confirm & Pay
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 text-center space-y-6"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/10 ring-1 ring-primary/20 dark:from-primary/30 dark:to-emerald-500/20">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    Session Booked!
                  </h3>
                  <p className="text-sm text-muted-foreground">Your session has been scheduled successfully</p>
                </div>

                <div className="rounded-xl bg-muted border border-border p-4 space-y-2.5 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="text-foreground/70 font-mono">{bookingResult.booking.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="text-foreground/70">
                      {format(parseISO(bookingResult.booking.startDateTime), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground/70">{bookingResult.booking.duration} min</span>
                  </div>
                  <div className="border-t border-border pt-2.5 flex justify-between">
                    <span className="text-sm font-semibold text-foreground">Amount Due</span>
                    <span className="text-lg font-bold text-primary">
                      ${bookingResult.payment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePayNow}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="w-full h-12 rounded-xl border-border bg-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    Pay Later
                  </Button>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
