"use client";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";
import { ICategory, ICategoryCreateInput, ICategoryUpdateInput } from "@/types/category.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Plus, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import DataTable from "@/components/shared/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/modules/dashboard/admin/CategoryModal";
import { DataTableFilterConfig, DataTableFilterValues } from "@/components/shared/data-table/DataTableFilters";

const AdminCategoriesPage = () => {
  const queryClient = useQueryClient();

  // --- Table State ---
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<DataTableFilterValues>({});

  // --- Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create">("view");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  // --- Filter Config ---
  const filterConfigs: DataTableFilterConfig[] = [
    {
      id: "isDeleted",
      label: "Deleted",
      type: "single-select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  ];

  // --- Data Fetching ---
  const { data: categoryResponse, isLoading, isFetching } = useQuery({
    queryKey: ["categories", pagination, sorting, searchTerm, filterValues],
    queryFn: () =>
      getAllCategories({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
        searchTerm: searchTerm || undefined,
        sortBy: sorting.length > 0 ? sorting[0].id : undefined,
        sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        isDeleted: typeof filterValues.isDeleted === "string" ? filterValues.isDeleted : undefined,
      }),
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (data: ICategoryCreateInput) => createCategory(data),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to create category");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(result.message || "Category created successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICategoryUpdateInput }) =>
      updateCategory(id, data),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to update category");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(result.message || "Category updated successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to delete category");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(result.message || "Category deleted successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });

  // --- Modal Handlers ---
  const openModal = (mode: typeof modalMode, category?: ICategory) => {
    setModalMode(mode);
    setSelectedCategory(category || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleConfirm = (data: any) => {
    if (modalMode === "create") {
      createMutation.mutate(data);
    } else if (modalMode === "edit" && selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data });
    } else if (modalMode === "delete" && selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  // --- Table Columns ---
  const columns = useMemo<ColumnDef<ICategory>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "slug",
        header: "Slug",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate" title={row.original.description}>
            {row.original.description}
          </div>
        ),
      },
      {
        accessorKey: "isDeleted",
        header: "Deleted",
        cell: ({ row }) => (
          <div className={`px-2 py-1 rounded-full text-xs w-fit ${row.original.isDeleted ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
            {row.original.isDeleted ? "Yes" : "No"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Course Categories</h1>
          <p className="text-muted-foreground">Manage teaching subjects and course categories.</p>
        </div>
        <Button onClick={() => openModal("create")} className="bg-[#00ADB5] hover:bg-[#008f96]">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {isLoading && !categoryResponse ? (
        <div className="flex h-[400px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#00ADB5]" />
        </div>
      ) : (
        <DataTable
          data={categoryResponse?.data || []}
          columns={columns}
          isLoading={isFetching}
          meta={categoryResponse?.meta}
          pagination={{
              state: pagination,
              onPaginationChange: setPagination,
          }}
          sorting={{
              state: sorting,
              onSortingChange: setSorting,
          }}
          search={{
              placeholder: "Search categories...",
              onDebouncedChange: setSearchTerm,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValues,
            onFilterChange: (id, value) => {
              setFilterValues((prev) => ({ ...prev, [id]: value }));
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            },
            onClearAll: () => setFilterValues({}),
          }}
          actions={{
            onView: (category) => openModal("view", category),
            onEdit: (category) => openModal("edit", category),
            onDelete: (category) => openModal("delete", category),
          }}
        />
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={closeModal}
        category={selectedCategory}
        mode={modalMode}
        onConfirm={handleConfirm}
        isLoading={
          createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
        }
      />
    </div>
  );
};

export default AdminCategoriesPage;
