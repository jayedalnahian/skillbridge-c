"use client";

import { DataTable } from "@/components/shared/data-table/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllReviews } from "@/services/review.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { columns } from "@/app/(dashboardRoutes)/tutor/reviews/reviewTableColumns";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { ReviewDetailsView } from "./ReviewDetailsView";
import { ReviewErrorState } from "./ReviewErrorState";
import { reviewFilters, REVIEW_TABLE_CONFIG } from "./reviewConfig";
import { ReviewTableProps } from "./reviewTypes";

export default function ReviewTable({ initialQueryString }: ReviewTableProps) {
  const searchParams = useSearchParams();

  // Table state management
  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: REVIEW_TABLE_CONFIG.defaultPage,
    defaultLimit: REVIEW_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, queryString],
    queryFn: () => getAllReviews(queryString),
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Column filters from URL
  const columnFiltersStateFromUrl = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    const isDeleted = searchParams.get("isDeleted");
    const rating = searchParams.get("rating");

    if (isDeleted) {
      filters.push({ id: "isDeleted", value: [isDeleted] });
    }
    if (rating) {
      filters.push({ id: "rating", value: [rating] });
    }

    return filters;
  }, [searchParams]);

  // Filter change handler
  const handleColumnFiltersChange = useCallback(
    (
      updaterOrValue:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState),
    ) => {
      const nextFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFiltersStateFromUrl)
          : updaterOrValue;

      updateParams(
        (params) => {
          const isDeletedFilter = nextFilters.find((f) => f.id === "isDeleted");
          const ratingFilter = nextFilters.find((f) => f.id === "rating");

          if (isDeletedFilter) {
            const val = Array.isArray(isDeletedFilter.value)
              ? isDeletedFilter.value[0]
              : isDeletedFilter.value;
            params.set("isDeleted", String(val));
          } else {
            params.delete("isDeleted");
          }

          if (ratingFilter) {
            const val = Array.isArray(ratingFilter.value)
              ? ratingFilter.value[0]
              : ratingFilter.value;
            params.set("rating", String(val));
          } else {
            params.delete("rating");
          }
        },
        { resetPage: true },
      );
    },
    [updateParams, columnFiltersStateFromUrl],
  );

  const isTableLoading = isLoading || isFetching || isRouteRefreshPending;

  return (
    <main className="container mx-auto min-h-screen">
      <Card className="border-none shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#00ADB5]">
                Reviews
              </CardTitle>
              <CardDescription className="mt-1">
                Showing your received reviews
              </CardDescription>
            </div>
            {isTableLoading && (
              <div className="flex items-center gap-2 text-[#00ADB5] animate-pulse">
                <div className="h-2 w-2 rounded-full bg-[#00ADB5]" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Syncing Data
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error ? (
            <ReviewErrorState />
          ) : (
            <DataTable
              isLoading={isTableLoading}
              columns={columns}
              data={data?.data || []}
              meta={data?.meta}
              sorting={{
                state: optimisticSortingState,
                onSortingChange: handleSortingChange,
              }}
              pagination={{
                state: optimisticPaginationState,
                onPaginationChange: handlePaginationChange,
              }}
              search={{
                initialValue: searchTermFromUrl,
                placeholder: "Search reviews...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={reviewFilters}
              queryKey={[QUERY_KEYS.REVIEWS]}
              viewConfig={{
                children: (item) => <ReviewDetailsView item={item} />,
              }}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
