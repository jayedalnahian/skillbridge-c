/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

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
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if (needPasswordChange) {
      redirectTarget = `/reset-password?email=${user.email}`;
    } else if (!emailVerified) {
      redirectTarget = `/verify-email?email=${user.email}`;
    } else {
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
      redirectTarget = targetPath;
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

    // Handle "Email not verified" API error
    if (error?.response?.data?.message === "Email not verified") {
      redirectTarget = `/verify-email?email=${payload.email}`;
    } else {
      console.error("Login error:", error);
      return {
        success: false,
        message: `Login failed: ${error.message}`,
      };
    }
  }

  // Perform redirect outside try/catch to avoid NEXT_REDIRECT being caught
  if (redirectTarget) {
    // console.log("Redirecting to:", redirectTarget);
    redirect(redirectTarget);
  }

  // Fallback (should never reach here)
  return {
    success: false,
    message: "Unexpected error occurred",
  };
};
