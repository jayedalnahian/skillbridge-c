"use client";

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateStudent,
  softDeleteStudent,
  bulkSoftDeleteStudents,
  hardDeleteStudent,
  restoreStudent,
} from "@/services/student.service";
import { QUERY_KEYS } from "@/lib/constants";
import { IStudentUpdatePayload } from "@/types/user.types";

export interface UseStudentMutationsReturn {
  editMutation: UseMutationResult<any, Error, IStudentUpdatePayload & { id: string }, unknown>;
  softDeleteMutation: UseMutationResult<any, Error, string, unknown>;
  bulkSoftDeleteMutation: UseMutationResult<unknown, Error, string[], unknown>;
  permanentDeleteMutation: UseMutationResult<any, Error, string, unknown>;
  restoreMutation: UseMutationResult<any, Error, string, unknown>;
}

export function useStudentMutations(): UseStudentMutationsReturn {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (values: IStudentUpdatePayload & { id: string }) => {
      const { id, ...data } = values;
      const result = await updateStudent(id, data);
      if (!result.success) {
        throw new Error(result.message || "Failed to update student");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Student updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update student";
      toast.error(message);
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await softDeleteStudent(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete student");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete student";
      toast.error(message);
    },
  });

  const bulkSoftDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const result = await bulkSoftDeleteStudents(ids);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete students");
      }
      return result.data;
    },
    onSuccess: (_, ids) => {
      toast.success(`Successfully deleted ${ids.length} student${ids.length === 1 ? "" : "s"}`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete students";
      toast.error(message);
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await hardDeleteStudent(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to permanently delete student");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Student permanently deleted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to permanently delete student";
      toast.error(message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await restoreStudent(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to restore student");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Student restored successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to restore student";
      toast.error(message);
    },
  });

  return {
    editMutation,
    softDeleteMutation,
    bulkSoftDeleteMutation,
    permanentDeleteMutation,
    restoreMutation,
  };
}
