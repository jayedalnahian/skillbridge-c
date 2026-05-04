import { PaginationMeta } from "./api.types";
import { IAdmin } from "./user.types";

export interface IAdminQueryParams {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  isDeleted?: string;
}

export interface IAdminListResponse {
  data: IAdmin[];
  meta: PaginationMeta;
}

export interface IAdminCreatePayload {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
  };
}

export interface IAdminUpdatePayload {
  name?: string;
  email?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
}