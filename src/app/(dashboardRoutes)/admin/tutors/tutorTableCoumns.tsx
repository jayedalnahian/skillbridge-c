"use client";

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITutor } from "@/types/tutor.types";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

// Module-level formatter - created once, reused for all cells
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});


const IdCell = ({ id }: { id: string }) => {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = () => {
    copyText(id);
  };

  return (
    <div className="flex items-center gap-2 group">
      <code className="text-xs font-mono text-slate-500 truncate max-w-[120px] hover:text-[#00ADB5]">
        {id}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleCopy}
      >
        {hasCopiedRecently ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export const columns: ColumnDef<ITutor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tutor Name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 hover:text-[#00ADB5] italic">
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
      <div className="max-w-[300px] truncate text-slate-500 hover:text-[#00ADB5]">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <div className="text-slate-500 hover:text-[#00ADB5]">
        {row.getValue("contactNumber") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-slate-500 hover:text-[#00ADB5]">
        {row.getValue("designation") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "experienceYears",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Experience" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-slate-500 hover:text-[#00ADB5]">
        {row.getValue("experienceYears") ? `${row.getValue("experienceYears")} years` : "Fresher"}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <IdCell id={row.getValue("id")} />,
  },

  {
    accessorKey: "educationLevel",
    header: "Education",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-slate-500 hover:text-[#00ADB5]">
        {row.getValue("educationLevel") || "N/A"}
      </div>
    ),
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
          {isDeleted ? "Yes" : "No"}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hourly Rate" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold text-slate-900 hover:text-[#00ADB5]">
        ${row.getValue("hourlyRate")}/hr
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-slate-500 hover:text-[#00ADB5]">
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