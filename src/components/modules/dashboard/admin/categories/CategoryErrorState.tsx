"use client";

import { CategoryErrorStateProps } from "./categoryTypes";



export function CategoryErrorState({
  message = "Failed to load data from the backend server",
}: CategoryErrorStateProps) {
  return (
    <div className="p-12 text-center rounded-lg bg-red-50 border border-red-100">
      <p className="text-red-500 font-semibold mb-2">{message}</p>
      <p className="text-sm text-red-400">
        Ensure your backend server is running and the Category API is accessible.
      </p>
    </div>
  );
}
