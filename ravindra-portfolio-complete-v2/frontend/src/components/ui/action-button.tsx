import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export const actionButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        gold: "bg-primary text-primary-foreground shadow-[var(--glow-gold)] hover:-translate-y-0.5 hover:brightness-108",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:border-accent/60 hover:bg-accent/8 hover:-translate-y-0.5",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
        cyan: "bg-accent/12 text-accent border border-accent/25 hover:bg-accent/18 hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export function ActionButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof actionButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(actionButtonVariants({ variant, size }), className)} {...props} />
  );
}
