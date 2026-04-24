"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledSoftDelete: boolean;
  onSoftDelete?: () => void;
  onPermanentDelete?: () => void;
  loading?: boolean;
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  enabledPermanentDelete: boolean;
  permanentDeleteText?: string;
  onPermanentDeleteLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  enabledSoftDelete = true,
  onSoftDelete,
  onPermanentDelete,
  loading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  enabledPermanentDelete = false,
  permanentDeleteText = "Permanently Delete",
}: ConfirmModalProps) => {


  const handleSoftDelete = () => {
    onSoftDelete?.();
  };

  const handlePermanentDelete = () => {
    onPermanentDelete?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2 text-2xl font-semibold text-red-700">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4">
          <Button
            disabled={loading}
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          {
            enabledSoftDelete && (
              <Button
                disabled={loading}
                variant={variant}
                onClick={handleSoftDelete}
                className="w-full sm:w-auto bg-red-100 text-red-700 hover:bg-red-200"
              >
                {loading ? "Processing..." : confirmText}
              </Button>
            )
          }
          {enabledPermanentDelete && (
            <Button
              disabled={loading}
              variant={variant}
              onClick={handlePermanentDelete}
              className="w-full sm:w-auto bg-red-100 text-red-700 hover:bg-red-200"
            >
              {loading ? "Processing..." : permanentDeleteText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
