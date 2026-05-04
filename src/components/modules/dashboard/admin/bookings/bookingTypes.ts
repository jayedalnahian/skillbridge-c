import { UseMutationResult } from "@tanstack/react-query";
import { IBooking, IBookingCreateInput, ICancelBookingInput } from "@/types/booking.types";

export interface BookingTableProps {
  initialQueryString: string;
}

export interface BookingErrorStateProps {
  message?: string;
}

export interface BookingDetailsViewProps {
  item: IBooking;
}

export interface UseBookingMutationsReturn {
  createMutation: UseMutationResult<unknown, Error, { tutorId: string; payload: IBookingCreateInput }>;
  cancelMutation: UseMutationResult<unknown, Error, { id: string; payload: ICancelBookingInput }>;
  completeMutation: UseMutationResult<unknown, Error, string>;
  hardDeleteMutation: UseMutationResult<unknown, Error, string>;
}
