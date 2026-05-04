"use client";

import { UseMutationResult } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { createAdminSchema } from "./adminValidators";
import { z } from "zod";

type CreateAdminInput = z.infer<typeof createAdminSchema>;

interface AdminCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<any, Error, CreateAdminInput>;
}

export function AdminCreateModal({
  isOpen,
  onClose,
  createMutation,
}: AdminCreateModalProps) {
  const defaultValues: CreateAdminInput = {
    password: "",
    admin: {
      name: "",
      email: "",
      profilePhoto: "",
      contactNumber: "",
      address: "",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#00ADB5]">Create New Admin</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new admin.
          </DialogDescription>
        </DialogHeader>
        <SmartForm
          schema={createAdminSchema}
          mutation={createMutation}
          defaultValues={defaultValues}
          onSuccess={() => {
            onClose();
          }}
          submitLabel="Create Admin"
        >
          {(form) => (
            <div className="grid gap-4 py-4">
              {/* Basic Info */}
                <FormField
                  form={form}
                  name="admin.name"
                  label="Name *"
                  placeholder="Enter name"
                />
                <FormField
                  form={form}
                  name="admin.email"
                  label="Email *"
                  type="email"
                  placeholder="Enter email"
                />
            

              {/* Password */}
              <FormField
                form={form}
                name="password"
                label="Password *"
                type="password"
                placeholder="Enter password (min 6 chars, uppercase, lowercase, number, special char)"
              />

              <FormField
                form={form}
                name="admin.contactNumber"
                label="Contact Number"
                placeholder="Enter contact number"
              />

              <FormField
                form={form}
                name="admin.address"
                label="Address"
                placeholder="Enter address"
              />

              <FormField
                form={form}
                name="admin.profilePhoto"
                label="Profile Photo URL"
                placeholder="Enter profile photo URL"
              />
            </div>
          )}
        </SmartForm>
      </DialogContent>
    </Dialog>
  );
}
