"use client";

import { DataErrorState } from "@/components/shared/DataErrorState";

interface StudentErrorStateProps {
  message?: string;
}

export function StudentErrorState({
  message = "Failed to load data from the backend server",
}: StudentErrorStateProps) {
  return <DataErrorState message={message} moduleName="Student" />;
}
