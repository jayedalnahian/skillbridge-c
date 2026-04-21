"use client";

import { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { ReadonlyURLSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseServerManagedDataTableParams {
  searchParams: ReadonlyURLSearchParams;
  defaultPage?: number;
  defaultLimit?: number;
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

export const useServerManagedDataTable = ({
  searchParams,
  defaultPage = 1,
  defaultLimit = 10,
}: UseServerManagedDataTableParams) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isUrlUpdating, setIsUrlUpdating] = useState(false);

  const queryStringFromUrl = useMemo(() => searchParams.toString(), [searchParams]);

  const paginationStateFromUrl = useMemo<PaginationState>(() => {
    const page = parsePositiveInteger(searchParams.get("page"), defaultPage);
    const limit = parsePositiveInteger(searchParams.get("limit"), defaultLimit);

    return {
      pageIndex: page - 1,
      pageSize: limit,
    };
  }, [defaultLimit, defaultPage, searchParams]);

  const sortingStateFromUrl = useMemo<SortingState>(() => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (!sortBy || (sortOrder !== "asc" && sortOrder !== "desc")) {
      return [];
    }

    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [searchParams]);

  const [optimisticSortingState, setOptimisticSortingState] = useState<SortingState>(sortingStateFromUrl);
  const [optimisticPaginationState, setOptimisticPaginationState] = useState<PaginationState>(paginationStateFromUrl);

  useEffect(() => {
    setOptimisticSortingState(sortingStateFromUrl);
  }, [sortingStateFromUrl]);

  useEffect(() => {
    setOptimisticPaginationState(paginationStateFromUrl);
  }, [paginationStateFromUrl]);

  // Reset URL updating flag when searchParams change (navigation completed)
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

    // Client-only URL update - no server component refresh
    // This updates the URL for shareability and back/forward navigation
    // while keeping the data fetch client-side via React Query
    setIsUrlUpdating(true);
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router]);

  const updateParams = useCallback<UpdateParamsFn>((
    updater: (params: URLSearchParams) => void,
    options?: UpdateParamsOptions,
  ) => {
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
  }, [updateUrlOnly]);

  const handleSortingChange: OnChangeFn<SortingState> = useCallback((updaterOrValue) => {
    const nextState = typeof updaterOrValue === "function" ? updaterOrValue(optimisticSortingState) : updaterOrValue;
    setOptimisticSortingState(nextState);

    updateParams((params) => {
      const nextSorting = nextState[0];

      if (nextSorting) {
        params.set("sortBy", nextSorting.id);
        params.set("sortOrder", nextSorting.desc ? "desc" : "asc");
        return;
      }

      params.delete("sortBy");
      params.delete("sortOrder");
    }, { resetPage: true });
  }, [optimisticSortingState, updateParams]);

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback((updaterOrValue) => {
    const nextState = typeof updaterOrValue === "function" ? updaterOrValue(optimisticPaginationState) : updaterOrValue;
    setOptimisticPaginationState(nextState);

    updateParams((params) => {
      params.set("page", String(nextState.pageIndex + 1));
      params.set("limit", String(nextState.pageSize));
    });
  }, [optimisticPaginationState, updateParams]);

  return {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending: isUrlUpdating,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  };
};
