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
import { getAllStudents } from "@/services/student.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { StudentDetailsView } from "./StudentDetailsView";
import { StudentErrorState } from "./StudentErrorState";
import { StudentEditForm } from "./StudentEditForm";
import { columns } from "@/app/(dashboardRoutes)/admin/students/studentTableColumns";
import { IStudent } from "@/types/user.types";
import { useStudentMutations } from "@/hooks/useStudentMutations";
import { updateStudentSchema } from "./studentValidation";
import { STUDENT_TABLE_CONFIG, studentFilters } from "./studentConfig";

interface StudentTableProps {
  initialQueryString?: string;
}

export default function StudentTable({ initialQueryString }: StudentTableProps) {
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
    defaultPage: STUDENT_TABLE_CONFIG.defaultPage,
    defaultLimit: STUDENT_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, queryString],
    queryFn: () => getAllStudents(queryString),
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

    if (isDeleted) {
      filters.push({ id: "isDeleted", value: [isDeleted] });
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

          if (isDeletedFilter) {
            const val = Array.isArray(isDeletedFilter.value)
              ? isDeletedFilter.value[0]
              : isDeletedFilter.value;
            params.set("isDeleted", String(val));
          } else {
            params.delete("isDeleted");
          }
        },
        { resetPage: true },
      );
    },
    [updateParams, columnFiltersStateFromUrl],
  );

  // Mutations
  const {
    editMutation,
    bulkSoftDeleteMutation,
    permanentDeleteMutation,
    restoreMutation,
  } = useStudentMutations();

  // Event handlers
  const handleDelete = useCallback(
    (ids: string[]) => {
      bulkSoftDeleteMutation.mutate(ids);
    },
    [bulkSoftDeleteMutation],
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
                Students
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your students and their details
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
            <StudentErrorState />
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
                placeholder: "Search students by name, email...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={studentFilters}
              onSoftDelete={handleDelete}
              onPermanentDelete={handlePermanentDelete}
              onRestore={handleRestore}
              queryKey={[QUERY_KEYS.STUDENTS]}
              viewConfig={{
                children: (item: IStudent) => (
                  <StudentDetailsView item={item} />
                ),
              }}
              editConfig={{
                schema: updateStudentSchema,
                mutation: editMutation as any,
                children: (form, item) => <StudentEditForm form={form} />,
              }}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
