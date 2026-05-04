import { httpClient } from "@/lib/axios/httpClient";
import { IBooking, IBookingCreateInput, IBookingQueryParams, ICancelBookingInput } from "@/types/booking.types";
function buildQueryString(params: IBookingQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.status) query.set("status", params.status);
  if (params.paymentStatus) query.set("paymentStatus", params.paymentStatus);
  if (params.isDeleted !== undefined) query.set("isDeleted", String(params.isDeleted));

  return query.toString();
}
export const getAllBookings = async (
    params?: IBookingQueryParams | string,
) => {
    try {
        let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/booking?${queryString}` : "/booking";

    const response = await httpClient.get<IBooking[]>(url);

    // Handle both wrapped (ApiResponse) and unwrapped (raw array) responses
    const isApiResponse = response && typeof response === "object" && "data" in response && Array.isArray(response.data);

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
        console.error("Error fetching bookings:", error);
        throw error;
    }
};

export const getBookingById = async (id: string) => {
    try {
        const result = await httpClient.get(`/booking/${id}`);
        return {
            success: true,
            data: result.data,
        };
    } catch (error: any) {
        console.error("Get booking error:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
        };
    }
};

export const createBooking = async (
    tutorId: string,
    payload: IBookingCreateInput,
) => {
    try {
        const result = await httpClient.post(`/booking/${tutorId}`, payload);

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create booking",
                error: result,
            };
        }

        return {
            success: true,
            data: result.data,
            message: result.message || "Booking created successfully",
        };
    } catch (error: any) {
        console.error("Create booking error:", error);
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error.message ||
                "An unexpected error occurred",
        };
    }
};

export const cancelBooking = async (
    id: string,
    payload: ICancelBookingInput,
) => {
    try {
        const result = await httpClient.patch(`/cancle-booking/${id}`, payload);

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to cancel booking",
                error: result,
            };
        }

        return {
            success: true,
            data: result.data,
            message: result.message || "Booking cancelled successfully",
        };
    } catch (error: any) {
        console.error("Cancel booking error:", error);
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error.message ||
                "An unexpected error occurred",
        };
    }
};

export const completeBooking = async (id: string) => {
    try {
        const result = await httpClient.patch(`/complete-booking/${id}`, {});

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to complete booking",
                error: result,
            };
        }

        return {
            success: true,
            data: result.data,
            message: result.message || "Booking completed successfully",
        };
    } catch (error: any) {
        console.error("Complete booking error:", error);
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error.message ||
                "An unexpected error occurred",
        };
    }
};

export const hardDeleteBooking = async (id: string) => {
    try {
        const result = await httpClient.delete(`/hard-delete-booking/${id}`);

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete booking",
                error: result,
            };
        }

        return {
            success: true,
            data: result.data,
            message: result.message || "Booking deleted successfully",
        };
    } catch (error: any) {
        console.error("Delete booking error:", error);
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                error.message ||
                "An unexpected error occurred",
        };
    }
};