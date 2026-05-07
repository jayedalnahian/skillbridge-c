"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IReview, IReviewCreateInput, IReviewUpdateInput } from "@/types/review.types";

export const getReviewsByTutor = async (tutorId: string) => {
  try {
    const result = await httpClient.get<IReview[]>(`/review/tutor/${tutorId}`);
    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      data: [] as IReview[],
    };
  }
};

export const getMyReviews = async () => {
  try {
    const result = await httpClient.get<IReview[]>("/review/my-reviews");
    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get my reviews error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      data: [] as IReview[],
    };
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
