import { httpClient } from "@/lib/axios/httpClient";
import {
  ICategory,
  ICategoryCreateInput,
  ICategoryQueryParams,
  ICategoryUpdateInput,
} from "@/types/category.types";

function buildQueryString(params: ICategoryQueryParams): string {
  const query = new URLSearchParams();

  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.name) query.set("name", params.name);
  if (params.isDeleted !== undefined) query.set("isDeleted", params.isDeleted);

  return query.toString();
}

export const getAllCategories = async (
  params?: ICategoryQueryParams | string,
) => {
  try {
    let queryString: string;

    if (typeof params === "string") {
      queryString = params;
    } else {
      queryString = params ? buildQueryString(params) : "";
    }

    const url = queryString ? `/category?${queryString}` : "/category";

    const response = await httpClient.get<ICategory[]>(url);

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
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const result = await httpClient.get(`/category/${id}`);
    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get category error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const createCategory = async (payload: ICategoryCreateInput) => {
  try {
    const result = await httpClient.post("/category", payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create category",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Category created successfully",
    };
  } catch (error: any) {
    console.error("Create category error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

export const updateCategory = async (
  id: string,
  payload: ICategoryUpdateInput,
) => {
  try {
    const result = await httpClient.patch(`/category/${id}`, payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update category",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Category updated successfully",
    };
  } catch (error: any) {
    console.error("Update category error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const result = await httpClient.delete(`/category/${id}`);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete category",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Category deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete category error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

export const bulkDeleteCategories = async (ids: string[]) => {
  try {
    const result = await httpClient.post("/category/bulk-delete", { ids });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete categories",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Categories deleted successfully",
    };
  } catch (error: any) {
    console.error("Bulk delete categories error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};

export const restoreCategory = async (id: string) => {
  try {
    const result = await httpClient.patch(`/category/restore/${id}`, {});

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to restore category",
        error: result,
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Category restored successfully",
    };
  } catch (error: any) {
    console.error("Restore category error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    };
  }
};
