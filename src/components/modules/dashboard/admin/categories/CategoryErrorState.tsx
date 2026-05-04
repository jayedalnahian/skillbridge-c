"use client";

import { DataErrorState } from "@/components/shared/DataErrorState";
import { CategoryErrorStateProps } from "./categoryTypes";

export function CategoryErrorState({
  message = "Failed to load data from the backend server",
}: CategoryErrorStateProps) {
  return <DataErrorState message={message} moduleName="Category" />;
}
