"use client";

import { UseMutationResult } from "@tanstack/react-query";
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
import { useState } from "react";
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
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#00ADB5]">Create New Tutor</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new tutor.
          </DialogDescription>
        </DialogHeader>
        <SmartForm
          schema={createTutorSchema}
          mutation={createMutation}
          defaultValues={defaultValues}
          onSuccess={() => {
            setAvailableDays([]);
            setSelectedCategories([]);
            onClose();
          }}
          submitLabel="Create Tutor"
        >
          {(form) => (
            <div className="grid gap-4 py-4">


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
          )}
        </SmartForm>
      </DialogContent>
    </Dialog>
  );
}
