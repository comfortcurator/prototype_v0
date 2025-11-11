"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@project_v0/ui";
import { cn } from "@project_v0/ui";
import { registerAction } from "@/app/(auth)/actions";

const schema = z.object({
  name: z.string().min(2, "Name too short."),
  email: z.string().email(),
  phone: z.string().regex(/^\+91[1-9]\d{9}$/, "Use +91XXXXXXXXXX format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["host", "admin"])
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm({ allowAdminOption }: { allowAdminOption?: boolean }) {
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
      role: "host"
    }
  });

  const onSubmit = (values: FormValues) => {
    setServerErrors({});
    startTransition(async () => {
      const result = await registerAction(values);
      if (result?.error) {
        setServerErrors(result.error as Record<string, string[]>);
        return;
      }
      router.push("/login?registered=1");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            className={cn(
              "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              errors.name && "border-rose-400"
            )}
            {...register("name")}
          />
          {(errors.name?.message || serverErrors.name?.[0]) && (
            <p className="text-xs text-rose-500">
              {errors.name?.message ?? serverErrors.name?.[0]}
            </p>
          )}
        </div>
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
          {(errors.email?.message || serverErrors.email?.[0]) && (
            <p className="text-xs text-rose-500">
              {errors.email?.message ?? serverErrors.email?.[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="phone">
            Phone (+91)
          </label>
          <input
            id="phone"
            placeholder="+919123456789"
            className={cn(
              "w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100",
              errors.phone && "border-rose-400"
            )}
            {...register("phone")}
          />
          {(errors.phone?.message || serverErrors.phone?.[0]) && (
            <p className="text-xs text-rose-500">
              {errors.phone?.message ?? serverErrors.phone?.[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            Password
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Account type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:border-indigo-500",
                (errors.role?.message || serverErrors.role?.[0]) && "border-rose-400"
              )}
            >
              <input
                type="radio"
                value="host"
                className="hidden"
                {...register("role")}
                defaultChecked
              />
              <span className="font-semibold text-slate-900">Host</span>
              <span className="text-xs text-slate-500">
                Manage your own Marcus Aurelius portfolio.
              </span>
            </label>
            <label
              className={cn(
                "flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm transition hover:border-indigo-500",
                allowAdminOption
                  ? (errors.role?.message || serverErrors.role?.[0])
                    ? "border-rose-400"
                    : ""
                  : "cursor-not-allowed opacity-50"
              )}
            >
              <input
                type="radio"
                value="admin"
               className="hidden"
                {...register("role")}
                disabled={!allowAdminOption}
              />
              <span className="font-semibold text-slate-900">Admin</span>
              <span className="text-xs text-slate-500">
                Curate inventory, packages, and subscriptions.
              </span>
              {!allowAdminOption && (
                <span className="text-[10px] text-slate-400">
                  Only admins can invite new admins.
                </span>
              )}
            </label>
          </div>
          {allowAdminOption && (errors.role?.message || serverErrors.role?.[0]) && (
            <p className="text-xs text-rose-500">
              {errors.role?.message ?? serverErrors.role?.[0]}
            </p>
          )}
        </div>
      </div>
      {serverErrors._global?.[0] && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {serverErrors._global[0]}
        </div>
      )}
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

