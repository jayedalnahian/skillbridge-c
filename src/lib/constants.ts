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
  STUDENTS: "students",
  ADMINS: "admins",
  BOOKINGS: "bookings",
} as const;

// Days of week for tutor availability
export const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

// Education levels for tutor profile
export const EDUCATION_LEVELS = [
  "High School",
  "Bachelor",
  "Master",
  "PhD",
  "Other",
] as const;
