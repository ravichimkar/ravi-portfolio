import { cn } from "@/lib/utils";

/** Elegant layout-matching skeletons (no "Loading..." text). */
export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-foreground/[0.06]", className)}
    />
  );
}

export function SkeletonLines({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className={cn("h-3", index === count - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCards({
  count = 3,
  className,
  cardClassName = "h-44",
}: {
  count?: number;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-panel rounded-2xl p-6">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonLines className="mt-4" count={2} />
          <SkeletonBlock className={cn("mt-5 w-full", cardClassName === "h-44" ? "h-8" : cardClassName)} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface-panel flex items-center gap-4 rounded-xl px-5 py-4">
          <SkeletonBlock className="size-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-1/3" />
            <SkeletonBlock className="h-3 w-1/2" />
          </div>
          <SkeletonBlock className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
