import { UseMutationResult } from "@tanstack/react-query";
import z from "zod";
import { categorySchema, createCategorySchema } from "./categoryValidators";
import { ICategory } from "@/types/category.types";

export interface CategoryTableProps {
  initialQueryString: string;
}
export type CategoryEditInput = z.infer<typeof categorySchema>;



export type CreateCategoryInput = z.infer<typeof createCategorySchema>;



export interface CategoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<unknown, Error, CreateCategoryInput, unknown>;
}


export interface CategoryDetailsViewProps {
  item: ICategory;
}


export interface CategoryErrorStateProps {
  message?: string;
}


export interface UseCategoryMutationsReturn {
  editMutation: UseMutationResult<
    unknown,
    Error,
    CategoryEditInput & { id: string },
    unknown
  >;
  createMutation: UseMutationResult<unknown, Error, CreateCategoryInput, unknown>;
  deleteMutation: UseMutationResult<
    { deleted?: string[]; inUse?: string[]; notFound?: string[]; errors?: { id: string; message: string }[] },
    Error,
    string[],
    unknown
  >;
  permanentDeleteMutation: UseMutationResult<unknown, Error, string, unknown>;
  restoreMutation: UseMutationResult<unknown, Error, string, unknown>;
}
