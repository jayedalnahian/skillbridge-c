"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview, IReviewCreateInput, IReviewUpdateInput } from "@/types/review.types";

export interface IReviewQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  rating?: number;
  isDeleted?: boolean;
}

function buildQueryString(params: IReviewQueryParams): string {
    const query = new URLSearchParams();

    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params.rating !== undefined) query.set("rating", String(params.rating));
    if (params.isDeleted !== undefined) query.set("isDeleted", String(params.isDeleted));

    return query.toString();
}

export const getAllReviews = async (
    params?: IReviewQueryParams | string,
) => {
    try {
        let queryString: string;

        if (typeof params === "string") {
            queryString = params;
        } else {
            queryString = params ? buildQueryString(params) : "";
        }

        const url = queryString ? `/review?${queryString}` : "/review";

        const response = await httpClient.get<IReview[] | { data: { data: IReview[]; meta?: { page: number; limit: number; total: number; totalPages: number; } }; }>(url);

        // Handle both wrapped (ApiResponse) and unwrapped (raw array) responses
        // Backend returns: { success, message, data: { data: [...], meta: {...} }, error }
        const isWrappedResponse = response && typeof response === "object" && "data" in response && response.data && typeof response.data === "object" && "data" in response.data && Array.isArray(response.data.data);

        if (isWrappedResponse) {
            const wrappedResponse = response as unknown as { data: { data: IReview[]; meta?: { page: number; limit: number; total: number; totalPages: number; } } };
            return {
                data: wrappedResponse.data.data || [],
                meta: wrappedResponse.data.meta || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                },
            };
        }

        // If response is a raw array (not wrapped in ApiResponse)
        const rawData = Array.isArray(response) ? response : [];

        return {
            data: rawData,
            meta: {
                page: 1,
                limit: 10,
                total: rawData.length,
                totalPages: 1,
            },
        };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};


export const createReview = async (payload: IReviewCreateInput) => {
  try {
    const result = await httpClient.post("/review", payload);
    return {
      success: true,
      data: result.data,
      message: result.message || "Review created successfully",
    };
  } catch (error: any) {
    console.error("Create review error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const updateReview = async (id: string, payload: IReviewUpdateInput) => {
  try {
    const result = await httpClient.patch(`/review/${id}`, payload);
    return {
      success: true,
      data: result.data,
      message: result.message || "Review updated successfully",
    };
  } catch (error: any) {
    console.error("Update review error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const deleteReview = async (id: string) => {
  try {
    const result = await httpClient.delete(`/review/${id}`);
    return {
      success: true,
      data: result.data,
      message: result.message || "Review deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete review error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};
