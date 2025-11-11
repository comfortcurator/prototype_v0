"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "@project_v0/ui";
import { cn } from "@project_v0/ui";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl
      });
      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        return;
      }
      router.push(callbackUrl);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={cn(
            "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
            errors.email && "border-rose-400"
          )}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-rose-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={cn(
            "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
            errors.password && "border-rose-400"
          )}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-rose-500">{errors.password.message}</p>
        )}
      </div>
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

