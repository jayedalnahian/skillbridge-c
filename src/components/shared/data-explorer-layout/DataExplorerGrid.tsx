"use client";

import { cn } from "@/lib/utils";

interface GridCols {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface DataExplorerGridProps<TData> {
  data: TData[];
  renderCard: (item: TData) => React.ReactNode;
  gridCols?: GridCols;
  isLoading?: boolean;
  emptyMessage?: string;
}

const defaultGridCols: GridCols = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

// Static class maps for Tailwind safety
const gridColsClassMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const mdGridColsClassMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const lgGridColsClassMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const xlGridColsClassMap: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};

function getGridClasses(cols: GridCols): string {
  return cn(
    "grid gap-4",
    gridColsClassMap[cols.sm] ?? "grid-cols-1",
    mdGridColsClassMap[cols.md] ?? "md:grid-cols-2",
    lgGridColsClassMap[cols.lg] ?? "lg:grid-cols-3",
    xlGridColsClassMap[cols.xl] ?? "xl:grid-cols-4",
  );
}

export function DataExplorerGrid<TData>({
  data,
  renderCard,
  gridCols = defaultGridCols,
  isLoading,
  emptyMessage = "No results found.",
}: DataExplorerGridProps<TData>) {
  const gridClasses = getGridClasses(gridCols);

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {data.map((item, index) => (
        <div key={index}>{renderCard(item)}</div>
      ))}
    </div>
  );
}
