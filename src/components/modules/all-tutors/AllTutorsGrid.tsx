"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataExplorerLayout } from "@/components/shared/data-explorer-layout";
import { TutorCard } from "./TutorCard";

import { getAllTutors } from "@/services/tutor.service";
import { QUERY_KEYS, CACHE_DURATIONS } from "@/lib/constants";
import { ITutorWithRelations } from "@/types/tutor.types";
import { TutorFilters } from "./TutorFilters";

// Sort options for tutor listing
const tutorSortOptions = [
  { value: "hourlyRate_asc", label: "Price: Low to High" },
  { value: "hourlyRate_desc", label: "Price: High to Low" },
  { value: "experienceYears_desc", label: "Most Experienced" },
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "name_asc", label: "Name: A to Z" },
];

// Grid layout configuration
const gridCols = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

interface AllTutorsGridProps {
  initialQueryString?: string;
}

export function AllTutorsGrid({ initialQueryString }: AllTutorsGridProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString() || initialQueryString || "";

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.TUTORS, queryString],
    queryFn: () => getAllTutors(queryString),
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const tutors = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 12,
  };

  const isTableLoading = isLoading || isFetching;

  const renderTutorCard = (tutor: ITutorWithRelations) => {
    return <TutorCard tutor={tutor} />;
  };

  // Memoize renderFilters to prevent infinite re-renders
  const renderFilters = useCallback(() => <TutorFilters />, []);

  return (
    <div className="container mx-auto py-8">
      <DataExplorerLayout
        data={tutors}
        meta={meta}
        isLoading={isTableLoading}
        searchParams={searchParams}
        renderCard={renderTutorCard}
        renderFilters={renderFilters}
        sortOptions={tutorSortOptions}
        gridCols={gridCols}
        searchPlaceholder="Search by name, designation, or subject..."
        queryKey={[QUERY_KEYS.TUTORS]}
        emptyMessage="No tutors found matching your criteria."
        defaultLimit={12}
      />
    </div>
  );
}
