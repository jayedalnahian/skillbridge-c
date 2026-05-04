"use client";

import { DataErrorState } from "@/components/shared/DataErrorState";

interface AdminErrorStateProps {
  message?: string;
}

export function AdminErrorState({
  message = "Failed to load data from the backend server",
}: AdminErrorStateProps) {
  return <DataErrorState message={message} moduleName="Admin" />;
}
