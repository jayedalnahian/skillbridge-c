/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";

interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export const resendOTPAction = async (
  email: string
): Promise<ResendOTPResponse | ApiErrorResponse> => {
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Invalid email address",
    };
  }

  try {
    await httpClient.post("/auth/resend-otp", { email });

    return {
      success: true,
      message: "Verification code resent successfully",
    };
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to resend verification code",
    };
  }
};
