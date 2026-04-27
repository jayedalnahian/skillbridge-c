"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  // Hook State & Dispatchers
  sorting: {
    state: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
  };
  pagination: {
    state: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
  };
  search: {
    initialValue: string;
    placeholder?: string;
    onSearchChange: (value: string) => void;
  };
  columnFilters?: {
    state: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  };
  isLoading?: boolean;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  editConfig?: {
    schema: z.ZodType<any>;
    mutation: UseMutationResult<any, any, any>;
    children: (form: any) => React.ReactNode;
    onSuccess?: (data: any) => void;
    submitLabel?: string;
  };
  viewConfig?: {
    children: (form: any) => React.ReactNode;
  };
  onPermanentDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onSoftDelete?: (ids: string[]) => void;
  onCreate?: () => void;
  createButtonLabel?: string;
  queryKey?: string[];
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  meta,
  sorting,
  pagination,
  search,
  columnFilters,
  isLoading,
  filters,
  editConfig,
  viewConfig,
  onSoftDelete,
  onPermanentDelete,
  onRestore,
  onCreate,
  createButtonLabel,
  queryKey,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const finalColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              (table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")) as any
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, TValue>,
      ...columns,
    ],
    [columns],
  );

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      pagination: pagination.state,
      sorting: sorting.state,
      columnFilters: columnFilters?.state ?? [],
      globalFilter: search.initialValue,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: pagination.onPaginationChange,
    onSortingChange: sorting.onSortingChange,
    onColumnFiltersChange: columnFilters?.onColumnFiltersChange,
    onGlobalFilterChange: search.onSearchChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: meta?.totalPages ?? -1,
    meta: {
      editConfig,
      viewConfig,
      onSoftDelete,
      onPermanentDelete,
      onRestore,
    },
  });

  // Sync selected IDs whenever row selection changes
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);
    setSelectedIds(ids);
  }, [rowSelection, table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        onSearchChange={search.onSearchChange}
        searchValue={search.initialValue}
        filters={filters}
        selectedIds={selectedIds}
        onDelete={onSoftDelete}
        onCreate={onCreate}
        createButtonLabel={createButtonLabel}
        queryKey={queryKey}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} meta={meta} />
    </div>
  );
}
