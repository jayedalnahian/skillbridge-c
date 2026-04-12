import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { redirect } from "next/navigation";

interface ResetPasswordParams {
  searchParams: Promise<{ email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordParams) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <div className="flex items-center justify-center min-vh-100 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm email={email} />
    </div>
  );
}
