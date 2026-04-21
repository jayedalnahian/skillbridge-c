"use client";

import { getAllTutors, createTutor, updateTutor, deleteTutor } from "@/services/tutor.service";
import { getAllCategories } from "@/services/category.service";
import { ITutorWithRelations, ITutorCreateInput, ITutorUpdateInput } from "@/types/tutor.types";
import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import DataTable from "@/components/shared/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { TutorModal } from "@/components/modules/dashboard/admin/TutorModal";
import { DataTableFilterValues } from "@/components/shared/data-table/DataTableFilters";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import { tutorColumns } from "@/components/modules/dashboard/admin/tutors/TutorColumns";
import { tutorFilterConfigs } from "@/components/modules/dashboard/admin/tutors/TutorFilters";

const AdminTutorsPage = () => {
  // --- CRUD Hook ---
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchTerm,
    setSearchTerm,
    resetPagination,
    modalOpen,
    modalMode,
    selectedItem: selectedTutor,
    openModal,
    closeModal,
    handleConfirm,
    isMutating,
  } = useAdminCrud<ITutorWithRelations, ITutorCreateInput, ITutorUpdateInput>({
    queryKey: "tutors",
    createFn: createTutor,
    updateFn: updateTutor,
    deleteFn: deleteTutor,
  });

  // --- Local State ---
  const [filterValues, setFilterValues] = useState<DataTableFilterValues>({});

  // --- Data Fetching ---
  const { data: tutorResponse, isLoading, isFetching } = useQuery({
    queryKey: ["tutors", pagination, sorting, searchTerm, filterValues],
    queryFn: () =>
      getAllTutors({
        page: String(pagination.pageIndex + 1),
        limit: String(pagination.pageSize),
        searchTerm: searchTerm || undefined,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        isDeleted: filterValues.isDeleted as string | undefined,
        educationLevel: filterValues.educationLevel as string | undefined,
      }),
  });

  // --- Fetch Categories for Modal ---
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories-for-tutors"],
    queryFn: () => getAllCategories({ limit: "100", isDeleted: "false" }),
  });

  const categories = categoriesResponse?.data || [];

  // --- Columns ---
  const columns = useMemo(() => tutorColumns, []);

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tutors Management</h1>
          <p className="text-muted-foreground">Manage all tutors, verify credentials, and handle statuses.</p>
        </div>
        <Button onClick={() => openModal("create")} className="bg-[#00ADB5] hover:bg-[#008f96]">
          <Plus className="mr-2 h-4 w-4" />
          Add Tutor
        </Button>
      </div>

      {isLoading && !tutorResponse ? (
        <div className="flex h-[400px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#00ADB5]" />
        </div>
      ) : (
        <DataTable
          data={tutorResponse?.data || []}
          columns={columns}
          isLoading={isFetching}
          meta={tutorResponse?.meta}
          pagination={{
              state: pagination,
              onPaginationChange: setPagination,
          }}
          sorting={{
              state: sorting,
              onSortingChange: setSorting,
          }}
          search={{
              placeholder: "Search tutors...",
              onDebouncedChange: setSearchTerm,
          }}
          filters={{
            configs: tutorFilterConfigs,
            values: filterValues,
            onFilterChange: (id, value) => {
              setFilterValues((prev) => ({ ...prev, [id]: value }));
              resetPagination();
            },
            onClearAll: () => setFilterValues({}),
          }}
          actions={{
            onView: (tutor) => openModal("view", tutor),
            onEdit: (tutor) => openModal("edit", tutor),
            onDelete: (tutor) => openModal("delete", tutor),
          }}
        />
      )}

      <TutorModal
        isOpen={modalOpen}
        onClose={closeModal}
        tutor={selectedTutor}
        mode={modalMode}
        onConfirm={handleConfirm}
        isLoading={isMutating}
        categories={categories}
      />
    </div>
  );
};

export default AdminTutorsPage;

