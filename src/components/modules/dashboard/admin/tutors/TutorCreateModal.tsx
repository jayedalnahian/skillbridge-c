"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { createTutorSchema } from "./tutorValidators";
import { EDUCATION_LEVELS } from "@/lib/constants";
import { DaysOfWeek } from "@/types/user.types";
import { ICategory } from "@/types/category.types";
import { z } from "zod";
import { MultiSelectApiCombobox } from "@/components/shared/multi-select-api-combobox";
import { getAllCategories } from "@/services/category.service";
import type { ApiResponse } from "@/components/shared/multi-select-api-combobox";
import { UniversalDateTimePicker } from "@/components/shared/date-time-picker/universal-datetime-picker";
import { DaysOfWeekSelector } from "@/components/shared/days-of-week-selector/days-of-week-selector";
import { CloudinaryImageUpload } from "@/components/shared/cloudinary-image-upload";
import { CldUploadWidget } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Link2, ChevronDown } from "lucide-react";

type CreateTutorInput = z.infer<typeof createTutorSchema>;

interface TutorCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<any, Error, CreateTutorInput>;
}


// Fetcher function for MultiSelectApiCombobox
const fetchCategories = async (searchTerm: string): Promise<ApiResponse<ICategory>> => {
  return getAllCategories({ searchTerm, limit: "10", isDeleted: "false" });
};

export function TutorCreateModal({
  isOpen,
  onClose,
  createMutation,
}: TutorCreateModalProps) {
  const [availableDays, setAvailableDays] = useState<DaysOfWeek[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudinaryOpenRef = useRef<() => void>(() => {});
  const setFormPhotoRef = useRef<(url: string) => void>(undefined);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setMounted(true));
      return () => {
        cancelAnimationFrame(id);
        setMounted(false);
      };
    }
  }, [isOpen]);

  const toggleDay = (day: DaysOfWeek) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCategoriesChange = (categories: ICategory[]) => {
    setSelectedCategories(categories);
  };

  const defaultValues: CreateTutorInput = {
    password: "",
    tutor: {
      name: "",
      email: "",
      contactNumber: "",
      profilePhoto: "",
      designation: "",
      educationLevel: "",
      experienceYears: 0,
      hourlyRate: 0,
      availableDays: [],
      availabilityStartTime: "09:00",
      availabilityEndTime: "17:00",
    },
    categories: [],
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh]  dark:bg-slate-950   overflow-y-auto ">

        {mounted && containerRef.current && (
          <CldUploadWidget
            key="cld-upload-widget"
            uploadPreset={
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "skillbridge"
            }
            options={{ container: containerRef.current } as any}
            onSuccess={(result: any) => {
              const imageUrl = result?.info?.secure_url;
              if (imageUrl) {
                setProfilePhoto(imageUrl);
                setFormPhotoRef.current?.(imageUrl);
              }
            }}
          >
            {({ open }: any) => {
              cloudinaryOpenRef.current = open;
              return <div style={{ display: "none" }} />;
            }}
          </CldUploadWidget>
        )}

        <DialogHeader>
          <DialogTitle className="text-[#00ADB5]">Create New Tutor</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new tutor.
          </DialogDescription>
        </DialogHeader>
        <div ref={containerRef}>
          <SmartForm
            schema={createTutorSchema}
            mutation={createMutation}
            defaultValues={defaultValues}
            onSuccess={() => {
              setAvailableDays([]);
              setSelectedCategories([]);
              setProfilePhoto("");
              onClose();
            }}
            submitLabel="Create Tutor"
          >
            {(form) => {
              setFormPhotoRef.current = (url: string) => {
                form.setFieldValue("tutor.profilePhoto", url);
              };

              return (
                <div className="grid gap-4 py-4">

                  {/* Profile Photo Upload */}
                  {/* <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => cloudinaryOpenRef.current()}
                      className="relative group outline-none"
                    >
                      <Avatar size="lg" className="h-28 w-28 ring-4 ring-[#00ADB5]/20 ring-offset-2 ring-offset-background">
                        <AvatarImage
                          src={profilePhoto || undefined}
                          alt="Profile photo"
                        />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-[#00ADB5] to-[#008f96] text-white font-bold">
                          ?
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00ADB5] px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Upload Photo
                      </span>
                    </button>
                  </div> */}

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      form={form}
                      name="tutor.name"
                      label="Name *"
                      placeholder="Enter name"
                    />
                    <FormField
                      form={form}
                      name="tutor.email"
                      label="Email *"
                      type="email"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Password */}
                  <FormField
                    form={form}
                    name="password"
                    label="Password *"
                    type="password"
                    placeholder="Enter password (min 6 chars)"
                  />

                  <FormField
                    form={form}
                    name="tutor.contactNumber"
                    label="Contact Number *"
                    placeholder="Enter contact number"
                  />
{/* 
                  Photo URL */}
                  {/* <details className="group">
                    <summary className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none">
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="font-medium">Photo URL</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-auto transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3">
                      <FormField
                        form={form}
                        name="tutor.profilePhoto"
                        label="Profile Photo URL"
                        placeholder="https://example.com/photo.jpg"
                        render={(field: any) => (
                          <CloudinaryImageUpload
                            value={field.state.value ?? ""}
                            onChange={(url) => {
                              setProfilePhoto(url);
                              field.handleChange(url);
                            }}
                            error={
                              field.state.meta.errors?.length
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
                      />
                    </div>
                  </details> */}

                

                  {/* Professional Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      form={form}
                      name="tutor.designation"
                      label="Designation *"
                      placeholder="Enter designation"
                    />

                    <div className="grid gap-2">
                      <Label htmlFor="tutor.educationLevel">Education Level *</Label>
                      <form.Field name="tutor.educationLevel">
                        {(field: any) => (
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
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      form={form}
                      name="tutor.experienceYears"
                      label="Experience Years *"
                      type="number"
                      placeholder="Years of experience"
                    />
                    <FormField
                      form={form}
                      name="tutor.hourlyRate"
                      label="Hourly Rate ($) *"
                      type="number"
                      placeholder="Hourly rate in USD"
                    />
                  </div>

                  {/* Available Days */}
                  <form.Field name="tutor.availableDays">
                    {(field: any) => (
                      <DaysOfWeekSelector
                        label="Available Days"
                        value={availableDays}
                        onChange={(newDays) => {
                          setAvailableDays(newDays);
                          field.handleChange(newDays);
                        }}
                        helperText="select at least one"
                        required
                        error={
                          field.state.meta.errors?.length > 0
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

                  {/* Availability Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="tutor.availabilityStartTime">
                      {(field: any) => (
                        <UniversalDateTimePicker
                          mode="time"
                          label="Start Time *"
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value || "09:00")}
                          placeholder="Select start time"
                        />
                      )}
                    </form.Field>
                    <form.Field name="tutor.availabilityEndTime">
                      {(field: any) => (
                        <UniversalDateTimePicker
                          mode="time"
                          label="End Time *"
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value || "17:00")}
                          placeholder="Select end time"
                        />
                      )}
                    </form.Field>
                  </div>

                  {/* Categories */}
                  <div className="grid gap-2">
                    <Label>
                      Categories *{" "}
                      <span className="text-xs text-muted-foreground">
                        (select at least one)
                      </span>
                    </Label>
                    <form.Field name="categories">
                      {(field: any) => (
                        <MultiSelectApiCombobox<ICategory>
                          fetcher={fetchCategories}
                          displayKey="name"
                          valueKey="id"
                          placeholder="Search and select categories..."
                          onSelectionChange={(items) => {
                            handleCategoriesChange(items);
                            field.handleChange(items.map((cat) => cat.id));
                          }}
                        />
                      )}
                    </form.Field>
                  </div>
                </div>
              );
            }}
          </SmartForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
