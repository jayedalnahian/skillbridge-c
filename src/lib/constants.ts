// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  ONE_HOUR: 1000 * 60 * 60,
  SIX_HOURS: 1000 * 60 * 60 * 6,
  ONE_DAY: 1000 * 60 * 60 * 24,
} as const;

// UI timeouts (in milliseconds)
export const UI_TIMEOUTS = {
  CLIPBOARD_RESET: 2000,
  DEBOUNCE: 400,
} as const;

// Query keys
export const QUERY_KEYS = {
  CATEGORIES: "categories",
  TUTORS: "tutors",
} as const;
