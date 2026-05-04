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
import { getAllBookings } from "@/services/booking.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { columns } from "@/app/(dashboardRoutes)/admin/bookings/bookingTableColumns";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { BookingDetailsView } from "./BookingDetailsView";
import { BookingErrorState } from "./BookingErrorState";
import { useBookingMutations } from "@/hooks/useBookingMutations";
import { bookingFilters, BOOKING_TABLE_CONFIG } from "./bookingConfig";
import { BookingTableProps } from "./bookingTypes";

export default function BookingTable({ initialQueryString }: BookingTableProps) {
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
    defaultPage: BOOKING_TABLE_CONFIG.defaultPage,
    defaultLimit: BOOKING_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS, queryString],
    queryFn: () => getAllBookings(queryString),
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
    const paymentStatus = searchParams.get("paymentStatus");
    const status = searchParams.get("status");

    if (isDeleted) {
      filters.push({ id: "isDeleted", value: [isDeleted] });
    }
    if (paymentStatus) {
      filters.push({ id: "paymentStatus", value: [paymentStatus] });
    }
    if (status) {
      filters.push({ id: "status", value: [status] });
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
          const paymentStatusFilter = nextFilters.find((f) => f.id === "paymentStatus");
          const statusFilter = nextFilters.find((f) => f.id === "status");

          if (isDeletedFilter) {
            const val = Array.isArray(isDeletedFilter.value)
              ? isDeletedFilter.value[0]
              : isDeletedFilter.value;
            params.set("isDeleted", String(val));
          } else {
            params.delete("isDeleted");
          }

          if (paymentStatusFilter) {
            const val = Array.isArray(paymentStatusFilter.value)
              ? paymentStatusFilter.value[0]
              : paymentStatusFilter.value;
            params.set("paymentStatus", String(val));
          } else {
            params.delete("paymentStatus");
          }

          if (statusFilter) {
            const val = Array.isArray(statusFilter.value)
              ? statusFilter.value[0]
              : statusFilter.value;
            params.set("status", String(val));
          } else {
            params.delete("status");
          }
        },
        { resetPage: true },
      );
    },
    [updateParams, columnFiltersStateFromUrl],
  );

  // Mutations
  const { hardDeleteMutation } = useBookingMutations();

  const handleHardDelete = useCallback(
    (id: string) => {
      hardDeleteMutation.mutate(id);
    },
    [hardDeleteMutation],
  );

  const isTableLoading = isLoading || isFetching || isRouteRefreshPending;

  return (
    <main className="container mx-auto min-h-screen">
      <Card className="border-none shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#00ADB5]">
                Bookings
              </CardTitle>
              <CardDescription className="mt-1">
                Showing All Bookings
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
            <BookingErrorState />
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
                placeholder: "Search bookings...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={bookingFilters}
              onPermanentDelete={handleHardDelete}
              queryKey={[QUERY_KEYS.BOOKINGS]}
              viewConfig={{
                children: (item) => <BookingDetailsView item={item} />,
              }}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
