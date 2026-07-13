"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  IMessage,
  IMessageCreateInput,
} from "@/types/message.types";

export const createMessage = async (payload: IMessageCreateInput) => {
  try {
    const result = await httpClient.post("/message", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to send message",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Message sent successfully",
    };
  } catch (error: any) {
    console.error("Create message error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

export const getAllMessages = async () => {
  try {
    const response = await httpClient.get<IMessage[]>("/message");

    const isApiResponse =
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data);

    if (isApiResponse) {
      return {
        data: response.data || [],
        meta: response.meta || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const rawData = Array.isArray(response) ? response : [];

    return {
      data: rawData,
      meta: {
        page: 1,
        limit: rawData.length,
        total: rawData.length,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
