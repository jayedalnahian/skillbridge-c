"use client";

import { ReadonlyURLSearchParams } from "next/navigation";

import {
  useDataExplorerState,
  FilterConfig,
  SortOption,
} from "./useDataExplorerState";
import { DataExplorerToolbar } from "./DataExplorerToolbar";
import { DataExplorerSidebar } from "./DataExplorerSidebar";
import { DataExplorerGrid } from "./DataExplorerGrid";
import { DataExplorerPagination } from "./DataExplorerPagination";

interface GridCols {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface DataExplorerLayoutProps<TData> {
  // Data
  data: TData[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  isLoading?: boolean;

  // URL State (from useSearchParams() in parent)
  searchParams: ReadonlyURLSearchParams;

  // Rendering
  renderCard: (item: TData) => React.ReactNode;

  // Sidebar Filters
  filtersConfig?: FilterConfig[];
  renderFilters?: () => React.ReactNode;

  // Grid Layout
  gridCols?: GridCols;

  // Sorting
  sortOptions: SortOption[];

  // Search
  searchPlaceholder?: string;

  // Actions
  onCreate?: () => void;
  createButtonLabel?: string;
  queryKey?: string[];

  // Selection (extensible - reserved for future use)
  enableSelection?: boolean;

  // Empty state
  emptyMessage?: string;
}

export function DataExplorerLayout<TData>({
  data,
  meta,
  isLoading,
  searchParams,
  renderCard,
  filtersConfig,
  renderFilters,
  gridCols,
  sortOptions,
  searchPlaceholder,
  onCreate,
  createButtonLabel,
  queryKey,
  enableSelection: _enableSelection,
  emptyMessage,
}: DataExplorerLayoutProps<TData>) {

  const {
    optimisticPaginationState,
    optimisticSortState,
    optimisticFilterState,
    optimisticSearchTerm,
    isRouteRefreshPending,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange,
    handleSearchChange,
    handleResetFilters,
  } = useDataExplorerState({
    searchParams,
    sortOptions,
    filtersConfig,
  });

  const isFiltered =
    Object.keys(optimisticFilterState).length > 0 || !!optimisticSearchTerm;

  const handlePageSizeChange = (size: number) => {
    handlePaginationChange((prev) => ({
      ...prev,
      pageSize: size,
    }));
  };

  const currentSortValue = optimisticSortState
    ? `${optimisticSortState.sortBy}_${optimisticSortState.sortOrder}`
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <DataExplorerSidebar
        filtersConfig={filtersConfig}
        renderFilters={renderFilters}
        filterState={optimisticFilterState}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Toolbar - Sticky at top */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm pt-2 pb-2 -mx-2 px-2">
          <DataExplorerToolbar
          searchValue={optimisticSearchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={searchPlaceholder}
          sortValue={currentSortValue}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
          onCreate={onCreate}
          createButtonLabel={createButtonLabel}
          queryKey={queryKey}
          isFiltered={isFiltered}
          onReset={handleResetFilters}
        />
        </div>

        {/* Grid */}
        <DataExplorerGrid
          data={data}
          renderCard={renderCard}
          gridCols={gridCols}
          isLoading={isLoading || isRouteRefreshPending}
          emptyMessage={emptyMessage}
        />

        {/* Pagination */}
        {meta.totalPages > 0 && (
          <DataExplorerPagination
            pageIndex={optimisticPaginationState.pageIndex}
            pageSize={optimisticPaginationState.pageSize}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={(page) =>
              handlePaginationChange((prev) => ({
                ...prev,
                pageIndex: page,
              }))
            }
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

// Export sub-components and hooks for advanced usage
export { DataExplorerToolbar };
export { DataExplorerSidebar };
export { DataExplorerGrid };
export { DataExplorerPagination };
export { useDataExplorerState };
export type { FilterConfig, SortOption, GridCols };
