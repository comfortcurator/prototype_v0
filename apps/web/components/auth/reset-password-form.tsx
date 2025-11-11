"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@project_v0/ui";
import { cn } from "@project_v0/ui";
import { resetPasswordAction } from "@/app/(auth)/actions";

const schema = z.object({
  token: z.string().min(1, "Token is required."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm({ defaultToken }: { defaultToken?: string }) {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: defaultToken
    }
  });

  const onSubmit = (values: FormValues) => {
    setServerErrors({});
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (result?.error) {
        setServerErrors(result.error as Record<string, string[]>);
        return;
      }
      router.push("/login?reset=1");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="token">
          OTP / Token
        </label>
        <input
          id="token"
          className={cn(
            "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
            (errors.token || serverErrors.token?.[0]) && "border-rose-400"
          )}
          {...register("token")}
        />
        {(errors.token?.message || serverErrors.token?.[0]) && (
          <p className="text-xs text-rose-500">
            {errors.token?.message ?? serverErrors.token?.[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          type="password"
          className={cn(
            "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
            (errors.password || serverErrors.password?.[0]) && "border-rose-400"
          )}
          {...register("password")}
        />
        {(errors.password?.message || serverErrors.password?.[0]) && (
          <p className="text-xs text-rose-500">
            {errors.password?.message ?? serverErrors.password?.[0]}
          </p>
        )}
      </div>
      {serverErrors._global?.[0] && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {serverErrors._global[0]}
        </div>
      )}
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Updating..." : "Set new password"}
      </Button>
    </form>
  );
}

