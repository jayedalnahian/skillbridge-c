"use client";

import { useState } from "react";
import { Check, Copy, Eye, MoreHorizontal, Pen, Trash2 } from "lucide-react";
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
  onDelete?: (ids: string[]) => void;
  onPermanentDelete?: (id: string) => void;
}

export function DataTableRowActions<TData>({
  row,
  table,
  onEdit,
  onDelete,
  onPermanentDelete,
}: DataTableRowActionsProps<TData>) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  // Cast row.original to access id and other properties
  const item = row.original as Record<string, any>;

  // Retrieve configs from table meta
  const tableMeta = table.options.meta as any;
  const editConfig = tableMeta?.editConfig;
  const viewConfig = tableMeta?.viewConfig;
  const metaOnDelete = tableMeta?.onDelete;
  const metaOnPermanentDelete = tableMeta?.onPermanentDelete;

  // Use prop if provided, otherwise fallback to meta
  const unresolvedOnDelete = onDelete || metaOnDelete;
  const unresolvedOnPermanentDelete = onPermanentDelete || metaOnPermanentDelete;

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
                Delete
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

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
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

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Information</DialogTitle>
            <DialogDescription>
              Make changes to your information over here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {editConfig ? (
            <SmartForm
              schema={editConfig.schema}
              mutation={editConfig.mutation}
              defaultValues={item}
              onSuccess={(data) => {
                editConfig.onSuccess?.(data);
                setIsEditOpen(false);
              }}
              submitLabel={editConfig.submitLabel || "Save changes"}
            >
              {(form) => editConfig.children(form)}
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
              <DialogFooter>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
