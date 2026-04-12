"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { deleteCookie } from "@/lib/cookieUtils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const logoutAction = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to invalidate session in database
    await httpClient.post("/auth/logout", {});
  } catch (error) {
    // Log error but continue with client-side cleanup
    // Even if backend fails, we must clear cookies to ensure user can log out
    console.error("Backend logout failed:", error);
  } finally {
    // Clear all authentication cookies from browser
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");

    // Revalidate the entire application cache
    revalidatePath("/");

    // Redirect to login page
    redirect("/login");
  }
};
