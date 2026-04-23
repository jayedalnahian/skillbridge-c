"use client"

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types/category.types";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

// Module-level formatter - created once, reused for all cells
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});


const IdCell = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 group">
      <code className="text-xs font-mono text-slate-500 truncate max-w-[120px]">
        {id}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 italic">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-slate-500">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "experienceYears",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Experience" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-slate-500">
        {row.getValue("experienceYears") || "Freasher"}
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
          className={isDeleted ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}
        >
          {isDeleted ? "True" : "False"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "ACTIVE" ? "default" : status === "BANNED" ? "destructive" : "secondary"}
          className={status === "BANNED" ? "bg-red-100 text-red-700 hover:bg-red-200" : status === "INACTIVE" ? "bg-yellow-700 text-black hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}
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
    accessorKey: "hourlyRate",
    header: "Hourly Rate",
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 italic">
        {row.getValue("hourlyRate")}
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-slate-500">
          {date ? dateFormatter.format(new Date(date)) : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => (
      <DataTableRowActions
        row={row}
        table={table}
      />
    ),
  },
];