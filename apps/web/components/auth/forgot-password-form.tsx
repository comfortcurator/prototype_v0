"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@project_v0/ui";
import { cn } from "@project_v0/ui";
import { requestPasswordResetAction } from "@/app/(auth)/actions";

const schema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      if (result?.token) {
        setToken(result.token);
      } else {
        setToken(null);
      }
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
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Requesting..." : "Send OTP"}
      </Button>
      {token && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          Temporary token (for local dev): <span className="font-mono">{token}</span>
        </div>
      )}
    </form>
  );
}

