"use client";

import { FormField } from "@/components/shared/data-form/data-form";
import { Textarea } from "@/components/ui/textarea";

interface CategoryEditFormProps {
  form: any;
}

export function CategoryEditForm({ form }: CategoryEditFormProps) {
  return (
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
        placeholder="Enter slug"
      />
      <FormField
        form={form}
        name="description"
        label="Description"
        render={(field) => (
          <Textarea
            id={field.name}
            placeholder="Optional description"
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
  );
}
