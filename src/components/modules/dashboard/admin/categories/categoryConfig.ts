import { CheckCircle2, XCircle } from "lucide-react";

export const CATEGORY_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

export const categoryFilters = [
  {
    columnId: "isDeleted",
    title: "Status",
    options: [
      { label: "Active", value: "false", icon: CheckCircle2 },
      { label: "Deleted", value: "true", icon: XCircle },
    ],
  },
];
