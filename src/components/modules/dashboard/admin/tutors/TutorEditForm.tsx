"use client";

import { useEffect } from "react";
import { FormField } from "@/components/shared/data-form/data-form";
import { Label } from "@/components/ui/label";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MultiSelectApiCombobox } from "@/components/shared/multi-select-api-combobox";
import { getAssignedCategories } from "@/services/tutor.service";
import { getAllCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import { useQuery } from "@tanstack/react-query";

interface TutorEditFormProps {
  form: any;
  tutorId: string;
}

const EDUCATION_LEVELS = [
  "High School",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
] as const;

export function TutorEditForm({ form, tutorId }: TutorEditFormProps) {
  const toggleDay = (day: string, currentValue: string[]) => {
    const days = currentValue || [];
    if (days.includes(day as any)) {
      return days.filter((d) => d !== day);
    }
    return [...days, day];
  };

  // Fetch assigned categories using TanStack Query
  const { data: assignedCategoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["tutor", tutorId, "categories"],
    queryFn: async () => {
      const result = await getAssignedCategories(tutorId);
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    },
    enabled: !!tutorId,
  });

  const assignedCategories = assignedCategoriesData || [];

  // Sync fetched categories to form state when data loads
  useEffect(() => {
    if (assignedCategoriesData && assignedCategoriesData.length > 0) {
      const categoryIds = assignedCategoriesData.map((cat) => cat.id);
      console.log("[TutorEditForm] Syncing categories to form:", categoryIds);
      form.setFieldValue("categories", categoryIds);
    }
  }, [assignedCategoriesData]);

  // Debug: Log form state
  console.log("[TutorEditForm] form.state.values:", form.state.values);
  console.log("[TutorEditForm] form.state.isSubmitting:", form.state.isSubmitting);
  console.log("[TutorEditForm] assignedCategories:", assignedCategories);

  // Handle category selection changes
  const handleCategoriesChange = (selectedCategories: ICategory[]) => {
    // Extract category IDs for form submission
    const categoryIds = selectedCategories.map((cat) => cat.id);
    console.log("[TutorEditForm] handleCategoriesChange - categoryIds:", categoryIds);
    // Update form with category IDs
    form.setFieldValue("categories", categoryIds);
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

      {/* Assigned Categories */}
      <div className="grid gap-2">
        <Label>
          Assigned Categories{" "}
          <span className="text-xs text-muted-foreground">
            (select at least one)
          </span>
        </Label>
        <form.Field name="categories">
          {(field: any) => (
            <FormItem>
              <FormControl>
                <MultiSelectApiCombobox<ICategory>
                  fetcher={getAllCategories}
                  placeholder="Search and select categories..."
                  onSelectionChange={handleCategoriesChange}
                  displayKey="name"
                  valueKey="id"
                  initialSelectedItems={assignedCategories}
                  className={field.state.meta.errors.length ? "border-destructive focus-visible:ring-destructive" : ""}
                  disabled={isLoadingCategories}
                  key={assignedCategories.length} // Force re-render when data changes
                />
              </FormControl>
              {field.state.meta.errors.length > 0 && (
                <FormMessage>
                  {field.state.meta.errors[0]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        </form.Field>
      </div>
    </div>
  );
}
