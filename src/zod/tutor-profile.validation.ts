import z from "zod";
import { DAYS_OF_WEEK } from "@/lib/constants";

/**
 * Validation schema for tutor profile update.
 * All fields are optional since it's a partial update.
 */
export const tutorProfileUpdateSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    contactNumber: z.string().min(1, "Contact number is required").optional(),
    profilePhoto: z.string().url("Invalid URL").optional().or(z.literal("")),
    designation: z.string().min(1, "Designation is required").optional(),
    educationLevel: z.string().min(1, "Education level is required").optional(),
    experienceYears: z
      .number()
      .min(0, "Experience years must be at least 0")
      .optional(),
    availableDays: z
      .array(z.enum(DAYS_OF_WEEK))
      .min(1, "At least one available day is required")
      .optional(),
    availabilityStartTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Invalid time format (HH:mm)"
      )
      .optional(),
    availabilityEndTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Invalid time format (HH:mm)"
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Only validate time range if both times are provided
      if (data.availabilityStartTime && data.availabilityEndTime) {
        return data.availabilityStartTime < data.availabilityEndTime;
      }
      return true;
    },
    {
      message: "Start time must be before end time",
      path: ["availabilityEndTime"],
    }
  );

export type TutorProfileUpdateInput = z.infer<typeof tutorProfileUpdateSchema>;
