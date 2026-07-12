"use client";

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { IdCell } from "@/components/shared/data-table/IdCell";
import { Badge } from "@/components/ui/badge";
import { IStudent } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";
import { dateFormatter } from "@/lib/dateFormatters";

export const columns: ColumnDef<IStudent>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 dark:text-slate-200 hover:text-[#00ADB5] italic">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2 dark:text-slate-200 text-slate-600 hover:text-[#00ADB5]">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="truncate max-w-[200px]">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue("contactNumber") as string | null;
      return contact ? (
        <div className="flex items-center dark:text-slate-200 gap-2 text-slate-600 hover:text-[#00ADB5]">
          <Phone className="h-4 w-4 text-slate-400" />
          <span>{contact}</span>
        </div>
      ) : (
        <span className="text-slate-400 italic">No contact</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate text-slate-500 dark:text-slate-200 hover:text-[#00ADB5]">
        {row.getValue("description") || "No description provided"}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <IdCell id={row.getValue("id")} />,
  },
  {
    accessorKey: "isDeleted",
    header: "Deleted",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      return (
        <Badge
          variant={isDeleted ? "destructive" : "default"}
          className={
            isDeleted
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }
        >
          {isDeleted ? "Yes" : "No"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-slate-500 dark:text-slate-200 hover:text-[#00ADB5]">
          {date ? dateFormatter.format(new Date(date)) : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => (
      <DataTableRowActions row={row} table={table} />
    ),
  },
];

