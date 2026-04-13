"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ICategory, ICategoryCreateInput } from "@/types/category.types";
import { useEffect, useState } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ICategory | null;
  mode: "view" | "edit" | "delete" | "create";
  onConfirm?: (data: any) => void;
  isLoading?: boolean;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  category,
  mode,
  onConfirm,
  isLoading,
}: CategoryModalProps) => {
  const [formData, setFormData] = useState<ICategoryCreateInput>({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (category && (mode === "edit" || mode === "view")) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(formData);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Category Details";
      case "edit":
        return "Edit Category";
      case "delete":
        return category?.isDeleted ? "Restore Category" : "Delete Category";
      case "create":
        return "Create New Category";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#222831] border-[#393E46] shadow-2xl shadow-black/50">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "delete"
              ? category?.isDeleted
                ? "Are you sure you want to restore this category?"
                : "Are you sure you want to delete this category?"
              : "Fill in the details for the category."}
          </DialogDescription>
        </DialogHeader>

        {mode === "delete" ? (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant={category?.isDeleted ? "default" : "destructive"}
              className={category?.isDeleted ? "bg-[#00ADB5] hover:bg-[#008f96] text-white" : ""}
              onClick={() => onConfirm?.(category?.id)}
              disabled={isLoading}
            >
              {isLoading 
                ? (category?.isDeleted ? "Restoring..." : "Deleting...") 
                : (category?.isDeleted ? "Restore" : "Delete")}
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                disabled={mode === "view" || isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                disabled={mode === "view" || isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                disabled={mode === "view" || isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                {mode === "view" ? "Close" : "Cancel"}
              </Button>
              {mode !== "view" && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : mode === "create"
                    ? "Create"
                    : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
