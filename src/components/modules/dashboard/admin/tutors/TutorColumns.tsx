"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ITutorWithRelations } from "@/types/tutor.types";

const StatusIndicator = ({ isDeleted }: { isDeleted: boolean }) => (
  <div
    className={`px-2 py-1 rounded-full text-xs w-fit ${
      isDeleted
        ? "bg-red-500/10 text-red-500 border border-red-500/20"
        : "bg-green-500/10 text-green-500 border border-green-500/20"
    }`}
  >
    {isDeleted ? "Yes" : "No"}
  </div>
);

const AvailableDays = ({ days }: { days: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {days.slice(0, 3).map((day) => (
      <Badge key={day} variant="outline" className="text-xs">
        {day.slice(0, 3)}
      </Badge>
    ))}
    {days.length > 3 && (
      <Badge variant="outline" className="text-xs">
        +{days.length - 3}
      </Badge>
    )}
  </div>
);

const formatCurrency = (value: number) => `$${value}`;
const formatExperience = (years: number) => `${years} years`;
const formatDate = (date: string | Date) => new Date(date).toLocaleDateString();

export const tutorColumns: ColumnDef<ITutorWithRelations>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "educationLevel",
    header: "Education",
  },
  {
    accessorKey: "experienceYears",
    header: "Experience",
    cell: ({ row }) => formatExperience(row.original.experienceYears),
  },
  {
    accessorKey: "hourlyRate",
    header: "Hourly Rate",
    cell: ({ row }) => formatCurrency(row.original.hourlyRate),
  },
  {
    accessorKey: "availableDays",
    header: "Available Days",
    cell: ({ row }) => <AvailableDays days={row.original.availableDays} />,
  },
  {
    accessorKey: "isDeleted",
    header: "Deleted",
    cell: ({ row }) => <StatusIndicator isDeleted={row.original.isDeleted} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
