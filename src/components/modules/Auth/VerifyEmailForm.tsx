"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyEmailAction } from "@/app/(commonRoutes)/(authRoutes)/verify-email/_action";
import { resendOTPAction } from "@/app/(commonRoutes)/(authRoutes)/verify-email/_resendAction";
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
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/verifyEmail.validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VerifyEmailFormProps {
  email: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    const result = await resendOTPAction(email);
    setIsResending(false);

    if (result.success) {
      toast.success(result.message);
      setCountdown(RESEND_COOLDOWN_SECONDS);
    } else {
      toast.error(result.message || "Failed to resend code");
    }
  };

  const form = useForm({
    defaultValues: {
      email: email,
      otp: "",
    } as IVerifyEmailPayload,

    onSubmit: async ({ value }) => {
      setServerError(null);
      setIsPending(true);

      const result = await verifyEmailAction(value) as any;

      setIsPending(false);

      if (!result.success) {
        setServerError(result.message || "Verification failed");
      }
      // On success, redirect is handled by server action - no code needed here
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to your email
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
            validators={{ onChange: verifyEmailZodSchema.shape.otp }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
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

          {/* Resend Code Link */}
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResending}
              className="text-sm"
            >
              {isResending
                ? "Sending..."
                : countdown > 0
                ? `Resend code in ${countdown}s`
                : "Didn't receive code? Resend"}
            </Button>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting || isPending}
              >
                {isSubmitting || isPending
                  ? "Verifying..."
                  : "Verify Email"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailForm;
