import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.5)]",
        subtle:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        outline:
          "border border-slate-200 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/70",
        ghost:
          "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-3 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

