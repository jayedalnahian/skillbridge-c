/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/verifyEmail.validation";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (
  payload: IVerifyEmailPayload
): Promise<ApiErrorResponse> => {
  const parsedPayload = verifyEmailZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    // Call API with 'code' instead of 'otp'
    await httpClient.post("/auth/verify-email", {
      email: parsedPayload.data.email,
      otp: parsedPayload.data.otp,
    });

    // Success - redirect to home
    redirect("/");
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT immediately without logging
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Verify email error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Email verification failed",
    };
  }
};
