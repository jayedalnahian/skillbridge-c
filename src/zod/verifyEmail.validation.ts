import { z } from "zod";

export const verifyEmailZodSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
