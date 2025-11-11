import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Reset your password
        </h1>
        <p className="text-sm text-slate-500">
          Enter the email associated with your account. We&apos;ll send an OTP to
          reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-xs text-slate-500">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-slate-900">
          Return to sign in
        </Link>
      </p>
    </div>
  );
}

