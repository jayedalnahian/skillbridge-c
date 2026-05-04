"use client";

import { FormField } from "@/components/shared/data-form/data-form";

interface AdminEditFormProps {
  form: any;
  adminId: string;
}

export function AdminEditForm({ form, adminId }: AdminEditFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="name"
          label="Name"
          placeholder="Enter admin name"
        />
        <FormField
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email address"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          form={form}
          name="contactNumber"
          label="Contact Number"
          placeholder="Enter contact number"
        />
        <FormField
          form={form}
          name="address"
          label="Address"
          placeholder="Enter address"
        />
      </div>

      <FormField
        form={form}
        name="profilePhoto"
        label="Profile Photo URL"
        placeholder="Enter profile photo URL"
      />
    </div>
  );
}
