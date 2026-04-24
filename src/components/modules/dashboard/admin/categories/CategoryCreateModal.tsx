"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { Textarea } from "@/components/ui/textarea";
import { createCategorySchema } from "./categoryValidators";
import { CategoryCreateModalProps } from "./categoryTypes";




export function CategoryCreateModal({
  isOpen,
  onClose,
  createMutation,
}: CategoryCreateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#00ADB5]">Create New Category</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new category.
          </DialogDescription>
        </DialogHeader>
        <SmartForm
          schema={createCategorySchema}
          mutation={createMutation}
          defaultValues={{ name: "", slug: "", description: "" }}
          onSuccess={() => {
            onClose();
          }}
          submitLabel="Create Category"
        >
          {(form) => (
            <div className="grid gap-4 py-4">
              <FormField
                form={form}
                name="name"
                label="Category Name"
                placeholder="Enter category name"
              />
              <FormField
                form={form}
                name="slug"
                label="Slug"
                placeholder="Enter slug (e.g., electronics)"
              />
              <FormField
                form={form}
                name="description"
                label="Description"
                render={(field) => (
                  <Textarea
                    id={field.name}
                    placeholder="Enter category description"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={
                      field.state.meta.errors.length
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                )}
              />
            </div>
          )}
        </SmartForm>
      </DialogContent>
    </Dialog>
  );
}
