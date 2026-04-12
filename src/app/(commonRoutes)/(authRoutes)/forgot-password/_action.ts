/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload
): Promise<ApiErrorResponse> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post("/auth/forget-password", {
      email: parsedPayload.data.email,
    });

    if (response.success) {
      redirect(`/reset-password?email=${parsedPayload.data.email}`);
    }

    return {
      success: false,
      message: response.message || "Failed to send reset code",
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
      
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
