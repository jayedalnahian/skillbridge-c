/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/register.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", parsedPayload.data.name);
    formData.append("email", parsedPayload.data.email);
    formData.append("password", parsedPayload.data.password);
    
    if (parsedPayload.data.image) {
      formData.append("file", parsedPayload.data.image);
    }

    const response = await httpClient.post<ILoginResponse>("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, emailVerified, needPasswordChange, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if (needPasswordChange) {
      redirect(`/reset-password?email=${email}`);
    } else if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    } else {
      redirect(getDefaultDashboardRoute(role as UserRole));
    }
  } catch (error: any) {
    console.log(error, "error");
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
      message: `Registration failed: ${error.message}`,
    };
  }
};
