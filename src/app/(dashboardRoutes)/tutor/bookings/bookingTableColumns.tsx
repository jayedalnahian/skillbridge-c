"use client";

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { IdCell } from "@/components/shared/data-table/IdCell";
import { Badge } from "@/components/ui/badge";
import { IBooking } from "@/types/booking.types";
import { ColumnDef } from "@tanstack/react-table";
import { BookingRowActions } from "./BookingRowActions";

export const columns: ColumnDef<IBooking>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <IdCell id={row.getValue("id")} />,
  },
  {
    accessorKey: "Student.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.Student?.name || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusStyles = {
        PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-200",
        ACCEPTED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        REJECTED: "bg-red-100 text-red-700 hover:bg-red-200",
        COMPLETED: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      };

      return (
        <Badge
          variant="outline"
          className={
            statusStyles[status as keyof typeof statusStyles] ||
            "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;

      const paymentStyles = {
        PAID: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        UNPAID: "bg-red-100 text-red-700 hover:bg-red-200",
      };

      return (
        <Badge
          variant="outline"
          className={
            paymentStyles[status as keyof typeof paymentStyles] ||
            "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 hover:text-[#00ADB5]">
        ${Number(row.getValue("price")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "payment.transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="text-xs font-mono text-slate-500">
        {row.original.payment?.transactionId || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => <BookingRowActions row={row} table={table as any} />,
  },
];
