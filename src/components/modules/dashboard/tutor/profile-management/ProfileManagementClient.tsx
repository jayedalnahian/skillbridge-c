"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";

import { ITutorWithRelations } from "@/types/tutor.types";
import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { DaysOfWeekSelector } from "@/components/shared/days-of-week-selector/days-of-week-selector";
import { UniversalDateTimePicker } from "@/components/shared/date-time-picker/universal-datetime-picker";
import { updateTutor } from "@/services/tutor.service";
import { tutorProfileUpdateSchema, TutorProfileUpdateInput } from "@/zod/tutor-profile.validation";
import { DaysOfWeek } from "@/types/user.types";
import { EDUCATION_LEVELS } from "@/lib/constants";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileManagementClientProps {
  tutor: ITutorWithRelations;
}

// Type for form field render props
type FieldProps<T> = {
  state: {
    value: T;
    meta: {
      errors?: Array<{ message?: string } | string>;
    };
  };
  handleChange: (val: T) => void;
};

/**
 * Format time value for the time picker.
 * Backend now stores times as simple HH:mm strings (e.g., "22:19").
 */
const formatTimeForPicker = (value: string | undefined): string => {
  if (!value) return "09:00";
  // Backend returns HH:mm format directly
  return value.slice(0, 5);
};

export function ProfileManagementClient({ tutor }: ProfileManagementClientProps) {
  const queryClient = useQueryClient();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize available days state from tutor data
  const [availableDays, setAvailableDays] = useState<DaysOfWeek[]>(
    tutor.availableDays || []
  );

  // Mutation for updating tutor profile
  const updateMutation = useMutation({
    mutationFn: async (data: TutorProfileUpdateInput) => {
      const result = await updateTutor(tutor.id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate tutor queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["tutor", tutor.id] });
      queryClient.invalidateQueries({ queryKey: ["tutor-me"] });
      setUpdateSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    },
  });

  // Default form values from tutor data
  const defaultValues: TutorProfileUpdateInput = {
    name: tutor.name || "",
    email: tutor.email || "",
    contactNumber: tutor.contactNumber || "",
    profilePhoto: tutor.profilePhoto || "",
    designation: tutor.designation || "",
    educationLevel: tutor.educationLevel || "",
    experienceYears: tutor.experienceYears || 0,
    availableDays: tutor.availableDays || [],
    availabilityStartTime: formatTimeForPicker(tutor.availabilityStartTime),
    availabilityEndTime: formatTimeForPicker(tutor.availabilityEndTime),
  };

  return (
    <SmartForm
      schema={tutorProfileUpdateSchema}
      mutation={updateMutation}
      defaultValues={defaultValues}
      onSuccess={() => {
        // Additional success handling if needed
      }}
      submitLabel="Save Changes"
      className="w-full"
    >
      {(form) => (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="lg:col-span-2 xl:col-span-3">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar size="lg" className="h-24 w-24 ring-4 ring-[#00ADB5]/20">
                  <AvatarImage
                    src={tutor.profilePhoto || undefined}
                    alt={tutor.name}
                  />
                  <AvatarFallback className="text-2xl bg-[#00ADB5] text-white">
                    {tutor.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {tutor.name}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="capitalize bg-[#00ADB5]/10 text-[#00ADB5] border-[#00ADB5]/20"
                    >
                      Tutor
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {tutor.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {tutor.contactNumber}
                    </span>
                  </div>

                  {/* Categories Display (Read-only) */}
                  {tutor.tutorCategory && tutor.tutorCategory.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tutor.tutorCategory.map((tc) => (
                        <Badge
                          key={tc.categoryId}
                          variant="outline"
                          className="text-xs"
                        >
                          {tc.Category?.name || "Category"}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Success Message */}
                {updateSuccess && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Profile updated successfully!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-[#00ADB5]" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your basic profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                form={form}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
              />

              <FormField
                form={form}
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
              />

              <FormField
                form={form}
                name="contactNumber"
                label="Contact Number"
                placeholder="Enter your contact number"
              />

              <FormField
                form={form}
                name="profilePhoto"
                label="Profile Photo URL"
                placeholder="https://example.com/photo.jpg"
              />
            </CardContent>
          </Card>

          {/* Professional Information Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-[#00ADB5]" />
                Professional Info
              </CardTitle>
              <CardDescription>
                Update your professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                form={form}
                name="designation"
                label="Designation"
                placeholder="e.g., Senior Mathematics Tutor"
              />

              {/* Education Level Select */}
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Education Level
                </label>
                <form.Field name="educationLevel">
                  {(field: FieldProps<string>) => (
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger
                        className={
                          field.state.meta.errors?.length
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </form.Field>
                {form.state.fieldMeta.educationLevel?.errors &&
                  form.state.fieldMeta.educationLevel.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {form.state.fieldMeta.educationLevel.errors.join(", ")}
                    </p>
                  )}
              </div>

              <FormField
                form={form}
                name="experienceYears"
                label="Experience Years"
                type="number"
                placeholder="Years of teaching experience"
              />
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#00ADB5]" />
                Availability
              </CardTitle>
              <CardDescription>
                Set your available days and working hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Available Days */}
              <form.Field name="availableDays">
                {(field: FieldProps<DaysOfWeek[]>) => (
                  <DaysOfWeekSelector
                    label="Available Days"
                    value={availableDays}
                    onChange={(newDays) => {
                      setAvailableDays(newDays);
                      field.handleChange(newDays);
                    }}
                    helperText="select at least one day"
                    error={
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? field.state.meta.errors
                            .map((err: unknown) => {
                              if (typeof err === "string") return err;
                              if (err && typeof err === "object" && "message" in err) {
                                return String((err as { message: unknown }).message);
                              }
                              return String(err);
                            })
                            .join(", ")
                        : undefined
                    }
                  />
                )}
              </form.Field>

              <Separator />

              {/* Availability Times */}
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="availabilityStartTime">
                  {(field: FieldProps<string>) => (
                    <UniversalDateTimePicker
                      mode="time"
                      label="Start Time"
                      value={field.state.value}
                      onChange={(value) => {
                        // Time picker returns string in HH:mm format
                        const timeValue = typeof value === "string" ? value : "09:00";
                        field.handleChange(timeValue || "09:00");
                      }}
                      placeholder="Select start time"
                    />
                  )}
                </form.Field>

                <form.Field name="availabilityEndTime">
                  {(field: FieldProps<string>) => (
                    <UniversalDateTimePicker
                      mode="time"
                      label="End Time"
                      value={field.state.value}
                      onChange={(value) => {
                        // Time picker returns string in HH:mm format
                        const timeValue = typeof value === "string" ? value : "17:00";
                        field.handleChange(timeValue || "17:00");
                      }}
                      placeholder="Select end time"
                    />
                  )}
                </form.Field>
              </div>

              {/* Time validation error */}
              {form.state.errors && form.state.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {form.state.errors.join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </SmartForm>
  );
}
