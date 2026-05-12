"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  hardDeleteBooking,
  changeBookingStatus,
  confirmBooking,
} from "@/services/booking.service";
import { QUERY_KEYS } from "@/lib/constants";
import { IBooking, IBookingCreateInput, IChangeBookingStatusInput } from "@/types/booking.types";

interface CreateBookingMutationInput {
  tutorId: string;
  payload: IBookingCreateInput;
}

interface ChangeBookingStatusMutationInput {
  id: string;
  payload: IChangeBookingStatusInput;
}

export interface UseBookingMutationsReturn {
  createMutation: ReturnType<typeof useMutation<IBooking, Error, CreateBookingMutationInput>>;
  changeStatusMutation: ReturnType<typeof useMutation<IBooking, Error, ChangeBookingStatusMutationInput>>;
  hardDeleteMutation: ReturnType<typeof useMutation<IBooking, Error, string>>;
  confirmMutation: ReturnType<typeof useMutation<IBooking, Error, { id: string, payload: { meetingLink: string } }>>;
}

export function useBookingMutations(): UseBookingMutationsReturn {
  const queryClient = useQueryClient();

  const createMutation = useMutation<IBooking, Error, CreateBookingMutationInput>({
    mutationFn: async ({ tutorId, payload }: CreateBookingMutationInput) => {
      const result = await createBooking(tutorId, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to create booking");
      }
      return result.data as IBooking;
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
  const changeStatusMutation = useMutation<
    IBooking,
    Error,
    ChangeBookingStatusMutationInput
  >({
    mutationFn: async ({ id, payload }: ChangeBookingStatusMutationInput) => {
      const result = await changeBookingStatus(id, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to change booking status");
      }
      return result.data as IBooking;
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

  const hardDeleteMutation = useMutation<IBooking, Error, string>({
    mutationFn: async (id: string) => {
      const result = await hardDeleteBooking(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete booking");
      }
      return result.data as IBooking;
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

  const confirmMutation = useMutation<
    IBooking,
    Error,
    { id: string; payload: { meetingLink: string } }
  >({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: { meetingLink: string };
    }) => {
      const result = await confirmBooking(id, payload);
      if (!result.success) {
        throw new Error(result.message || "Failed to confirm booking");
      }
      return result.data as IBooking;
    },
    onSuccess: () => {
      toast.success("Booking confirmed successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to confirm booking";
      toast.error(message);
    },
  });

  return {
    createMutation,
    changeStatusMutation,
    hardDeleteMutation,
    confirmMutation,
  };
}
