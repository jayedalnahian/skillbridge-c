"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  cancelBooking,
  completeBooking,
  hardDeleteBooking,
} from "@/services/booking.service";
import { QUERY_KEYS } from "@/lib/constants";
import { IBookingCreateInput, ICancelBookingInput } from "@/types/booking.types";

interface CreateBookingMutationInput {
  tutorId: string;
  payload: IBookingCreateInput;
}

interface CancelBookingMutationInput {
  id: string;
  payload: ICancelBookingInput;
}

export interface UseBookingMutationsReturn {
  createMutation: ReturnType<typeof useMutation<unknown, Error, CreateBookingMutationInput>>;
  cancelMutation: ReturnType<typeof useMutation<unknown, Error, CancelBookingMutationInput>>;
  completeMutation: ReturnType<typeof useMutation<unknown, Error, string>>;
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

  const cancelMutation = useMutation({
    mutationFn: async ({ id, payload }: CancelBookingMutationInput) => {
      const result = await cancelBooking(id, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to cancel booking");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to cancel booking";
      toast.error(message);
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await completeBooking(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to complete booking");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Booking completed successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to complete booking";
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
    cancelMutation,
    completeMutation,
    hardDeleteMutation,
  };
}
