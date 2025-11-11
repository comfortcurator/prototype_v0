import Link from "next/link";
import { auth } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  const allowAdminCreation = session?.user.role === "admin";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Create your Marcus Aurelius account
        </h1>
        <p className="text-sm text-slate-500">
          Join India&apos;s premium Airbnb operations network.
        </p>
      </div>
      <RegisterForm allowAdminOption={allowAdminCreation} />
      <p className="text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-slate-900">
          Sign in
        </Link>
      </p>
    </div>
  );
}

