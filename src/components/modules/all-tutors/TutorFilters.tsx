"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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

  // Slider values as [min, max] arrays
  const [experienceRange, setExperienceRange] = useState<[number, number]>([
    experienceYearsGte ? parseInt(experienceYearsGte) || 0 : 0,
    experienceYearsLte ? parseInt(experienceYearsLte) || 50 : 50,
  ]);
  const [rateRange, setRateRange] = useState<[number, number]>([
    hourlyRateGte ? parseInt(hourlyRateGte) || 0 : 0,
    hourlyRateLte ? parseInt(hourlyRateLte) || 500 : 500,
  ]);

  // Sync slider values when URL params change
  useEffect(() => {
    setExperienceRange([
      experienceYearsGte ? parseInt(experienceYearsGte) || 0 : 0,
      experienceYearsLte ? parseInt(experienceYearsLte) || 50 : 50,
    ]);
  }, [experienceYearsGte, experienceYearsLte]);

  useEffect(() => {
    setRateRange([
      hourlyRateGte ? parseInt(hourlyRateGte) || 0 : 0,
      hourlyRateLte ? parseInt(hourlyRateLte) || 500 : 500,
    ]);
  }, [hourlyRateGte, hourlyRateLte]);

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

  // Apply slider changes for experience
  const handleExperienceSliderChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setExperienceRange([min, max]);
    // Apply immediately on slider change
    const minStr = min === 0 ? "" : min.toString();
    const maxStr = max === 50 ? "" : max.toString();
    updateQueryParams({
      "experienceYears[gte]": minStr || null,
      "experienceYears[lte]": maxStr || null,
    });
  };

  // Apply slider changes for hourly rate
  const handleRateSliderChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setRateRange([min, max]);
    // Apply immediately on slider change
    const minStr = min === 0 ? "" : min.toString();
    const maxStr = max === 500 ? "" : max.toString();
    updateQueryParams({
      "hourlyRate[gte]": minStr || null,
      "hourlyRate[lte]": maxStr || null,
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
    setExperienceRange([0, 50]);
    setRateRange([0, 500]);
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
      {/* Header with active count and reset button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={resetAllFilters}
            className="h-8 px-3 bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
          >
            <X className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      {/* Experience Years Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Experience (Years)</Label>
          <span className="text-xs text-muted-foreground">
            {experienceRange[0]} - {experienceRange[1]} {experienceRange[1] === 50 ? "+" : ""} years
          </span>
        </div>
        <Slider
          value={experienceRange}
          onValueChange={handleExperienceSliderChange}
          min={0}
          max={50}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>25</span>
          <span>50+</span>
        </div>
      </div>

      <Separator />

      {/* Hourly Rate Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Hourly Rate ($)</Label>
          <span className="text-xs text-muted-foreground">
            ${rateRange[0]} - ${rateRange[1]}{rateRange[1] === 500 ? "+" : ""}
          </span>
        </div>
        <Slider
          value={rateRange}
          onValueChange={handleRateSliderChange}
          min={0}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$250</span>
          <span>$500+</span>
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

      {/* Reset Button - Moved to top */}
      {false && activeFilterCount > 0 && (
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
