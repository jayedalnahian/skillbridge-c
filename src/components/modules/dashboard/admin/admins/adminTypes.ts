import { UseMutationResult } from "@tanstack/react-query";
import z from "zod";
import { createAdminSchema, updateAdminSchema } from "./adminValidators";

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;

export interface AdminCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<any, Error, CreateAdminInput>;
}

export interface AdminEditFormProps {
  form: any;
  adminId: string;
}

export interface AdminDetailsViewProps {
  item: any;
}

export interface AdminErrorStateProps {
  message?: string;
}
