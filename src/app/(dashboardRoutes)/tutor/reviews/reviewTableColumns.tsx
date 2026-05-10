"use client";

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { IdCell } from "@/components/shared/data-table/IdCell";
import { Badge } from "@/components/ui/badge";
import { IReview } from "@/types/review.types";
import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

export const columns: ColumnDef<IReview>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <IdCell id={row.getValue("id")} />,
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => <IdCell id={row.getValue("studentId")} />,
  },
  {
    accessorKey: "bookingId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Booking ID" />
    ),
    cell: ({ row }) => <IdCell id={row.getValue("bookingId")} />,
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;

      const ratingStyles =
        rating >= 4
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : rating >= 3
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-red-100 text-red-700 hover:bg-red-200";

      return (
        <Badge variant="outline" className={ratingStyles}>
          <Star className="mr-1 h-3 w-3 fill-current" />
          {rating.toFixed(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;

      return (
        <div className="max-w-[200px] truncate text-sm text-slate-600" title={comment}>
          {comment}
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Deleted",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;

      const deletedStyles = isDeleted
        ? "bg-red-100 text-red-700 hover:bg-red-200"
        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";

      return (
        <Badge variant="outline" className={deletedStyles}>
          {isDeleted ? "Yes" : "No"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
