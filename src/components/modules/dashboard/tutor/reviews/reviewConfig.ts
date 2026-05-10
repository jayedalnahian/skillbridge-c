import { CheckCircle2, XCircle, Star } from "lucide-react";

export const REVIEW_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

export const reviewFilters = [
  {
    columnId: "isDeleted",
    title: "Deleted",
    options: [
      { label: "No", value: "false", icon: CheckCircle2 },
      { label: "Yes", value: "true", icon: XCircle },
    ],
  },
  {
    columnId: "rating",
    title: "Rating",
    options: [
      { label: "5 Stars", value: "5", icon: Star },
      { label: "4 Stars", value: "4", icon: Star },
      { label: "3 Stars", value: "3", icon: Star },
      { label: "2 Stars", value: "2", icon: Star },
      { label: "1 Star", value: "1", icon: Star },
    ],
  },
];
