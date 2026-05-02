"use client";

import { useState } from "react";
import { Check, Copy, Eye, MoreHorizontal, Pen, RotateCcw, Trash2 } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartForm } from "@/components/shared/data-form/data-form";
import { ConfirmModal } from "@/components/shared/modals/confirm-modal";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
  onEdit?: (value: TData) => void;
  onSoftDelete?: (ids: string[]) => void;
  onPermanentDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export function DataTableRowActions<TData>({
  row,
  table,
  onEdit,
  onPermanentDelete,
  onRestore,
}: DataTableRowActionsProps<TData>) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  // Cast row.original to access id and other properties
  const item = row.original as Record<string, any>;

  // Retrieve configs from table meta
  const tableMeta = table.options.meta as any;
  const editConfig = tableMeta?.editConfig;
  const viewConfig = tableMeta?.viewConfig;
  const metaOnPermanentDelete = tableMeta?.onPermanentDelete;
  const metaOnRestore = tableMeta?.onRestore;


  // Use prop if provided, otherwise fallback to meta
  const unresolvedOnDelete = onPermanentDelete || metaOnPermanentDelete;
  const unresolvedOnPermanentDelete = onPermanentDelete || metaOnPermanentDelete;
  const unresolvedOnRestore = onRestore || metaOnRestore;

  // Check if category is deleted
  const isDeleted = item.isDeleted === true;

  const handleRestore = () => {
    unresolvedOnRestore?.(item.id as string);
    setIsRestoreOpen(false);
    table.resetRowSelection();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center cursor-pointer justify-center rounded-md border border-input bg-background p-0 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          {unresolvedOnDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                P. Delete
              </DropdownMenuItem>
            </>
          )}
          {unresolvedOnRestore && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsRestoreOpen(true)}
                disabled={!isDeleted}
                className="text-green-600 focus:text-green-600 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        enabledSoftDelete={false}
        enabledPermanentDelete={true}
        onPermanentDelete={() => {
          unresolvedOnPermanentDelete?.(item.id as string);
          setIsDeleteOpen(false);
          table.resetRowSelection();
        }}
        title="Delete Record"
        description="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
      />

      <ConfirmModal
        isOpen={isRestoreOpen}
        onClose={() => setIsRestoreOpen(false)}
        enabledSoftDelete={false}
        enabledPermanentDelete={true}
        onPermanentDelete={handleRestore}
        title="Restore Record"
        description="Are you sure you want to restore this category?"
        confirmText="Restore"
        permanentDeleteText="Restore"
      />

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px] mt-2">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
            <DialogDescription>
              Viewing full information for this record.
            </DialogDescription>
          </DialogHeader>

          {viewConfig ? (
            <div className="py-2">{viewConfig.children(item as any)}</div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">Name:</span>
                <span className="col-span-3">
                  {(item.name as string) || (item.title as string) || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-bold">ID:</span>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    readOnly
                    value={item.id as string}
                    className="text-xs font-mono bg-muted h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => copyText(String(item.id))}
                  >
                    {hasCopiedRecently ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mb-2">
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
            <DialogTitle>Edit Information</DialogTitle>
            <DialogDescription>
              Make changes to your information over here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-2">
            {editConfig ? (
                <SmartForm
                  schema={editConfig.schema}
                  mutation={editConfig.mutation}
                  defaultValues={{ ...item, categories: item.categories || [] }}
                  onSuccess={(data) => {
                    editConfig.onSuccess?.(data);
                    setIsEditOpen(false);
                  }}
                  submitLabel={editConfig.submitLabel || "Save changes"}
                >
                {(form) => editConfig.children(form, item)}
                </SmartForm>
            ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue={item.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="desc"
                    defaultValue={item.description}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onEdit?.(item as TData);
                    setIsEditOpen(false);
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
