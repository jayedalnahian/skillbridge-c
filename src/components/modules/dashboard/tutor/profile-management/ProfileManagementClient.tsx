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
  Camera,
  ChevronDown,
  Link2,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { ITutorWithRelations } from "@/types/tutor.types";
import { CloudinaryImageUpload } from "@/components/shared/cloudinary-image-upload";
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
import { Button } from "@/components/ui/button";

interface ProfileManagementClientProps {
  tutor: ITutorWithRelations;
}

type FieldProps<T> = {
  state: {
    value: T;
    meta: {
      errors?: Array<{ message?: string } | string>;
    };
  };
  handleChange: (val: T) => void;
};

const formatTimeForPicker = (value: string | undefined): string => {
  if (!value) return "09:00";
  return value.slice(0, 5);
};

export function ProfileManagementClient({ tutor }: ProfileManagementClientProps) {
  const queryClient = useQueryClient();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [availableDays, setAvailableDays] = useState<DaysOfWeek[]>(
    tutor.availableDays || []
  );

  const updateMutation = useMutation({
    mutationFn: async (data: TutorProfileUpdateInput) => {
      const result = await updateTutor(tutor.id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor", tutor.id] });
      queryClient.invalidateQueries({ queryKey: ["tutor-me"] });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: Pick<TutorProfileUpdateInput, "profilePhoto">) => {
      const result = await updateTutor(tutor.id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update profile photo");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor", tutor.id] });
      queryClient.invalidateQueries({ queryKey: ["tutor-me"] });
    },
  });

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
      onSuccess={() => {}}
      submitLabel="Save Changes"
      className="w-full"
    >
      {(form) => (
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-[#00ADB5]/5 to-[#008f96]/5 border-b border-border/50">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar with upload */}
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "skillbridge"
                    }
                    onSuccess={(result: any) => {
                      const imageUrl = result?.info?.secure_url;
                      if (imageUrl) {
                        form.setFieldValue("profilePhoto", imageUrl);
                        uploadMutation.mutate({ profilePhoto: imageUrl });
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="relative group outline-none"
                      >
                        <Avatar size="lg" className="h-28 w-28 ring-4 ring-[#00ADB5]/20 ring-offset-2 ring-offset-background">
                          <AvatarImage
                            src={tutor.profilePhoto || undefined}
                            alt={tutor.name}
                          />
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-[#00ADB5] to-[#008f96] text-white font-bold">
                            {tutor.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00ADB5] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          Change Photo
                        </span>
                      </button>
                    )}
                  </CldUploadWidget>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-foreground">
                        {tutor.name}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="capitalize bg-[#00ADB5]/10 text-[#00ADB5] border-[#00ADB5]/20"
                      >
                        Tutor
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        {tutor.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {tutor.contactNumber}
                      </span>
                    </div>

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

                  {updateSuccess && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg shrink-0">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium whitespace-nowrap">Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ADB5]/10">
                      <User className="h-4 w-4 text-[#00ADB5]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Personal Information</CardTitle>
                      <CardDescription>Update your basic profile details</CardDescription>
                    </div>
                  </div>
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

                  <Separator />

                  <details className="group">
                    <summary className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none">
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="font-medium">Photo URL</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3">
                      <FormField
                        form={form}
                        name="profilePhoto"
                        label="Profile Photo URL"
                        placeholder="https://example.com/photo.jpg"
                        render={(field: any) => (
                          <CloudinaryImageUpload
                            value={field.state.value ?? ""}
                            onChange={(url) => field.handleChange(url)}
                            onUploadSuccess={(url) =>
                              uploadMutation.mutate({ profilePhoto: url })
                            }
                            error={
                              field.state.meta.errors?.length
                                ? field.state.meta.errors
                                    .map((err: unknown) => {
                                      if (typeof err === "string") return err;
                                      if (
                                        err &&
                                        typeof err === "object" &&
                                        "message" in err
                                      ) {
                                        return String(
                                          (err as { message: unknown }).message
                                        );
                                      }
                                      return String(err);
                                    })
                                    .join(", ")
                                : undefined
                            }
                          />
                        )}
                      />
                    </div>
                  </details>
                </CardContent>
              </Card>
            

              {/* Professional Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ADB5]/10">
                      <Award className="h-4 w-4 text-[#00ADB5]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Professional Information</CardTitle>
                      <CardDescription>Update your professional details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    form={form}
                    name="designation"
                    label="Designation"
                    placeholder="e.g., Senior Mathematics Tutor"
                  />

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
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ADB5]/10">
                      <Calendar className="h-4 w-4 text-[#00ADB5]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Availability</CardTitle>
                      <CardDescription>Set your available days and working hours</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="availabilityStartTime">
                      {(field: FieldProps<string>) => (
                        <UniversalDateTimePicker
                          mode="time"
                          label="Start Time"
                          value={field.state.value}
                          onChange={(value) => {
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
                            const timeValue = typeof value === "string" ? value : "17:00";
                            field.handleChange(timeValue || "17:00");
                          }}
                          placeholder="Select end time"
                        />
                      )}
                    </form.Field>
                  </div>

                  {form.state.errors && form.state.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {form.state.errors.join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-[#00ADB5] to-[#008f96] hover:from-[#008f96] hover:to-[#00ADB5] text-white shadow-lg shadow-[#00ADB5]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#00ADB5]/30 hover:scale-[1.02]"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </SmartForm>
  );
}
