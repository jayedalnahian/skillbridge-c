import { Trash2, X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "../modals/confirm-modal";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  onDelete?: (ids: string[]) => void;
  selectedIds?: string[];
}

export function DataTableToolbar<TData>({
  table,
  onSearchChange,
  searchValue: initialSearchValue,
  filters = [],
  onDelete,
  selectedIds = [],
}: DataTableToolbarProps<TData>) {
  const [localSearchValue, setLocalSearchValue] = useState(initialSearchValue);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isFocusedRef = useRef(false);

  // Sync local value with initial value if it changes from outside (e.g. Reset)
  // but avoid overwriting while the user is actively typing.
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalSearchValue(initialSearchValue);
    }
  }, [initialSearchValue]);

  const isFiltered =
    table.getState().columnFilters.length > 0 || !!localSearchValue;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search..."
            value={localSearchValue ?? ""}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
            }}
            onChange={(event) => {
              const value = event.target.value;
              setLocalSearchValue(value);
              onSearchChange?.(value);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <div className="flex items-center gap-2">
            {filters.map(
              (filter) =>
                table.getColumn(filter.columnId) && (
                  <DataTableFacetedFilter
                    key={filter.columnId}
                    column={table.getColumn(filter.columnId)}
                    title={filter.title}
                    options={filter.options}
                  />
                )
            )}
          </div>
          {selectedIds.length > 0 && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(true)}
              className="h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                setLocalSearchValue("");
                onSearchChange?.("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(selectedIds);
          setIsConfirmOpen(false);
          table.resetRowSelection();
        }}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${selectedIds.length} selected items? This action cannot be undone.`}
        confirmText="Delete Selected"
      />
    </>
  );
}
