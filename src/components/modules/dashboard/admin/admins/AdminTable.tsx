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
import { getAllAdmins } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { AdminCreateModal } from "./AdminCreateModal";
import { AdminErrorState } from "./AdminErrorState";
import { AdminEditForm } from "./AdminEditForm";
import { AdminDetailsView } from "./AdminDetailsView";
import { columns } from "@/app/(dashboardRoutes)/admin/admins/AdminTableColumns";
import { useAdminMutations } from "@/hooks/useAdminMutation";
import { updateAdminSchema } from "./adminValidators";
import { ADMIN_TABLE_CONFIG, adminFilters } from "./adminConfig";


interface AdminTableProps {
  initialQueryString?: string;
}

export default function AdminTable({ initialQueryString }: AdminTableProps) {
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
    defaultPage: ADMIN_TABLE_CONFIG.defaultPage,
    defaultLimit: ADMIN_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.ADMINS, queryString],
    queryFn: async () => {
      console.log("[DEBUG AdminTable] queryString:", queryString);
      const result = await getAllAdmins(queryString);
      console.log("[DEBUG AdminTable] getAllAdmins result:", result);
      return result;
    },
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  console.log("[DEBUG AdminTable] data:", data);
  console.log("[DEBUG AdminTable] isLoading:", isLoading);
  console.log("[DEBUG AdminTable] error:", error);

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
  const { editMutation, createMutation, permanentDeleteMutation } = useAdminMutations();

  // Event handlers
  const handleCreateClick = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    createMutation.reset();
  }, [createMutation]);

  const handlePermanentDelete = useCallback(
    (id: string) => {
      permanentDeleteMutation.mutate(id);
    },
    [permanentDeleteMutation],
  );

  const isTableLoading = isLoading || isFetching || isRouteRefreshPending;

  return (
    <main className="container mx-auto min-h-screen">
      <Card className="border-none shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#00ADB5]">
                Admins
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your admins and their details
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
          {(() => {
            console.log("[DEBUG AdminTable] Rendering - error:", error, "data?.data:", data?.data, "data?.meta:", data?.meta);
            return null;
          })()}
          {error ? (
            <AdminErrorState />
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
                placeholder: "Search admins by name, email...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={adminFilters}
              onPermanentDelete={handlePermanentDelete}
              onCreate={handleCreateClick}
              createButtonLabel="Add Admin"
              queryKey={[QUERY_KEYS.ADMINS]}
              viewConfig={{
                children: (item) => <AdminDetailsView item={item} />,
              }}
              editConfig={{
                schema: updateAdminSchema,
                mutation: editMutation as any,
                children: (form, item) => <AdminEditForm form={form} adminId={item.id} />,
              }}
            />
          )}
        </CardContent>
      </Card>

      <AdminCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        createMutation={createMutation as any}
      />
    </main>
  );
}
