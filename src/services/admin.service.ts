"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdmin } from "@/types/user.types";
import { PaginationMeta } from "@/types/api.types";
import { IAdminCreatePayload, IAdminListResponse, IAdminQueryParams, IAdminUpdatePayload } from "@/types/admin.types";



interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: unknown;
}

function buildQueryString(params: IAdminQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.isDeleted !== undefined) query.set("isDeleted", params.isDeleted);

  return query.toString();
}

function getDefaultPaginationMeta(): PaginationMeta {
  return {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };
}

/**
 * Get all admins with pagination, search, and filters
 */
export const getAllAdmins = async (
  params?: IAdminQueryParams | string,
): Promise<IAdminListResponse> => {
  try {
    let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/admin?${queryString}` : "/admin";
    console.log("[DEBUG admin.service] URL:", url);

    const response = await httpClient.get<{ data: IAdmin[]; meta: PaginationMeta }>(url);
    console.log("[DEBUG admin.service] Raw response:", JSON.stringify(response, null, 2));

    // The backend returns ApiResponse<{ data: IAdmin[]; meta: PaginationMeta }>
    // So response.data is { data: [...], meta: {...} }
    const innerData = response.data;
    console.log("[DEBUG admin.service] innerData:", innerData);
    console.log("[DEBUG admin.service] innerData type:", typeof innerData);
    console.log("[DEBUG admin.service] innerData is array?:", Array.isArray(innerData));
    if (innerData && typeof innerData === "object") {
      console.log("[DEBUG admin.service] innerData.data:", (innerData as any).data);
      console.log("[DEBUG admin.service] innerData.data is array?:", Array.isArray((innerData as any).data));
    }

    if (innerData && typeof innerData === "object" && Array.isArray((innerData as any).data)) {
      return {
        data: (innerData as any).data,
        meta: (innerData as any).meta || getDefaultPaginationMeta(),
      };
    }

    // Fallback: if response structure is unexpected
    console.log("[DEBUG admin.service] FALLBACK - returning empty");
    return {
      data: [],
      meta: getDefaultPaginationMeta(),
    };
  } catch (error) {
    console.error("[DEBUG admin.service] Error fetching admins:", error);
    return {
      data: [],
      meta: getDefaultPaginationMeta(),
    };
  }
};

/**
 * Get a single admin by ID
 */
export const getSingleAdmin = async (
  id: string,
): Promise<ServiceResponse<IAdmin>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid admin ID",
      };
    }

    const result = await httpClient.get<IAdmin>(`/admin/${id}`);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get admin error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch admin",
    };
  }
};

/**
 * Create a new admin
 */
export const createAdmin = async (
  payload: IAdminCreatePayload,
): Promise<ServiceResponse<IAdmin>> => {
  try {
    if (!payload || !payload.admin || !payload.password) {
      return {
        success: false,
        message: "Invalid admin data provided",
      };
    }

    const result = await httpClient.post<IAdmin>("/admin", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create admin",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Admin created successfully",
    };
  } catch (error: any) {
    console.error("Create admin error:", error);
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
 * Update an admin by ID
 */
export const updateAdmin = async (
  id: string,
  payload: IAdminUpdatePayload,
): Promise<ServiceResponse<IAdmin>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid admin ID",
      };
    }

    if (!payload || Object.keys(payload).length === 0) {
      return {
        success: false,
        message: "No update data provided",
      };
    }

    const result = await httpClient.patch<IAdmin>(`/admin/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update admin",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Admin updated successfully",
    };
  } catch (error: any) {
    console.error("Update admin error:", error);
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
 * Hard delete (permanently delete) an admin by ID
 */
export const hardDeleteAdmin = async (
  id: string,
): Promise<ServiceResponse<IHardDeleteResponse>> => {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        message: "Invalid admin ID",
      };
    }

    const result = await httpClient.delete<IHardDeleteResponse>(
      `/admin/permanent/${id}`,
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to permanently delete admin",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Admin permanently deleted",
    };
  } catch (error: any) {
    console.error("Hard delete admin error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};
