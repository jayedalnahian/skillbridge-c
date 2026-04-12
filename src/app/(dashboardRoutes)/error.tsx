"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center rounded-3xl bg-card/50 p-8 text-center backdrop-blur-sm border border-border/60">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ADB5]/10 shadow-inner">
        <AlertTriangle className="h-8 w-8 text-[#00ADB5]" />
      </div>

      <h2 className="mb-2 text-2xl font-bold">Dashboard Error</h2>
      <p className="mb-8 max-w-sm text-muted-foreground">
        We encountered an error while loading this dashboard section. You can try refreshing the data or returning to your overview.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="rounded-xl bg-[#00ADB5] px-6 text-[#EEEEEE] hover:bg-[#00ADB5]/90"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry Section
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-border hover:bg-accent/50"
        >
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Overview
          </Link>
        </Button>
      </div>

      {/* Technical details hidden in plain sight */}
      <div className="mt-12 text-[10px] uppercase tracking-widest text-muted-foreground/30">
        Reference ID: {error.digest || "APP_INT_ERR"}
      </div>
    </div>
  );
}
