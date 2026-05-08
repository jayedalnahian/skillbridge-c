import { httpClient } from "@/lib/axios/httpClient";
import { IStudent, IStudentUpdatePayload } from "@/types/user.types";
import { PaginationMeta } from "@/types/api.types";
import { IStudentDashboardData } from "@/types/student.types";

export interface IStudentQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  isDeleted?: string;
}

export interface IStudentListResponse {
  data: IStudent[];
  meta: PaginationMeta;
}

export interface IStudentBulkDeleteResponse {
  deleted: string[];
  notFound: string[];
  alreadyDeleted: string[];
  hasBookings: string[];
  errors: { id: string; message: string }[];
}

function buildQueryString(params: IStudentQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.isDeleted !== undefined) query.set("isDeleted", params.isDeleted);

  return query.toString();
}

/**
 * Get all students with pagination, search, and filters
 */
export const getAllStudents = async (
  params?: IStudentQueryParams | string,
): Promise<IStudentListResponse> => {
  try {
    let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/student?${queryString}` : "/student";

    const response = await httpClient.get<
      IStudent[] | { data: IStudent[]; meta: PaginationMeta }
    >(url);

    // Handle both wrapped (ApiResponse) and unwrapped (raw array) responses
    const isApiResponse =
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data) &&
      "meta" in response;

    if (isApiResponse) {
      return {
        data: (response as { data: IStudent[] }).data || [],
        meta:
          (response as { meta: PaginationMeta }).meta ||
          getDefaultPaginationMeta(),
      };
    }

    // If response is a raw array (not wrapped in ApiResponse)
    const rawData = Array.isArray(response) ? response : [];

    return {
      data: rawData as IStudent[],
      meta: {
        page: 1,
        limit: 10,
        total: rawData.length,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      data: [],
      meta: getDefaultPaginationMeta(),
    };
  }
};

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

/**
 * Get a single student by ID
 */
export const getStudentById = async (
  id: string,
): Promise<ServiceResponse<IStudent>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid student ID",
      };
    }

    const result = await httpClient.get<IStudent>(`/student/${id}`);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get student error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch student",
    };
  }
};

/**
 * Update a student by ID
 */
export const updateStudent = async (
  id: string,
  payload: IStudentUpdatePayload,
): Promise<ServiceResponse<IStudent>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid student ID",
      };
    }

    if (!payload || Object.keys(payload).length === 0) {
      return {
        success: false,
        message: "No update data provided",
      };
    }

    const result = await httpClient.patch<IStudent>(`/student/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student updated successfully",
    };
  } catch (error: any) {
    console.error("Update student error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

/**
 * Soft delete a student by ID
 */
export const softDeleteStudent = async (
  id: string,
): Promise<ServiceResponse<IStudent>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid student ID",
      };
    }

    const result = await httpClient.delete<IStudent>(`/student/${id}`);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete student error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

/**
 * Bulk soft delete multiple students
 */
export const bulkSoftDeleteStudents = async (
  ids: string[],
): Promise<ServiceResponse<IStudentBulkDeleteResponse>> => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return {
        success: false,
        message: "No student IDs provided",
      };
    }

    // Filter out invalid IDs
    const validIds = ids.filter((id) => typeof id === "string" && id.trim());

    if (validIds.length === 0) {
      return {
        success: false,
        message: "No valid student IDs provided",
      };
    }

    const result = await httpClient.post<IStudentBulkDeleteResponse>("/student/bulk-delete", { ids: validIds });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete students",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Students deleted successfully",
    };
  } catch (error: any) {
    console.error("Bulk delete students error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

interface IHardDeleteResponse {
  id: string;
  message: string;
}

/**
 * Hard delete (permanently delete) a student by ID
 * Student must be soft-deleted first and have no active bookings
 */
export const hardDeleteStudent = async (
  id: string,
): Promise<ServiceResponse<IHardDeleteResponse>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid student ID",
      };
    }

    const result = await httpClient.delete<IHardDeleteResponse>(`/student/permanent/${id}`);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to permanently delete student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student permanently deleted",
    };
  } catch (error: any) {
    console.error("Hard delete student error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

/**
 * Restore a soft-deleted student by ID
 */
export const restoreStudent = async (
  id: string,
): Promise<ServiceResponse<IStudent>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid student ID",
      };
    }

    const result = await httpClient.patch<IStudent>(`/student/restore/${id}`, {});

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to restore student",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Student restored successfully",
    };
  } catch (error: any) {
    console.error("Restore student error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

// Helper function
function getDefaultPaginationMeta(): PaginationMeta {
  return {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };
}

/**
 * Get student dashboard analytics data
 */
export const getDashboardData = async (): Promise<ServiceResponse<IStudentDashboardData>> => {
  try {
    const result = await httpClient.get<IStudentDashboardData>("/student/dashboard");

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch dashboard data",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Dashboard data fetched successfully",
    };
  } catch (error: any) {
    console.error("Get dashboard data error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};
