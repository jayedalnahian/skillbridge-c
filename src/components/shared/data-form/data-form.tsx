"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { type UseMutationResult } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface SmartFormProps<TData extends Record<string, any>, TMutationData, TMutationInput = TData> {
  schema: z.ZodType<TData>
  mutation: UseMutationResult<TMutationData, any, TMutationInput>
  defaultValues: TData
  onSuccess?: (data: TMutationData) => void
  children: (form: any) => React.ReactNode
  submitLabel?: string
  className?: string
  transform?: (value: TData) => TMutationInput
}

/**
 * SmartForm: A high-level wrapper that integrates TanStack Form with TanStack Query.
 * Handles validation, loading states, and submission automatically.
 */
export function SmartForm<TData extends Record<string, any>, TMutationData, TMutationInput = TData>({
  schema,
  mutation,
  defaultValues,
  onSuccess,
  children,
  submitLabel = "Submit",
  className,
  transform,
}: SmartFormProps<TData, TMutationData, TMutationInput>) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema as any,
    },
    onSubmit: async ({ value }) => {
      
      
      // Strip fields not in the edit form (availability fields handled elsewhere)
      const { availabilityStartTime, availabilityEndTime, availableDays, ...formData } = value
      
      // Apply custom transform if provided, otherwise use stripped formData
      const mutationData = transform ? transform(value) : formData as unknown as TMutationInput
      
      
      mutation.mutate(mutationData, {
        onSuccess: (data) => {
          
          onSuccess?.(data)
        },
        onError: (error) => {
          console.error(" mutation onError:", error)
        },
      })
    },
  })



  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
      
        
        // Log field-level errors
        Object.entries(form.state.fieldMeta).forEach(([field, meta]) => {
          const fieldMeta = meta as { errors?: string[] }
          if (fieldMeta?.errors?.length) {
            console.log(`[SmartForm] Field "${field}" errors:`, fieldMeta.errors)
          }
        })
        
        try {
          const result = await form.handleSubmit()
          console.log("[SmartForm] handleSubmit completed successfully, result:", result)
        } catch (error) {
          console.error("[SmartForm] handleSubmit error:", error)
        }
      }}
      className={className}
    >
      <div className="space-y-6">
        {children(form)}

        {/* Global Mutation Error Display */}
        {mutation.isError && (
          <FormMessage className="text-center">
            {mutation.error instanceof Error 
              ? mutation.error.message 
              : "An unexpected error occurred. Please try again."}
          </FormMessage>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => console.log("[SmartForm] Submit button clicked")}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

interface FormFieldProps<TData extends Record<string, any>> {
  form: any
  name: any
  label: string
  placeholder?: string
  type?: string
  description?: string
  render?: (field: any) => React.ReactNode
}

/**
 * FormField: A modular field wrapper that connects TanStack Form state to Shadcn UI.
 * Handles real-time validation and accessibility.
 */
export function FormField<TData extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  type = "text",
  render,
}: FormFieldProps<TData>) {
  return (
    <form.Field
      name={name}
      children={(field: any) => (
        <FormItem>
          <FormLabel htmlFor={field.name}>{label}</FormLabel>
          <FormControl>
            {render ? (
              render(field)
            ) : (
              <Input
                id={field.name}
                placeholder={placeholder}
                type={type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                const value = e.target.value;
                if (type === "number") {
                  field.handleChange(value === "" ? "" : Number(value));
                } else {
                  field.handleChange(value);
                }
              }}
                className={field.state.meta.errors.length ? "border-destructive focus-visible:ring-destructive" : ""}
              />
            )}
          </FormControl>
          {field.state.meta.errors && field.state.meta.errors.length > 0 && (
            <FormMessage>
              {field.state.meta.errors
                .map((err: unknown) => {
                  if (typeof err === "string") return err;
                  if (err && typeof err === "object" && "message" in err) {
                    return String((err as { message: unknown }).message);
                  }
                  return String(err);
                })
                .join(", ")}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}
