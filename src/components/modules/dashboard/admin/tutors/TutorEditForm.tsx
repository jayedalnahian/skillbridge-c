"use client";

import { FormField } from "@/components/shared/data-form/data-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DaysOfWeek } from "./tutorTypes";
import { cn } from "@/lib/utils";

interface TutorEditFormProps {
  form: any;
}

const EDUCATION_LEVELS = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
] as const;

export function TutorEditForm({ form }: TutorEditFormProps) {
  const toggleDay = (day: string, currentValue: string[]) => {
    const days = currentValue || [];
    if (days.includes(day as any)) {
      return days.filter((d) => d !== day);
    }
    return [...days, day];
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="name"
          label="Name"
          placeholder="Enter tutor name"
        />
        <FormField
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email address"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="contactNumber"
          label="Contact Number"
          placeholder="Enter phone number"
        />
        <FormField
          form={form}
          name="designation"
          label="Designation"
          placeholder="Enter designation"
        />
      </div>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 gap-4">
        <form.Field name="educationLevel">
          {(field: any) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Education Level</FormLabel>
              <FormControl>
                <Select
                  value={field.state.value || ""}
                  onValueChange={(value) => field.handleChange(value)}
                  onOpenChange={(open) => {
                    if (!open) field.handleBlur();
                  }}
                >
                  <SelectTrigger
                    id={field.name}
                    className={cn(
                      "w-full",
                      field.state.meta.errors.length && "border-destructive focus-visible:ring-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {field.state.meta.errors.length > 0 && (
                <FormMessage>
                  {field.state.meta.errors[0]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        </form.Field>

        <FormField
          form={form}
          name="experienceYears"
          label="Experience (Years)"
          type="number"
          placeholder="Enter years of experience"
        />

        <FormField
          form={form}
          name="hourlyRate"
          label="Hourly Rate ($)"
          type="number"
          placeholder="Enter hourly rate"
        />
      </div>

      {/* Available Days */}
      <form.Field name="availableDays">
        {(field: any) => (
          <FormItem>
            <FormLabel>Available Days</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Available days">
                {Object.values(DaysOfWeek).map((day) => {
                  const isSelected = (field.state.value || []).includes(day);
                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      aria-pressed={isSelected}
                      onClick={() =>
                        field.handleChange(
                          toggleDay(day, field.state.value || [])
                        )
                      }
                    >
                      {day.slice(0, 3)}
                    </Button>
                  );
                })}
              </div>
            </FormControl>
            {field.state.meta.errors.length > 0 && (
              <FormMessage>
                {field.state.meta.errors[0]?.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      </form.Field>

      {/* Availability Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          form={form}
          name="availabilityStartTime"
          label="Start Time"
          type="time"
          placeholder={form.state.values.availabilityStartTime || ""}
          render={(field: any) => {
            // Extract time from ISO string or use as-is
            const value = field.state.value || "";
            const timeValue = value.includes("T")
              ? value.split("T")[1].slice(0, 5)
              : value.slice(0, 5);
            return (
              <Input
                id={field.name}
                type="time"
                value={timeValue}
                onBlur={field.handleBlur}
                placeholder={form.state.values.availabilityStartTime || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const time = e.target.value;
                  // Keep as HH:MM format
                  field.handleChange(time);
                }}
                className={field.state.meta.errors.length ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            );
          }}
        />

        <FormField
          form={form}
          name="availabilityEndTime"
          label="End Time"
          type="time"
          render={(field: any) => {
            // Extract time from ISO string or use as-is
            const value = field.state.value || "";
            const timeValue = value.includes("T")
              ? value.split("T")[1].slice(0, 5)
              : value.slice(0, 5);
            return (
              <Input
                id={field.name}
                type="time"
                value={timeValue}
                onBlur={field.handleBlur}
                placeholder={form.state.values.availabilityEndTime || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const time = e.target.value;
                  // Keep as HH:MM format
                  field.handleChange(time);
                }}
                className={field.state.meta.errors.length ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            );
          }}
        />
      </div>
    </div>
  );
}
