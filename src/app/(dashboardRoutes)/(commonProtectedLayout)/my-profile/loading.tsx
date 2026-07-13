import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Info row skeleton component
const InfoRowSkeleton = ({ isLast = false }: { isLast?: boolean }) => (
  <div className={`flex items-start gap-3 py-3 px-1 ${!isLast ? "border-b border-border/50" : ""}`}>
    <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export default function MyProfileLoading() {
  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Decorative background blobs */}
      <div className="fixed top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl animate-float-medium pointer-events-none" />

      <div className="relative z-10">
        {/* Page Header Skeleton */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Profile Header Card Skeleton */}
        <Card className="mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar Skeleton */}
              <Skeleton className="h-24 w-24 rounded-full shrink-0" />

              {/* Name & Badges Skeleton */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Info Card Skeleton */}
          <Card className="h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-56 mt-1" />
            </CardHeader>
            <CardContent className="pt-0">
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton isLast />
            </CardContent>
          </Card>

          {/* Role-Specific Card Skeleton */}
          <Card className="h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-56 mt-1" />
            </CardHeader>
            <CardContent className="pt-0">
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton />
              <InfoRowSkeleton isLast />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
