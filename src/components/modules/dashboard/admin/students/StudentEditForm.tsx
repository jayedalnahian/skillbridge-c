"use client";

import { FormField } from "@/components/shared/data-form/data-form";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface StudentEditFormProps {
  form: any;
}

export function StudentEditForm({ form }: StudentEditFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="name"
          label="Name"
          placeholder="Enter student name"
        />
        <FormField
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email address"
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="contactNumber"
          label="Contact Number"
          placeholder="Enter phone number"
        />
        <FormField
          form={form}
          name="profilePhoto"
          label="Profile Photo URL"
          placeholder="Enter profile photo URL (optional)"
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <form.Field name="description">
          {(field: any) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Description</FormLabel>
              <FormControl>
                <Textarea
                  id={field.name}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter student description..."
                  rows={4}
                  className={cn(
                    "resize-none",
                    field.state.meta.errors.length && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormControl>
              {field.state.meta.errors.length > 0 && (
                <FormMessage>
                  {field.state.meta.errors[0]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        </form.Field>
      </div>
    </div>
  );
}
