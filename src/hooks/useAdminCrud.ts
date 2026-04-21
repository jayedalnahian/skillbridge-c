"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";

export type ModalMode = "view" | "edit" | "delete" | "create";

interface UseAdminCrudOptions<TData, TCreateInput, TUpdateInput> {
  queryKey: string;
  createFn: (data: TCreateInput) => Promise<{ success: boolean; message?: string }>;
  updateFn: (id: string, data: TUpdateInput) => Promise<{ success: boolean; message?: string }>;
  deleteFn: (id: string) => Promise<{ success: boolean; message?: string }>;
}

type MutationResult = { success: boolean; message?: string };

interface UseAdminCrudReturn<TData, TCreateInput, TUpdateInput> {
  // Table State
  pagination: PaginationState;
  setPagination: (state: PaginationState) => void;
  sorting: SortingState;
  setSorting: (state: SortingState) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resetPagination: () => void;
  
  // Modal State
  modalOpen: boolean;
  modalMode: ModalMode;
  selectedItem: TData | null;
  openModal: (mode: ModalMode, item?: TData) => void;
  closeModal: () => void;
  
  // Mutations
  createMutation: {
    mutate: (data: TCreateInput) => void;
    isPending: boolean;
  };
  updateMutation: {
    mutate: (params: { id: string; data: TUpdateInput }) => void;
    isPending: boolean;
  };
  deleteMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
  };
  isMutating: boolean;
  
  // Handlers
  handleConfirm: (data: TCreateInput | TUpdateInput | string) => void;
}

export function useAdminCrud<TData, TCreateInput, TUpdateInput>(
  options: UseAdminCrudOptions<TData, TCreateInput, TUpdateInput>
): UseAdminCrudReturn<TData, TCreateInput, TUpdateInput> {
  const queryClient = useQueryClient();
  
  // Table State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);

  const resetPagination = () => setPagination((prev) => ({ ...prev, pageIndex: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  // Modal Handlers
  const openModal = (mode: ModalMode, item?: TData) => {
    setModalMode(mode);
    setSelectedItem(item ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // Helper for mutation handlers
  const handleMutationResult = (result: { success: boolean; message?: string }, action: string) => {
    if (!result.success) {
      toast.error(result.message ?? `Failed to ${action}`);
      return false;
    }
    queryClient.invalidateQueries({ queryKey: [options.queryKey] });
    toast.success(result.message ?? `${action} successfully`);
    closeModal();
    return true;
  };

  const handleMutationError = (error: unknown, action: string) => {
    const message = error instanceof Error ? error.message : `Failed to ${action}`;
    toast.error(message);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: options.createFn,
    onSuccess: (result) => handleMutationResult(result, "create"),
    onError: (error) => handleMutationError(error, "create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateInput }) => options.updateFn(id, data),
    onSuccess: (result) => handleMutationResult(result, "update"),
    onError: (error) => handleMutationError(error, "update"),
  });

  const deleteMutation = useMutation({
    mutationFn: options.deleteFn,
    onSuccess: (result) => handleMutationResult(result, "delete"),
    onError: (error) => handleMutationError(error, "delete"),
  });

  // Handle modal confirm
  const handleConfirm = (data: TCreateInput | TUpdateInput | string) => {
    if (modalMode === "create") {
      createMutation.mutate(data as TCreateInput);
    } else if (modalMode === "edit" && selectedItem) {
      const item = selectedItem as TData & { id: string };
      updateMutation.mutate({ id: item.id, data: data as TUpdateInput });
    } else if (modalMode === "delete" && selectedItem) {
      const item = selectedItem as TData & { id: string };
      deleteMutation.mutate(item.id);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    // Table State
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchTerm,
    setSearchTerm: handleSearchChange,
    resetPagination,
    
    // Modal State
    modalOpen,
    modalMode,
    selectedItem,
    openModal,
    closeModal,
    
    // Mutations - expose only what's needed
    createMutation: {
      mutate: createMutation.mutate,
      isPending: createMutation.isPending,
    },
    updateMutation: {
      mutate: updateMutation.mutate,
      isPending: updateMutation.isPending,
    },
    deleteMutation: {
      mutate: deleteMutation.mutate,
      isPending: deleteMutation.isPending,
    },
    isMutating,
    
    // Handlers
    handleConfirm,
  };
}
