import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <VerifyEmailForm email={email} />
    </div>
  );
}
