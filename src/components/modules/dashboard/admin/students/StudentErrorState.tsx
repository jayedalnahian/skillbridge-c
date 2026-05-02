"use client";

interface StudentErrorStateProps {
  message?: string;
}

export function StudentErrorState({
  message = "Failed to load data from the backend server",
}: StudentErrorStateProps) {
  return (
    <div className="p-12 text-center rounded-lg bg-red-50 border border-red-100">
      <p className="text-red-500 font-semibold mb-2">{message}</p>
      <p className="text-sm text-red-400">
        Ensure your backend server is running and the Student API is accessible.
      </p>
    </div>
  );
}
