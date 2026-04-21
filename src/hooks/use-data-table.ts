"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { IQueryParams } from "../../backendUtils/query.interface";

interface UseDataTableProps {
  initialPagination?: PaginationState;
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialGlobalFilter?: string;
}

export function useDataTable({
  initialPagination = { pageIndex: 0, pageSize: 10 },
  initialSorting = [],
  initialColumnFilters = [],
  initialGlobalFilter = "",
}: UseDataTableProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initialize state from URL or defaults
  const urlState = useMemo(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const searchTerm = searchParams.get("searchTerm");

    const pagination: PaginationState = {
      pageIndex: page ? Math.max(0, parseInt(page) - 1) : initialPagination.pageIndex,
      pageSize: limit ? parseInt(limit) : initialPagination.pageSize,
    };

    const sorting: SortingState = sortBy
      ? [{ id: sortBy, desc: sortOrder === "desc" }]
      : initialSorting;

    const columnFilters: ColumnFiltersState = [];
    const processedKeys = new Set<string>();
    
    searchParams.forEach((_, key) => {
      if (!["page", "limit", "sortBy", "sortOrder", "searchTerm"].includes(key) && !processedKeys.has(key)) {
        const values = searchParams.getAll(key);
        columnFilters.push({ 
            id: key, 
            value: values.length > 1 ? values : values[0] 
        });
        processedKeys.add(key);
      }
    });

    return {
      pagination,
      sorting,
      columnFilters,
      globalFilter: searchTerm || initialGlobalFilter,
    };
  }, [searchParams, initialPagination, initialSorting, initialGlobalFilter]);

  // For the search input, we need a local state for immediate feedback
  const [globalFilter, setGlobalFilter] = useState(urlState.globalFilter);
  const [debouncedSearchTerm] = useDebounce(globalFilter, 500);

  // Sync globalFilter if URL changes externally
  useEffect(() => {
    setGlobalFilter(urlState.globalFilter);
  }, [urlState.globalFilter]);

  // Helper to update URL
  const updateUrl = useCallback((updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Updaters
  const onPaginationChange: OnChangeFn<PaginationState> = useCallback((updaterOrValue) => {
    const next = typeof updaterOrValue === "function" ? updaterOrValue(urlState.pagination) : updaterOrValue;
    updateUrl({
      page: (next.pageIndex + 1).toString(),
      limit: next.pageSize.toString(),
    });
  }, [updateUrl, urlState.pagination]);

  const onSortingChange: OnChangeFn<SortingState> = useCallback((updaterOrValue) => {
    const next = typeof updaterOrValue === "function" ? updaterOrValue(urlState.sorting) : updaterOrValue;
    if (next.length > 0) {
      updateUrl({
        sortBy: next[0].id,
        sortOrder: next[0].desc ? "desc" : "asc",
        page: "1", // Reset to first page
      });
    } else {
      updateUrl({
        sortBy: null,
        sortOrder: null,
        page: "1",
      });
    }
  }, [updateUrl, urlState.sorting]);

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback((updaterOrValue) => {
    const next = typeof updaterOrValue === "function" ? updaterOrValue(urlState.columnFilters) : updaterOrValue;
    
    const params = new URLSearchParams(searchParams.toString());
    // Clear old filters (those not in the protected list)
    Array.from(params.keys()).forEach(key => {
        if (!["page", "limit", "sortBy", "sortOrder", "searchTerm"].includes(key)) {
            params.delete(key);
        }
    });

    // Add new filters
    next.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== "") {
          if (Array.isArray(filter.value)) {
              filter.value.forEach(v => params.append(filter.id, String(v)));
          } else {
              params.set(filter.id, String(filter.value));
          }
      }
    });
    
    params.set("page", "1"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname, urlState.columnFilters]);

  const onGlobalFilterChange = useCallback((value: string) => {
    setGlobalFilter(value);
  }, []);

  // Sync debounced search term to URL
  useEffect(() => {
    const currentSearch = searchParams.get("searchTerm") || "";
    if (debouncedSearchTerm !== currentSearch) {
      updateUrl({
        searchTerm: debouncedSearchTerm || null,
        page: "1",
      });
    }
  }, [debouncedSearchTerm, updateUrl, searchParams]);

  const queryParams = useMemo((): IQueryParams => {
    const params: IQueryParams = {
      page: (urlState.pagination.pageIndex + 1).toString(),
      limit: urlState.pagination.pageSize.toString(),
      searchTerm: debouncedSearchTerm || undefined,
    };

    if (urlState.sorting.length > 0) {
      params.sortBy = urlState.sorting[0].id;
      params.sortOrder = urlState.sorting[0].desc ? "desc" : "asc";
    }

    urlState.columnFilters.forEach((filter) => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== "") {
        params[filter.id] = filter.value;
      }
    });

    return params;
  }, [urlState, debouncedSearchTerm]);

  return {
    // TanStack Table State
    state: {
      ...urlState,
      globalFilter,
    },
    // State Updaters
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    // Formatted Query Params for Backend
    queryParams,
    // Raw query string for useQuery
    queryString: searchParams.toString(),
  };
}
