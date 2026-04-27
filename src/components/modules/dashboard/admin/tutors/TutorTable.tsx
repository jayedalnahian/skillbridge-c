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
import { getAllTutors } from "@/services/tutor.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { TutorDetailsView } from "./TutorDetailsView";
import { TutorCreateModal } from "./TutorCreateModal";
import { TutorErrorState } from "./TutorErrorState";
import { TutorEditForm } from "./TutorEditForm";
import { columns } from "@/app/(dashboardRoutes)/admin/tutors/tutorTableCoumns";
import { ITutorWithRelations } from "@/types/tutor.types";
import { useTutorMutations } from "@/hooks/useTutorMutations";
import { updateTutorSchema } from "./tutorValidators";

// Table configuration
const TUTOR_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

// Filter options for the table
const tutorFilters = [
  {
    columnId: "isDeleted",
    title: "Deleted",
    options: [
      { label: "No", value: "false" },
      { label: "Yes", value: "true" },
    ],
  },
  {
    columnId: "status",
    title: "Tutor Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Banned", value: "BANNED" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];

interface TutorTableProps {
  initialQueryString?: string;
}

export default function TutorTable({ initialQueryString }: TutorTableProps) {
  const searchParams = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
    defaultPage: TUTOR_TABLE_CONFIG.defaultPage,
    defaultLimit: TUTOR_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.TUTORS, queryString],
    queryFn: () => getAllTutors(queryString),
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
    const status = searchParams.get("status");

    if (isDeleted) {
      filters.push({ id: "isDeleted", value: [isDeleted] });
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
          const statusFilter = nextFilters.find((f) => f.id === "status");

          if (isDeletedFilter) {
            const val = Array.isArray(isDeletedFilter.value)
              ? isDeletedFilter.value[0]
              : isDeletedFilter.value;
            params.set("isDeleted", String(val));
          } else {
            params.delete("isDeleted");
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
  const { editMutation, createMutation, bulkSoftDeleteTutorsMutation, permanentDeleteMutation, restoreMutation } = useTutorMutations();

  // Event handlers
  const handleCreateClick = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    createMutation.reset();
  }, [createMutation]);

  const handleDelete = useCallback(
    (ids: string[]) => {
      bulkSoftDeleteTutorsMutation.mutate(ids);
    },
    [bulkSoftDeleteTutorsMutation],
  );

  const handlePermanentDelete = useCallback(
    (id: string) => {
      permanentDeleteMutation.mutate(id);
    },
    [permanentDeleteMutation],
  );

  const handleRestore = useCallback(
    (id: string) => {
      restoreMutation.mutate(id);
    },
    [restoreMutation],
  );

  const isTableLoading = isLoading || isFetching || isRouteRefreshPending;

  return (
    <main className="container mx-auto min-h-screen">
      <Card className="border-none shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#00ADB5]">
                Tutors
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your tutors and their details
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
            <TutorErrorState />
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
                placeholder: "Search tutors by name, email...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={tutorFilters}
              onSoftDelete={handleDelete}
              onPermanentDelete={handlePermanentDelete}
              onRestore={handleRestore}
              onCreate={handleCreateClick}
              createButtonLabel="Add Tutor"
              queryKey={[QUERY_KEYS.TUTORS]}
              viewConfig={{
                children: (item: ITutorWithRelations) => (
                  <TutorDetailsView item={item} />
                ),
              }}
              editConfig={{
                schema: updateTutorSchema,
                mutation: editMutation as any,
                children: (form) => <TutorEditForm form={form} />,
              }}
            />
          )}
        </CardContent>
      </Card>

      <TutorCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        createMutation={createMutation as any}
      />
    </main>
  );
}
