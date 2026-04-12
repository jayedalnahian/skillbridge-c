/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { resetPasswordZodSchema, IResetPasswordPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload
): Promise<ApiErrorResponse> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post("/auth/reset-password", {
      email: parsedPayload.data.email,
      otp: parsedPayload.data.otp,
      newPassword: parsedPayload.data.newPassword,
    });

    if (response.success) {
      redirect("/login");
    }

    return {
      success: false,
      message: response.message || "Failed to reset password",
    };
  } catch (error: any) {
    if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Reset password error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
