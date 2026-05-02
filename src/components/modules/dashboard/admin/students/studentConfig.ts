import { CheckCircle2, XCircle } from "lucide-react";

export const STUDENT_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

export const studentFilters = [
  {
    columnId: "isDeleted",
    title: "Deleted",
    options: [
      { label: "No", value: "false", icon: CheckCircle2 },
      { label: "Yes", value: "true", icon: XCircle },
    ],
  },
];
