"use client";

import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ReadonlyURLSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

// Stable empty array reference to prevent infinite loops
const EMPTY_FILTERS_CONFIG: FilterConfig[] = [];

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export interface UpdateParamsOptions {
  resetPage?: boolean;
}

export type UpdateParamsFn = (
  updater: (params: URLSearchParams) => void,
  options?: UpdateParamsOptions,
) => void;

const parsePositiveInteger = (
  value: string | null,
  fallbackValue: number,
): number => {
  if (!value) {
    return fallbackValue;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallbackValue;
  }

  return parsed;
};

interface UseDataExplorerStateParams {
  searchParams: ReadonlyURLSearchParams;
  sortOptions: SortOption[];
  defaultPage?: number;
  defaultLimit?: number;
  filtersConfig?: FilterConfig[];
}

export interface SortingState {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export const useDataExplorerState = ({
  searchParams,
  sortOptions,
  defaultPage = 1,
  defaultLimit = 10,
  filtersConfig: filtersConfigProp,
}: UseDataExplorerStateParams) => {
  // Use stable reference for undefined filtersConfig
  const filtersConfig = filtersConfigProp ?? EMPTY_FILTERS_CONFIG;
  const router = useRouter();
  const pathname = usePathname();
  const [isUrlUpdating, setIsUrlUpdating] = useState(false);

  const queryStringFromUrl = useMemo(() => searchParams.toString(), [searchParams]);

  // Parse pagination from URL
  const paginationStateFromUrl = useMemo<PaginationState>(() => {
    const page = parsePositiveInteger(searchParams.get("page"), defaultPage);
    const limit = parsePositiveInteger(searchParams.get("limit"), defaultLimit);

    return {
      pageIndex: page - 1,
      pageSize: limit,
    };
  }, [defaultLimit, defaultPage, searchParams]);

  // Parse sort from URL
  const sortStateFromUrl = useMemo<SortingState | null>(() => {
    const sort = searchParams.get("sort");
    if (!sort) return null;

    const option = sortOptions.find((opt) => opt.value === sort);
    if (!option) return null;

    // Parse sort value (e.g., "price_asc" -> { sortBy: "price", sortOrder: "asc" })
    const parts = sort.split("_");
    if (parts.length >= 2) {
      const sortOrder = parts[parts.length - 1] as "asc" | "desc";
      if (sortOrder === "asc" || sortOrder === "desc") {
        const sortBy = parts.slice(0, -1).join("_");
        return { sortBy, sortOrder };
      }
    }
    return null;
  }, [searchParams, sortOptions]);

  // Parse filters from URL
  const filterStateFromUrl = useMemo<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    
    filtersConfig.forEach((config) => {
      const value = searchParams.get(config.key);
      if (value) {
        filters[config.key] = value.split(",");
      }
    });
    
    return filters;
  }, [searchParams, filtersConfig]);

  // Parse search from URL
  const searchTermFromUrl = useMemo(() => {
    return searchParams.get("searchTerm") ?? "";
  }, [searchParams]);

  // Optimistic states for immediate UI feedback
  const [optimisticPaginationState, setOptimisticPaginationState] = useState<PaginationState>(paginationStateFromUrl);
  const [optimisticSortState, setOptimisticSortState] = useState<SortingState | null>(sortStateFromUrl);
  const [optimisticFilterState, setOptimisticFilterState] = useState<Record<string, string[]>>(filterStateFromUrl);
  const [optimisticSearchTerm, setOptimisticSearchTerm] = useState(searchTermFromUrl);

  // Sync optimistic states with URL changes
  useEffect(() => {
    setOptimisticPaginationState(paginationStateFromUrl);
  }, [paginationStateFromUrl]);

  useEffect(() => {
    setOptimisticSortState(sortStateFromUrl);
  }, [sortStateFromUrl]);

  useEffect(() => {
    setOptimisticFilterState(filterStateFromUrl);
  }, [filterStateFromUrl]);

  useEffect(() => {
    setOptimisticSearchTerm(searchTermFromUrl);
  }, [searchTermFromUrl]);

  // Reset URL updating flag when searchParams change
  useEffect(() => {
    setIsUrlUpdating(false);
  }, [searchParams]);

  const updateUrlOnly = useCallback((params: URLSearchParams) => {
    const nextQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");

    if (nextQuery === currentQuery) {
      return;
    }

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    setIsUrlUpdating(true);
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router]);

  const updateParams = useCallback<UpdateParamsFn>(
    (updater: (params: URLSearchParams) => void, options?: UpdateParamsOptions) => {
      const params = new URLSearchParams(window.location.search);

      updater(params);

      if (options?.resetPage) {
        params.set("page", "1");
        setOptimisticPaginationState((prevState) => ({
          pageIndex: 0,
          pageSize: prevState.pageSize,
        }));
      }

      updateUrlOnly(params);
    },
    [updateUrlOnly],
  );

  // Pagination change handler
  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updaterOrValue) => {
      const nextState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(optimisticPaginationState)
          : updaterOrValue;
      setOptimisticPaginationState(nextState);

      updateParams((params) => {
        params.set("page", String(nextState.pageIndex + 1));
        params.set("limit", String(nextState.pageSize));
      });
    },
    [optimisticPaginationState, updateParams],
  );

  // Sort change handler
  const handleSortChange = useCallback(
    (sortValue: string) => {
      updateParams(
        (params) => {
          if (sortValue) {
            params.set("sort", sortValue);
          } else {
            params.delete("sort");
          }
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  // Filter change handler
  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      setOptimisticFilterState((prev) => ({ ...prev, [key]: values }));

      updateParams(
        (params) => {
          if (values.length > 0) {
            params.set(key, values.join(","));
          } else {
            params.delete(key);
          }
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  // Search change handler (debounced)
  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setOptimisticSearchTerm(searchTerm);

      const normalizedSearchTerm = searchTerm.trim();
      const currentSearchTerm = searchParams.get("searchTerm") ?? "";

      if (normalizedSearchTerm === currentSearchTerm) {
        return;
      }

      updateParams(
        (params) => {
          if (normalizedSearchTerm) {
            params.set("searchTerm", normalizedSearchTerm);
          } else {
            params.delete("searchTerm");
          }
        },
        { resetPage: true },
      );
    },
    [searchParams, updateParams],
  );

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setOptimisticFilterState({});
    setOptimisticSearchTerm("");
    setOptimisticSortState(null);

    updateParams(
      (params) => {
        // Remove all filter keys
        filtersConfig.forEach((config) => {
          params.delete(config.key);
        });
        params.delete("searchTerm");
        params.delete("sort");
        params.set("page", "1");
      },
      { resetPage: true },
    );
  }, [filtersConfig, updateParams]);

  return {
    queryStringFromUrl,
    optimisticPaginationState,
    optimisticSortState,
    optimisticFilterState,
    optimisticSearchTerm,
    isRouteRefreshPending: isUrlUpdating,
    updateParams,
    handlePaginationChange,
    handleSortChange,
    handleFilterChange,
    handleSearchChange,
    handleResetFilters,
  };
};
