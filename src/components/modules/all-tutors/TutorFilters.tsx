"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MultiSelectApiCombobox } from "@/components/shared/multi-select-api-combobox";
import { getCategoriesUsedByTutors } from "@/services/category.service";
import { QUERY_KEYS, CACHE_DURATIONS } from "@/lib/constants";
import { ICategory } from "@/types/category.types";
import { X, SlidersHorizontal } from "lucide-react";

const educationLevels = [
  { label: "High School", value: "High School" },
  { label: "Bachelor", value: "Bachelor" },
  { label: "Master", value: "Master" },
  { label: "PhD", value: "PhD" },
];

const daysOfWeek = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

export function TutorFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current filter values from URL
  const experienceYearsGte = searchParams.get("experienceYears[gte]") || "";
  const experienceYearsLte = searchParams.get("experienceYears[lte]") || "";
  const hourlyRateGte = searchParams.get("hourlyRate[gte]") || "";
  const hourlyRateLte = searchParams.get("hourlyRate[lte]") || "";
  const selectedEducationLevels = searchParams.getAll("educationLevel");
  const selectedDays = searchParams.getAll("availableDays");
  const selectedCategories = searchParams.getAll("tutorCategory.Category.name");

  const [localExperienceGte, setLocalExperienceGte] = useState(experienceYearsGte);
  const [localExperienceLte, setLocalExperienceLte] = useState(experienceYearsLte);
  const [localRateGte, setLocalRateGte] = useState(hourlyRateGte);
  const [localRateLte, setLocalRateLte] = useState(hourlyRateLte);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        // Remove existing values for this key
        params.delete(key);

        if (value === null || value === undefined || value === "") {
          // Skip adding - effectively removing
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Apply experience years filter
  const applyExperienceFilter = () => {
    updateQueryParams({
      "experienceYears[gte]": localExperienceGte || null,
      "experienceYears[lte]": localExperienceLte || null,
    });
  };

  // Apply hourly rate filter
  const applyRateFilter = () => {
    updateQueryParams({
      "hourlyRate[gte]": localRateGte || null,
      "hourlyRate[lte]": localRateLte || null,
    });
  };

  // Toggle education level
  const toggleEducationLevel = (level: string) => {
    const newLevels = selectedEducationLevels.includes(level)
      ? selectedEducationLevels.filter((l) => l !== level)
      : [...selectedEducationLevels, level];
    updateQueryParams({ educationLevel: newLevels.length > 0 ? newLevels : null });
  };

  // Toggle available day
  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    updateQueryParams({ availableDays: newDays.length > 0 ? newDays : null });
  };

  // Handle category selection
  const handleCategoryChange = (categories: ICategory[]) => {
    const categoryNames = categories.map((c) => c.name);
    updateQueryParams({
      "tutorCategory.Category.name": categoryNames.length > 0 ? categoryNames : null,
    });
  };

  // Reset all filters
  const resetAllFilters = () => {
    setLocalExperienceGte("");
    setLocalExperienceLte("");
    setLocalRateGte("");
    setLocalRateLte("");
    updateQueryParams({
      "experienceYears[gte]": null,
      "experienceYears[lte]": null,
      "hourlyRate[gte]": null,
      "hourlyRate[lte]": null,
      educationLevel: null,
      availableDays: null,
      "tutorCategory.Category.name": null,
    });
  };

  // Calculate active filter count
  const activeFilterCount =
    (experienceYearsGte ? 1 : 0) +
    (experienceYearsLte ? 1 : 0) +
    (hourlyRateGte ? 1 : 0) +
    (hourlyRateLte ? 1 : 0) +
    selectedEducationLevels.length +
    selectedDays.length +
    selectedCategories.length;

  // Category fetcher for multi-select - returns proper ApiResponse shape
  const categoryFetcher = useCallback(async (searchTerm: string): Promise<{ success: true; message: string; data: ICategory[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
    const result = await getCategoriesUsedByTutors(searchTerm);
    return result as { success: true; message: string; data: ICategory[]; meta: { page: number; limit: number; total: number; totalPages: number } };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with active count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      <Separator />

      {/* Experience Years Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Experience (Years)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localExperienceGte}
            onChange={(e) => setLocalExperienceGte(e.target.value)}
            onBlur={applyExperienceFilter}
            onKeyDown={(e) => e.key === "Enter" && applyExperienceFilter()}
            className="h-8"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localExperienceLte}
            onChange={(e) => setLocalExperienceLte(e.target.value)}
            onBlur={applyExperienceFilter}
            onKeyDown={(e) => e.key === "Enter" && applyExperienceFilter()}
            className="h-8"
            min={0}
          />
        </div>
      </div>

      <Separator />

      {/* Hourly Rate Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Hourly Rate ($)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localRateGte}
            onChange={(e) => setLocalRateGte(e.target.value)}
            onBlur={applyRateFilter}
            onKeyDown={(e) => e.key === "Enter" && applyRateFilter()}
            className="h-8"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={localRateLte}
            onChange={(e) => setLocalRateLte(e.target.value)}
            onBlur={applyRateFilter}
            onKeyDown={(e) => e.key === "Enter" && applyRateFilter()}
            className="h-8"
            min={0}
          />
        </div>
      </div>

      <Separator />

      {/* Education Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Education Level</Label>
        <div className="space-y-2">
          {educationLevels.map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedEducationLevels.includes(level.value)}
                onChange={() => toggleEducationLevel(level.value)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Available Days */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Available Days</Label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <label
              key={day.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedDays.includes(day.value)}
                onChange={() => toggleDay(day.value)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Subject Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Subject Categories</Label>
        <MultiSelectApiCombobox
          fetcher={categoryFetcher}
          placeholder="Search categories..."
          onSelectionChange={handleCategoryChange}
          displayKey="name"
          valueKey="name"
          maxHeight="200px"
        />
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
                <button
                  onClick={() => {
                    const newCategories = selectedCategories.filter((c) => c !== cat);
                    updateQueryParams({
                      "tutorCategory.Category.name": newCategories.length > 0 ? newCategories : null,
                    });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Reset All Filters
          </Button>
        </>
      )}
    </div>
  );
}
