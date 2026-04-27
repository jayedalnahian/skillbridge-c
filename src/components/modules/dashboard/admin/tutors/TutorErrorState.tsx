"use client";

interface TutorErrorStateProps {
  message?: string;
}

export function TutorErrorState({
  message = "Failed to load data from the backend server",
}: TutorErrorStateProps) {
  return (
    <div className="p-12 text-center rounded-lg bg-red-50 border border-red-100">
      <p className="text-red-500 font-semibold mb-2">{message}</p>
      <p className="text-sm text-red-400">
        Ensure your backend server is running and the Tutor API is accessible.
      </p>
    </div>
  );
}
