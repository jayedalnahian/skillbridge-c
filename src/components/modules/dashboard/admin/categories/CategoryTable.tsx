"use client";


import { FormField } from "@/components/shared/data-form/data-form";
import { DataTable } from "@/components/shared/data-table/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  CheckCircle2,
  XCircle,
  CalendarIcon,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import z from "zod";
import { columns } from "@/app/(dashboardRoutes)/admin/categories/categoryTableColumns";

const categorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const CategoryDetailsView = ({ item }: { item: ICategory }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {item.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 font-mono italic">
            /{item.slug}
          </p>
        </div>
        <Badge
          variant={item.isDeleted ? "destructive" : "secondary"}
          className="h-6"
        >
          {item.isDeleted ? "Deleted" : "Active"}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* ID Section */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Internal ID
          </Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={item.id}
              className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Description
          </Label>
          <div className="p-4 rounded-xl border bg-slate-50/30 text-sm text-slate-600 whitespace-pre-wrap min-h-[80px] leading-relaxed border-slate-200 shadow-sm">
            {item.description || (
              <span className="italic opacity-50">No description provided</span>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Registration
            </Label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                <span className="font-medium">{createdAt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 opacity-50" />
                <span>{createdAt.time}</span>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Last Update
            </Label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                <span className="font-medium">{updatedAt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 opacity-50" />
                <span>{updatedAt.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();
  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (
      values: z.infer<typeof categorySchema> & { id: string },
    ) => {
      // In a real app, this would be a PATCH/PUT request
      console.log("Simulating API Update for ID:", values.id, values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["categorys"] });
    },
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["categorys", queryString],
    queryFn: () => getAllCategories(queryString),
  });

  const filters = [
    {
      columnId: "isDeleted",
      title: "Status",
      options: [
        { label: "Active", value: "false", icon: CheckCircle2 },
        { label: "Deleted", value: "true", icon: XCircle },
      ],
    },
  ];

  const handleColumnFiltersChange = useCallback(
    (
      updaterOrValue:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState),
    ) => {
      const nextFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue([])
          : updaterOrValue;

      updateParams(
        (params) => {
          const isDeletedFilter = nextFilters.find((f) => f.id === "isDeleted");

          if (isDeletedFilter) {
            // If the filter is an array (from FacetedFilter), take the first one
            const val = Array.isArray(isDeletedFilter.value)
              ? isDeletedFilter.value[0]
              : isDeletedFilter.value;
            params.set("isDeleted", String(val));
          } else {
            params.delete("isDeleted");
          }
        },
        { resetPage: true },
      );
    },
    [updateParams],
  );

  const columnFiltersStateFromUrl = useMemo<ColumnFiltersState>(() => {
    const isDeleted = searchParams.get("isDeleted");
    if (isDeleted) {
      // FacetedFilter expects an array. Always wrap single values from URL in an array.
      return [{ id: "isDeleted", value: [isDeleted] }];
    }
    return [];
  }, [searchParams]);

  const handleDelete = useCallback((ids: string[]) => {
    console.log("Deleting categories with IDs:", ids);
    if (ids.length === 1) {
      alert(`Dummy Individual Delete: Category with ID "${ids[0]}" deleted.`);
    } else {
      alert(`Dummy Bulk Delete: ${ids.length} categories deleted.`);
    }
  }, []);

  return (
    <main className="container mx-auto min-h-screen ">

        <Card className="border-none shadow-2xl overflow-hidden bg-white ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[#00ADB5]">
                  Categories
                </CardTitle>
                <CardDescription className="mt-1">
                  Showing All Categories
                </CardDescription>
              </div>
              {(isLoading || isFetching) && (
                <div className="flex items-center gap-2 text-[#00ADB5] animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-[#00ADB5]" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Syncing Data
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {error ? (
              <div className="p-12 text-center rounded-lg bg-red-50 border border-red-100">
                <p className="text-red-500 font-semibold mb-2">
                  Failed to load data from http://localhost:5050
                </p>
                <p className="text-sm text-red-400">
                  Ensure your backend server is running and the Category API is
                  accessible.
                </p>
              </div>
            ) : (
              <DataTable
                isLoading={isLoading || isFetching || isRouteRefreshPending}
                columns={columns}
                data={data?.data || []}
                meta={data?.meta}
                sorting={{
                  state: optimisticSortingState,
                  onSortingChange: handleSortingChange,
                }}
                pagination={{
                  state: optimisticPaginationState,
                  onPaginationChange: handlePaginationChange,
                }}
                search={{
                  initialValue: searchTermFromUrl,
                  placeholder: "Search categories...",
                  onSearchChange: handleDebouncedSearchChange,
                }}
                columnFilters={{
                  state: columnFiltersStateFromUrl,
                  onColumnFiltersChange: handleColumnFiltersChange,
                }}
                filters={filters}
                onDelete={handleDelete}
                viewConfig={{
                  children: (item) => <CategoryDetailsView item={item} />,
                }}
                editConfig={{
                  schema: categorySchema,
                  mutation: editMutation,
                  children: (form) => (
                    <div className="grid gap-4 py-4">
                      <FormField
                        form={form}
                        name="name"
                        label="Category Name"
                        placeholder="Enter category name"
                      />
                      <FormField
                        form={form}
                        name="slug"
                        label="Slug"
                        placeholder="Enter slug"
                      />
                      <FormField
                        form={form}
                        name="description"
                        label="Description"
                        render={(field) => (
                          <Textarea
                            id={field.name}
                            placeholder="Optional description"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={
                              field.state.meta.errors.length
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            }
                          />
                        )}
                      />
                    </div>
                  ),
                }}
              />
            )}
          </CardContent>
        </Card>
    </main>
  );
};

export default CategoryTable;
