"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/app/(commonRoutes)/(authRoutes)/forgot-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordZodSchema, IForgotPasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
        } as IForgotPasswordPayload,

        onSubmit: async ({ value }) => {
            setServerError(null);
            setIsPending(true);
            
            const result = await forgotPasswordAction(value) as any;
            
            setIsPending(false);
            
            if (!result.success) {
                setServerError(result.message || "Failed to send reset code");
            } else {
                toast.success("Reset code sent to your email");
            }
        }
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
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
                    <form.Field
                        name="email"
                        validators={{ onChange: forgotPasswordZodSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your registered email"
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
                                pendingLabel="Sending Code..." 
                                disabled={!canSubmit}
                            >
                                Send Reset Code
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Remembered your password?{" "}
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

export default ForgotPasswordForm;
