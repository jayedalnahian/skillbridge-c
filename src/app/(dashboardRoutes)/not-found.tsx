import { Button } from "@/components/ui/button";
import { Search, LayoutDashboard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center rounded-3xl bg-card/50 p-8 text-center backdrop-blur-sm border border-border/60">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ADB5]/10 shadow-inner">
        <Search className="h-8 w-8 text-[#00ADB5]" />
      </div>

      <h2 className="mb-2 text-2xl font-bold">Content Not Found</h2>
      <p className="mb-8 max-w-sm text-muted-foreground">
        The specific dashboard section or record you are looking for doesn't seem to exist. Please verify the link and try again.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          asChild
          className="rounded-xl bg-[#00ADB5] px-6 text-[#EEEEEE] hover:bg-[#00ADB5]/90"
        >
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-border hover:bg-accent/50"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
