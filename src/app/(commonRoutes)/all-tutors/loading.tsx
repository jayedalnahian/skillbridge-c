import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 8;

export default function AllTutorsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ============ Sidebar Filters ============ */}
        <aside className="w-full lg:w-64 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
          <div className="border border-border rounded-xl shadow-sm">
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-14 rounded-md" />
              </div>
            </div>
            <div className="p-4 pt-0">
              <div className="space-y-6">
                {/* Experience Years */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Hourly Rate */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-5" />
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Education Level */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <div className="space-y-2">
                    {["High School", "Bachelor", "Master", "PhD"].map((label) => (
                      <div key={label} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Available Days */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <div className="grid grid-cols-2 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-14" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Subject Categories */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ============ Main Content ============ */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Sticky Toolbar */}
          <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-2 -mx-2 px-2">
            <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search bar */}
                <div className="relative sm:w-[61.8%]">
                  <Skeleton className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Skeleton className="h-8 w-full pl-9 rounded-md" />
                </div>
                {/* Sort + Actions */}
                <div className="flex gap-2 sm:w-[38.2%]">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Tutor Card Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <Skeleton className="h-4 w-56" />
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-[70px] rounded-md" />
              </div>
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TutorCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-sm">
      {/* Header — h-48 with gradient background + avatar + badge */}
      <div className="relative h-48 w-full bg-gradient-to-br from-muted to-muted/50">
        <Skeleton className="absolute right-3 top-3 h-5 w-20 rounded-full" />
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Name & Designation */}
          <div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>

          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-2">
            {["education", "experience", "rate", "days"].map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>

          {/* CTA Button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
