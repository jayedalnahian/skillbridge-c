export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryQueryParams {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
  isDeleted?: string;
}

export interface ICategoryCreateInput {
  name: string;
  slug: string;
  description: string;
}

export type ICategoryUpdateInput = Partial<ICategoryCreateInput>;
