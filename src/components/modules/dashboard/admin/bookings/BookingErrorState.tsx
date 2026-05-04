"use client";

import { DataErrorState } from "@/components/shared/DataErrorState";
import { BookingErrorStateProps } from "./bookingTypes";

export function BookingErrorState({
  message = "Failed to load data from the backend server",
}: BookingErrorStateProps) {
  return <DataErrorState message={message} moduleName="Booking" />;
}
