/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/register.validation";
import { redirect } from "next/navigation";

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  let redirectTarget: string | null = null;

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/register",
      parsedPayload.data
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if (needPasswordChange) {
      redirectTarget = `/reset-password?email=${email}`;
    } else if (!emailVerified) {
      redirectTarget = `/verify-email?email=${email}`;
    } else {
      redirectTarget = getDefaultDashboardRoute(role as UserRole);
    }
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

    return {
      success: false,
      message: `Registration failed: ${error?.response?.data?.message || error.message || "Unknown error"}`,
    };
  }

  // Perform redirect outside try/catch to avoid NEXT_REDIRECT being caught
  if (redirectTarget) {
    redirect(redirectTarget);
  }

  // Fallback (should never reach here)
  return {
    success: false,
    message: "Unexpected error occurred",
  };
};
