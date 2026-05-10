"use client";

import { DataErrorState } from "@/components/shared/DataErrorState";

interface ReviewErrorStateProps {
  message?: string;
}

export function ReviewErrorState({
  message = "Failed to load reviews from the backend server",
}: ReviewErrorStateProps) {
  return <DataErrorState message={message} moduleName="Review" />;
}
