"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  hardDeleteBooking,
  changeBookingStatus,
} from "@/services/booking.service";
import { QUERY_KEYS } from "@/lib/constants";
import { IBookingCreateInput, IChangeBookingStatusInput } from "@/types/booking.types";

interface CreateBookingMutationInput {
  tutorId: string;
  payload: IBookingCreateInput;
}

interface ChangeBookingStatusMutationInput {
  id: string;
  payload: IChangeBookingStatusInput;
}

export interface UseBookingMutationsReturn {
  createMutation: ReturnType<typeof useMutation<unknown, Error, CreateBookingMutationInput>>;
  changeStatusMutation: ReturnType<typeof useMutation<unknown, Error, ChangeBookingStatusMutationInput>>;
  hardDeleteMutation: ReturnType<typeof useMutation<unknown, Error, string>>;
}

export function useBookingMutations(): UseBookingMutationsReturn {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ tutorId, payload }: CreateBookingMutationInput) => {
      const result = await createBooking(tutorId, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to create booking");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Booking created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create booking";
      toast.error(message);
    },
  });
  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, payload }: ChangeBookingStatusMutationInput) => {
      const result = await changeBookingStatus(id, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to change booking status");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Booking status updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to change booking status";
      toast.error(message);
    },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await hardDeleteBooking(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete booking");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete booking";
      toast.error(message);
    },
  });

  return {
    createMutation,
    changeStatusMutation,
    hardDeleteMutation,
  };
}
