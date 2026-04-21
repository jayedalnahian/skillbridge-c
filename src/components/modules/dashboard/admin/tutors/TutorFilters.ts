import { DataTableFilterConfig } from "@/components/shared/data-table/DataTableFilters";

export const tutorFilterConfigs: DataTableFilterConfig[] = [
  {
    id: "isDeleted",
    label: "Deleted",
    type: "single-select",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
  {
    id: "educationLevel",
    label: "Education Level",
    type: "single-select",
    options: [
      { label: "High School", value: "High School" },
      { label: "Bachelor", value: "Bachelor" },
      { label: "Master", value: "Master" },
      { label: "PhD", value: "PhD" },
      { label: "Other", value: "Other" },
    ],
  },
];
