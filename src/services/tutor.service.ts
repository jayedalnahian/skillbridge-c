"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ITutorCreateInput, ITutorQueryParams, ITutorUpdateInput, ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";

function buildQueryString(params: ITutorQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.name) query.set("name", params.name);
  if (params.email) query.set("email", params.email);
  if (params.educationLevel) query.set("educationLevel", params.educationLevel);
  if (params.isDeleted !== undefined) query.set("isDeleted", params.isDeleted);

  return query.toString();
}

export const getAllTutors = async (params?: ITutorQueryParams | string) => {
  try {
    let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/tutor?${queryString}` : "/tutor";

    const response = await httpClient.get<{ data: ITutorWithRelations[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(url);

    // Server returns { success, message, data: { data: [...], meta: {...} } }
    // So response.data is the QueryBuilder result containing data and meta
    if (response && typeof response === "object" && "data" in response) {
      const result = response.data;
      // result should be { data: [...], meta: {...} }
      if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
        return {
          data: result.data,
          meta: result.meta || {
            page: 1,
            limit: 10,
            total: result.data.length,
            totalPages: 1,
          },
        };
      }
    }

    // Fallback for unexpected response format
    return {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching tutors:", error);
    throw error;
  }
};

export const getTutorById = async (id: string) => {
  try {
    const result = await httpClient.get(`/tutor/${id}`);
    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get tutor error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const getAssignedCategories = async (tutorId: string) => {
  try {
    const result = await httpClient.get<ICategory[]>(`/tutor/${tutorId}/categories`);
    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get assigned categories error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const createTutor = async (payload: ITutorCreateInput) => {
  // console.log("createTutor payload:", payload);
  try {
    const result = await httpClient.post("/tutor", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create tutor",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Tutor created successfully",
    };
  } catch (error: any) {
    console.error("Create tutor error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const updateTutor = async (id: string, payload: ITutorUpdateInput) => {
  try {
    const result = await httpClient.patch(`/tutor/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update tutor",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Tutor updated successfully",
    };
  } catch (error: any) {
    console.error("Update tutor error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const bulkSoftDeleteTutors = async (ids: string[]) => {
  try {

    // console.log("bulkSoftDelete for " , ids)
    const result = await httpClient.post("/tutor/bulk-delete", { ids });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete tutor(s)",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Tutor(s) deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete tutor error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const hardDeleteTutor = async (id: string) => {
  try {
    const result = await httpClient.delete(`/tutor/permanent/${id}`);
    
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to permanently delete tutor",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Tutor permanently deleted successfully",
    };
  } catch (error: any) {
    console.error("Permanently delete tutor error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};

export const restoreTutor = async (id: string) => {
  try {
    const result = await httpClient.patch(`/tutor/restore/${id}`, {});

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to restore tutor",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Tutor restored successfully",
    };
  } catch (error: any) {
    console.error("Restore tutor error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "An unexpected error occurred",
    };
  }
};



