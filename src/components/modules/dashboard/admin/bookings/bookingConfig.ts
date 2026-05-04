import { CheckCircle2, XCircle } from "lucide-react";

export const BOOKING_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

export const bookingFilters = [
  {
    columnId: "isDeleted",
    title: "Deleted",
    options: [
      { label: "No", value: "false", icon: CheckCircle2 },
      { label: "Yes", value: "true", icon: XCircle },
    ],
  },
  {
    columnId: "paymentStatus",
    title: "Payment Status",
    options: [
      { label: "Paid", value: "PAID", icon: CheckCircle2 },
      { label: "Unpaid", value: "UNPAID", icon: XCircle },
    ],
  },
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Pending", value: "PENDING", icon: CheckCircle2 },
      { label: "Accepted", value: "ACCEPTED", icon: CheckCircle2 },
      { label: "Rejected", value: "REJECTED", icon: XCircle },
      { label: "Completed", value: "COMPLETED", icon: CheckCircle2 },
    ],
  },
];
