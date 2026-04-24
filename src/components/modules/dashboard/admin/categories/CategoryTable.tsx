"use client";

import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { DataTable } from "@/components/shared/data-table/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllCategories } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { columns } from "@/app/(dashboardRoutes)/admin/categories/categoryTableColumns";
import { CACHE_DURATIONS, QUERY_KEYS } from "@/lib/constants";
import { CategoryDetailsView } from "./CategoryDetailsView";
import { CategoryCreateModal } from "./CategoryCreateModal";
import { CategoryErrorState } from "./CategoryErrorState";
import { useCategoryMutations } from "../../../../../hooks/useCategoryMutations";
import { categoryFilters, CATEGORY_TABLE_CONFIG } from "./categoryConfig";
import { categorySchema } from "./categoryValidators";
import { CategoryTableProps } from "./categoryTypes";





export default function CategoryTable({ initialQueryString }: CategoryTableProps) {
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
    defaultPage: CATEGORY_TABLE_CONFIG.defaultPage,
    defaultLimit: CATEGORY_TABLE_CONFIG.defaultLimit,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  // Data fetching
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, queryString],
    queryFn: () => getAllCategories(queryString),
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Column filters from URL
  const columnFiltersStateFromUrl = useMemo<ColumnFiltersState>(() => {
    const isDeleted = searchParams.get("isDeleted");
    if (isDeleted) {
      return [{ id: "isDeleted", value: [isDeleted] }];
    }
    return [];
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
  const { editMutation, createMutation, deleteMutation, permanentDeleteMutation, restoreMutation } = useCategoryMutations();

  const handleCreateClick = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    createMutation.reset();
  }, [createMutation]);

  const handleDelete = useCallback(
    (ids: string[]) => {
      deleteMutation.mutate(ids);
    },
    [deleteMutation],
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
                Categories
              </CardTitle>
              <CardDescription className="mt-1">
                Showing All Categories
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
            <CategoryErrorState />
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
                placeholder: "Search categories...",
                onSearchChange: handleDebouncedSearchChange,
              }}
              columnFilters={{
                state: columnFiltersStateFromUrl,
                onColumnFiltersChange: handleColumnFiltersChange,
              }}
              filters={categoryFilters}
              onDelete={handleDelete}
              onPermanentDelete={handlePermanentDelete}
              onRestore={handleRestore}
              onCreate={handleCreateClick}
              createButtonLabel="Add Category"
              queryKey={[QUERY_KEYS.CATEGORIES]}
              viewConfig={{
                children: (item) => <CategoryDetailsView item={item} />,
              }}
              editConfig={{
                schema: categorySchema,
                mutation: editMutation,
                children: (form) => (
                  <div className="grid gap-4 py-4">
                    <FormField
                      form={form}
                      name="name"
                      label="Category Name"
                      placeholder="Enter category name"
                    />
                    <FormField
                      form={form}
                      name="slug"
                      label="Slug"
                      placeholder="Enter slug"
                    />
                    <FormField
                      form={form}
                      name="description"
                      label="Description"
                      render={(field) => (
                        <Textarea
                          id={field.name}
                          placeholder="Optional description"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={
                            field.state.meta.errors.length
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>
                ),
              }}
            />
          )}
        </CardContent>
      </Card>

      <CategoryCreateModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        createMutation={createMutation}
      />
    </main>
  );
}
