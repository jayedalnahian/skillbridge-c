"use client";

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTutor, bulkSoftDeleteTutors, restoreTutor, updateTutor, hardDeleteTutor } from "@/services/tutor.service";
import { QUERY_KEYS } from "@/lib/constants";
import { ITutorCreateInput, ITutorUpdateInput } from "@/types/tutor.types";

export interface UseTutorMutationsReturn {
  editMutation: UseMutationResult<any, Error, ITutorUpdateInput & { id: string }, unknown>;
  createMutation: UseMutationResult<any, Error, ITutorCreateInput, unknown>;
  bulkSoftDeleteTutorsMutation: UseMutationResult<unknown, Error, string[], unknown>;
  permanentDeleteMutation: UseMutationResult<any, Error, string, unknown>;
  restoreMutation: UseMutationResult<any, Error, string, unknown>;
}

export function useTutorMutations(): UseTutorMutationsReturn {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (values: ITutorUpdateInput & { id: string }) => {
      const { id, ...data } = values;
      const result = await updateTutor(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update tutor");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Tutor updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TUTORS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update tutor";
      toast.error(message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: ITutorCreateInput) => {
      const result = await createTutor(values);
      if (!result.success) {
        throw new Error(result.message || "Failed to create tutor");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Tutor created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TUTORS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create tutor";
      toast.error(message);
    },
  });

  const bulkSoftDeleteTutorsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await bulkSoftDeleteTutors(ids);
          if (!result.success) {
        throw new Error(result.message || "Failed to delete tutor(s)");
          }
      return result.data;
    },
    onSuccess: (_, ids) => {
      toast.success(`Successfully deleted ${ids.length} tutor${ids.length === 1 ? "" : "s"}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TUTORS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete tutor(s)";
      toast.error(message);
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await hardDeleteTutor(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to permanently delete tutor");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Tutor permanently deleted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TUTORS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to permanently delete tutor";
      toast.error(message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await restoreTutor(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to restore tutor");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Tutor restored successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TUTORS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to restore tutor";
      toast.error(message);
    },
  });

  return {
    editMutation,
    createMutation,
    bulkSoftDeleteTutorsMutation,
    permanentDeleteMutation,
    restoreMutation,
  };
}
