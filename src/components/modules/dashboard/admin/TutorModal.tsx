"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ITutorCreateInput, ITutorUpdateInput, ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";
import { DaysOfWeek } from "@/types/user.types";
import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

// --- Constants ---

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor?: ITutorWithRelations | null;
  mode: "view" | "edit" | "delete" | "create";
  onConfirm?: (data: ITutorCreateInput | ITutorUpdateInput | string) => void;
  isLoading?: boolean;
  categories?: ICategory[];
}

const DAYS_OF_WEEK: DaysOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const EDUCATION_LEVELS = [
  "High School",
  "Bachelor",
  "Master",
  "PhD",
  "Other",
];

/** Shared styling for SelectContent dropdowns inside the modal */
const SELECT_CONTENT_CLASS =
  "bg-[#2a2f38] border border-[#4a4f58] shadow-xl shadow-black/40 z-[200]";

// --- Helpers ---

const getDefaultValues = (
  mode: "create" | "edit" | "view" | "delete",
  tutor?: ITutorWithRelations | null
) => {
  if ((mode === "edit" || mode === "view") && tutor) {
    return {
      password: "",
      name: tutor.name,
      email: tutor.email,
      contactNumber: tutor.contactNumber,
      designation: tutor.designation,
      educationLevel: tutor.educationLevel,
      experienceYears: tutor.experienceYears,
      hourlyRate: tutor.hourlyRate,
      availabilityStartTime:
        typeof tutor.availabilityStartTime === "string"
          ? tutor.availabilityStartTime.slice(0, 5)
          : "09:00",
      availabilityEndTime:
        typeof tutor.availabilityEndTime === "string"
          ? tutor.availabilityEndTime.slice(0, 5)
          : "17:00",
    };
  }
  return {
    password: "",
    name: "",
    email: "",
    contactNumber: "",
    designation: "",
    educationLevel: "",
    experienceYears: 0,
    hourlyRate: 0,
    availabilityStartTime: "09:00",
    availabilityEndTime: "17:00",
  };
};

// --- Validators ---
// Using z.coerce.number() so string values from HTML inputs are properly
// coerced to numbers before validation, preventing silent validation failures.
const validators = {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contact: z.string().min(1, "Contact number is required"),
  designation: z.string().min(1, "Designation is required"),
  education: z.string().min(1, "Education level is required"),
  number: z.coerce.number().min(0, "Must be 0 or more"),
  time: z.string().min(1, "Time is required"),
};

// --- Component ---

export const TutorModal = ({
  isOpen,
  onClose,
  tutor,
  mode,
  onConfirm,
  isLoading,
  categories = [],
}: TutorModalProps) => {
  const [availableDays, setAvailableDays] = useState<DaysOfWeek[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";
  const isCreateMode = mode === "create";
  const isDisabled = isViewMode || !!isLoading;

  const form = useForm({
    defaultValues: getDefaultValues(mode, tutor),
    onSubmit: async ({ value }) => {
      if (!onConfirm) return;

      if (isCreateMode) {
        onConfirm({
          password: value.password,
          tutor: {
            name: value.name,
            email: value.email,
            contactNumber: value.contactNumber,
            designation: value.designation,
            educationLevel: value.educationLevel,
            experienceYears: Number(value.experienceYears),
            hourlyRate: Number(value.hourlyRate),
            availableDays,
            availabilityStartTime: value.availabilityStartTime,
            availabilityEndTime: value.availabilityEndTime,
          },
          categories: selectedCategories,
        });
      } else {
        onConfirm({
          name: value.name,
          email: value.email,
          contactNumber: value.contactNumber,
          designation: value.designation,
          educationLevel: value.educationLevel,
          experienceYears: Number(value.experienceYears),
          hourlyRate: Number(value.hourlyRate),
          availableDays,
          availabilityStartTime: value.availabilityStartTime,
          availabilityEndTime: value.availabilityEndTime,
        });
      }
    },
  });

  // Reset entire form + local state whenever the modal opens or mode/tutor changes
  useEffect(() => {
    if (!isOpen) return;

    const defaults = getDefaultValues(mode, tutor);
    form.reset(defaults);

    if (tutor && (mode === "edit" || mode === "view")) {
      setAvailableDays(tutor.availableDays);
      setSelectedCategories(
        tutor.tutorCategory?.map((tc) => tc.categoryId) || []
      );
    } else {
      setAvailableDays([]);
      setSelectedCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutor, mode, isOpen]);

  // --- Day & category handlers ---

  const toggleDay = useCallback((day: DaysOfWeek) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const addCategory = useCallback(
    (categoryId: string) => {
      if (!selectedCategories.includes(categoryId)) {
        setSelectedCategories((prev) => [...prev, categoryId]);
      }
    },
    [selectedCategories]
  );

  const removeCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  }, []);

  // --- Title ---

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Tutor Details";
      case "edit":
        return "Edit Tutor";
      case "delete":
        return tutor?.isDeleted ? "Restore Tutor" : "Delete Tutor";
      case "create":
        return "Create New Tutor";
    }
  };

  // --- Delete confirmation dialog ---

  if (isDeleteMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-[#222831] border-[#393E46] shadow-2xl shadow-black/50">
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>
              {tutor?.isDeleted
                ? "Are you sure you want to restore this tutor?"
                : "Are you sure you want to delete this tutor?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant={tutor?.isDeleted ? "default" : "destructive"}
              className={
                tutor?.isDeleted
                  ? "bg-[#00ADB5] hover:bg-[#008f96] text-white"
                  : ""
              }
              onClick={() => onConfirm?.(tutor?.id || "")}
              disabled={isLoading}
            >
              {isLoading
                ? tutor?.isDeleted
                  ? "Restoring..."
                  : "Deleting..."
                : tutor?.isDeleted
                  ? "Restore"
                  : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Create / Edit / View form dialog ---

  const availableCategoriesToAdd = categories
    .filter((cat) => !cat.isDeleted)
    .filter((cat) => !selectedCategories.includes(cat.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#222831] border-[#393E46] shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Fill in the details to create a new tutor account."
              : isViewMode
                ? "Viewing tutor details."
                : "Edit the tutor details below."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 py-4"
        >
          {/* --- Basic Info --- */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="name"
              validators={{ onChange: validators.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Name *"
                  placeholder="Enter name"
                  disabled={isDisabled}
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: validators.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email *"
                  type="email"
                  placeholder="Enter email"
                  disabled={isDisabled || mode === "edit"}
                />
              )}
            </form.Field>
          </div>

          {isCreateMode && (
            <form.Field
              name="password"
              validators={{ onChange: validators.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password *"
                  type="password"
                  placeholder="Enter password (min 6 chars)"
                  disabled={isDisabled}
                />
              )}
            </form.Field>
          )}

          <form.Field
            name="contactNumber"
            validators={{ onChange: validators.contact }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Contact Number *"
                placeholder="Enter contact number"
                disabled={isDisabled}
              />
            )}
          </form.Field>

          {/* --- Professional Info --- */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="designation"
              validators={{ onChange: validators.designation }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Designation *"
                  placeholder="Enter designation"
                  disabled={isDisabled}
                />
              )}
            </form.Field>

            <div className="grid gap-2">
              <Label htmlFor="educationLevel">Education Level *</Label>
              <form.Field
                name="educationLevel"
                validators={{ onChange: validators.education }}
              >
                {(field) => (
                  <Select
                    value={field.state.value}
                    disabled={isDisabled}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent className={SELECT_CONTENT_CLASS}>
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
            <form.Field
              name="experienceYears"
              validators={{ onChange: validators.number }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Experience Years *"
                  type="number"
                  placeholder="Years of experience"
                  disabled={isDisabled}
                />
              )}
            </form.Field>

            <form.Field
              name="hourlyRate"
              validators={{ onChange: validators.number }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Hourly Rate ($) *"
                  type="number"
                  placeholder="Hourly rate in USD"
                  disabled={isDisabled}
                />
              )}
            </form.Field>
          </div>

          {/* --- Available Days --- */}
          <div className="grid gap-2">
            <Label>
              Available Days *{" "}
              <span className="text-xs text-muted-foreground">
                (select at least one)
              </span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <Badge
                  key={day}
                  variant={availableDays.includes(day) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    availableDays.includes(day)
                      ? "bg-[#00ADB5] hover:bg-[#008f96]"
                      : "hover:bg-[#393E46]"
                  } ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </Badge>
              ))}
            </div>
          </div>

          {/* --- Availability Time --- */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="availabilityStartTime"
              validators={{ onChange: validators.time }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Start Time *"
                  type="time"
                  disabled={isDisabled}
                />
              )}
            </form.Field>

            <form.Field
              name="availabilityEndTime"
              validators={{ onChange: validators.time }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="End Time *"
                  type="time"
                  disabled={isDisabled}
                />
              )}
            </form.Field>
          </div>

          {/* --- Categories (edit / create) --- */}
          {!isViewMode && (
            <div className="grid gap-2">
              <Label>Categories *</Label>
              <Select
                disabled={!!isLoading}
                onValueChange={addCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add a category" />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLASS}>
                  {availableCategoriesToAdd.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((catId) => {
                    const category = categories.find((c) => c.id === catId);
                    return (
                      <Badge
                        key={catId}
                        variant="secondary"
                        className="flex items-center gap-1 bg-[#393E46]"
                      >
                        {category?.name || catId}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCategory(catId)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --- Categories (view mode) --- */}
          {isViewMode && tutor?.tutorCategory && (
            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {tutor.tutorCategory.map((tc) => (
                  <Badge
                    key={tc.categoryId}
                    variant="secondary"
                    className="bg-[#393E46]"
                  >
                    {tc.Category?.name || tc.categoryId}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* --- Footer --- */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || !!isLoading}
                    pendingLabel={
                      isCreateMode ? "Creating..." : "Saving..."
                    }
                    disabled={
                      !canSubmit ||
                      (isCreateMode && selectedCategories.length === 0) ||
                      availableDays.length === 0
                    }
                    className="bg-[#00ADB5] hover:bg-[#008f96] w-3/12"
                  >
                    {isCreateMode ? "Create Tutor" : "Save Changes"}
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
