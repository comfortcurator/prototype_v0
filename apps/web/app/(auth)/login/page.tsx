import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@project_v0/ui";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  async function handleGoogleLogin() {
    "use server";
    const searchParams = new URLSearchParams({
      callbackUrl: "/dashboard"
    });
    redirect(`/api/auth/signin/google?${searchParams.toString()}`);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome back to project_v0
        </h1>
        <p className="text-sm text-slate-500">
          Sign in to manage your Marcus Aurelius collection.
        </p>
      </div>
      <LoginForm />
      <form action={handleGoogleLogin}>
        <Button type="submit" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </form>
      <div className="flex flex-col gap-2 text-xs text-slate-500">
        <Link href="/forgot-password" className="hover:text-slate-900">
          Forgot your password?
        </Link>
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-slate-900">
            Create one
          </Link>
        </span>
      </div>
    </div>
  );
}

