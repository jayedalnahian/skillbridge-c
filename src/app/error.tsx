"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#222831] px-6 text-center">
      {/* Error Icon */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 shadow-2xl shadow-destructive/5 animate-in fade-in zoom-in duration-500">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>

      {/* Hero Text */}
      <h1 className="mb-4 text-4xl font-bold text-[#EEEEEE]">
        Something went wrong
      </h1>
      <p className="mb-6 max-w-md text-lg text-[#EEEEEE]/60">
        An unexpected error occurred. Our team has been notified and we're working to fix it.
      </p>

      {/* Error Details (Optional/Debug) */}
      <div className="mb-10 rounded-xl bg-[#393E46]/50 p-4 font-mono text-xs text-destructive/80">
        Error ID: {error.digest || "Unknown"}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button
          onClick={reset}
          className="h-12 rounded-xl bg-[#00ADB5] px-8 text-base font-semibold text-[#EEEEEE] hover:bg-[#00ADB5]/90"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-xl border-[#393E46] bg-transparent px-8 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] hover:text-[#EEEEEE]"
        >
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
