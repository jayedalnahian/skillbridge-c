"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UpdateParamsFn } from "./useServerManagedDataTable";
import { ReadonlyURLSearchParams } from "next/navigation";

const DEBOUNCE_MS = 400;

interface UseServerManagedDataTableSearchParams {
  searchParams: ReadonlyURLSearchParams;
  updateParams: UpdateParamsFn;
  queryKey?: string;
}

export const useServerManagedDataTableSearch = ({
  searchParams,
  updateParams,
  queryKey = "searchTerm",
}: UseServerManagedDataTableSearchParams) => {
  const searchTermFromUrl = useMemo(() => {
    return searchParams.get(queryKey) ?? "";
  }, [queryKey, searchParams]);

  // Local state for immediate input feedback
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTermFromUrl);

  // Sync with URL changes (e.g., back/forward navigation, Reset button)
  useEffect(() => {
    setPendingSearchTerm(searchTermFromUrl);
  }, [searchTermFromUrl]);

  // Debounced effect to update URL
  useEffect(() => {
    const normalizedSearchTerm = pendingSearchTerm.trim();
    const currentSearchTerm = searchParams.get(queryKey) ?? "";

    // Skip if value hasn't changed from URL
    if (normalizedSearchTerm === currentSearchTerm) {
      return;
    }

    const timer = setTimeout(() => {
      updateParams((params) => {
        if (normalizedSearchTerm) {
          params.set(queryKey, normalizedSearchTerm);
          return;
        }

        params.delete(queryKey);
      }, { resetPage: true });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [pendingSearchTerm, queryKey, searchParams, updateParams]);

  const handleDebouncedSearchChange = useCallback((searchTerm: string) => {
    setPendingSearchTerm(searchTerm);
  }, []);

  // Allow immediate search on Enter/blur if needed
  const handleImmediateSearch = useCallback(() => {
    const normalizedSearchTerm = pendingSearchTerm.trim();
    const currentSearchTerm = searchParams.get(queryKey) ?? "";

    if (normalizedSearchTerm !== currentSearchTerm) {
      updateParams((params) => {
        if (normalizedSearchTerm) {
          params.set(queryKey, normalizedSearchTerm);
          return;
        }
        params.delete(queryKey);
      }, { resetPage: true });
    }
  }, [pendingSearchTerm, queryKey, searchParams, updateParams]);

  return {
    searchTermFromUrl: pendingSearchTerm, // Return pending for immediate UI feedback
    handleDebouncedSearchChange,
    handleImmediateSearch,
  };
};
