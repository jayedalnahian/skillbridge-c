"use client";

import { QUERY_KEYS } from "@/lib/constants";
import { createAdmin, updateAdmin, hardDeleteAdmin } from "@/services/admin.service";
import { IAdminCreatePayload, IAdminUpdatePayload } from "@/types/admin.types";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UseAdminMutationsReturn {
    editMutation: UseMutationResult<any, Error, IAdminUpdatePayload & { id: string }, unknown>;
    createMutation: UseMutationResult<any, Error, IAdminCreatePayload, unknown>;
    permanentDeleteMutation: UseMutationResult<any, Error, string, unknown>;
}

export function useAdminMutations(): UseAdminMutationsReturn {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (values: IAdminCreatePayload) => {
            const result = await createAdmin(values);
            if (!result.success) {
                throw new Error(result.message || "Failed to create admin");
            }
            return result.data;
        },
        onSuccess: () => {
            toast.success("Admin created successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Failed to create admin";
            toast.error(message);
        },
    });

    const editMutation = useMutation({
        mutationFn: async (values: IAdminUpdatePayload & { id: string }) => {
            const { id, ...data } = values;
            const result = await updateAdmin(id, data);
            if (!result.success) {
                throw new Error(result.message || "Failed to update admin");
            }
            return result.data;
        },
        onSuccess: () => {
            toast.success("Admin updated successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Failed to update admin";
            toast.error(message);
        },
    });

    const permanentDeleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const result = await hardDeleteAdmin(id);
            if (!result.success) {
                throw new Error(result.message || "Failed to permanently delete admin");
            }
            return result.data;
        },
        onSuccess: () => {
            toast.success("Admin permanently deleted");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Failed to permanently delete admin";
            toast.error(message);
        },
    });

    return {
        createMutation,
        editMutation,
        permanentDeleteMutation,
    };
}