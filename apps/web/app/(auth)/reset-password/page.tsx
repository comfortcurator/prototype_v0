import { ResetPasswordForm } from "@/components/auth/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedParams = await searchParams;
  const tokenParam = resolvedParams.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Enter your OTP
        </h1>
        <p className="text-sm text-slate-500">
          Paste the token you received via SMS or email and choose a new password.
        </p>
      </div>
      <ResetPasswordForm defaultToken={token} />
    </div>
  );
}

