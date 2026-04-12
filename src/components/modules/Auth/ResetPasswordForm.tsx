"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetPasswordAction } from "@/app/(commonRoutes)/(authRoutes)/reset-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { IResetPasswordPayload, resetPasswordZodSchema, resetPasswordBaseSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    } as IResetPasswordPayload,

    onSubmit: async ({ value }) => {
      setServerError(null);
      setIsPending(true);

      const result = (await resetPasswordAction(value)) as any;

      setIsPending(false);

      if (!result.success) {
        setServerError(result.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully. Please login.");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email and set your new password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Email Field - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className="bg-muted"
            />
          </div>

          {/* OTP Input */}
          <form.Field
            name="otp"
            validators={{ onChange: resetPasswordBaseSchema.shape.otp }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="otp">Reset Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    onBlur={field.handleBlur}
                    disabled={isPending}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive text-center">
                    {field.state.meta.errors[0]?.message || "Invalid code"}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* New Password */}
          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordBaseSchema.shape.newPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {/* Confirm Password */}
          <form.Field
            name="confirmPassword"
            validators={{ onChange: resetPasswordBaseSchema.shape.confirmPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Resetting Password..."
                disabled={!canSubmit}
              >
                Reset Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Suddenly remembered?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Back to Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
