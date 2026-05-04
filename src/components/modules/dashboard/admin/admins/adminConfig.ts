
// Table configuration
export const ADMIN_TABLE_CONFIG = {
  defaultPage: 1,
  defaultLimit: 10,
} as const;

// Filter options for the table
export const adminFilters = [
  {
    columnId: "isDeleted",
    title: "Deleted",
    options: [
      { label: "No", value: "false" },
      { label: "Yes", value: "true" },
    ],
  },
];