"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { HeroStats } from "@/types/stats.type";

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

export const getHeroStats = async (
): Promise<ServiceResponse<HeroStats>> => {
  try {
    const result = await httpClient.get<HeroStats>(`/stats/hero-stats`);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get stats error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch stats",
    };
  }
};