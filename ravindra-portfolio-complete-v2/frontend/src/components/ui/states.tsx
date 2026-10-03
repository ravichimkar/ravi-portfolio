import type { ReactNode } from "react";

import { ActionButton } from "@/components/ui/action-button";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-16">
      <span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="text-sm text-muted-foreground">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface-panel rounded-2xl px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  children,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="surface-panel rounded-2xl px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-6 flex justify-center gap-3">
        {onRetry ? (
          <ActionButton variant="gold" size="sm" onClick={onRetry}>
            Try again
          </ActionButton>
        ) : null}
        {children}
      </div>
    </div>
  );
}
