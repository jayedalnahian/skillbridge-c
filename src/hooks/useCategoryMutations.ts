"use client";

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory, bulkDeleteCategories, deleteCategory } from "@/services/category.service";
import { QUERY_KEYS } from "@/lib/constants";
import { CategoryEditInput, CreateCategoryInput, UseCategoryMutationsReturn } from "../components/modules/dashboard/admin/categories/categoryTypes";









export function useCategoryMutations(): UseCategoryMutationsReturn {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (values: CategoryEditInput & { id: string }) => {
      // In a real app, this would be a PATCH/PUT request
      console.log("Simulating API Update for ID:", values.id, values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateCategoryInput) => {
      const result = await createCategory(values);
      if (!result.success) {
        throw new Error(result.message || "Failed to create category");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await bulkDeleteCategories(ids);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete categories");
      }
      return result.data as {
        deleted?: string[];
        inUse?: string[];
        notFound?: string[];
        errors?: { id: string; message: string }[];
      };
    },
    onSuccess: (data) => {
      const deletedCount = data?.deleted?.length ?? 0;
      const inUseCount = data?.inUse?.length ?? 0;
      const notFoundCount = data?.notFound?.length ?? 0;

      if (deletedCount > 0) {
        toast.success(
          `Successfully deleted ${deletedCount} categor${deletedCount === 1 ? "y" : "ies"}`
        );
      }
      if (inUseCount > 0) {
        toast.error(
          `${inUseCount} categor${inUseCount === 1 ? "y" : "ies"} cannot be deleted because ${inUseCount === 1 ? "it is" : "they are"} in use by tutor(s)`
        );
      }
      if (notFoundCount > 0) {
        toast.error(
          `${notFoundCount} categor${notFoundCount === 1 ? "y was" : "ies were"} not found`
        );
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete categories";
      toast.error(message);
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategory(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to permanently delete category");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to permanently delete category";
      toast.error(message);
    },
  });

  return {
    editMutation,
    createMutation,
    deleteMutation,
    permanentDeleteMutation
  };
}
