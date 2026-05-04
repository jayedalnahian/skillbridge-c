import { z } from "zod";

export const loginZodSchema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
})

export const forgotPasswordZodSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordBaseSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),
    newPassword: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string()
        .min(1, "Confirm password is required"),
});

export const resetPasswordZodSchema = resetPasswordBaseSchema.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
