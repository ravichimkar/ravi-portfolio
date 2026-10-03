import type { ReactNode } from "react";

import { ActionButton } from "@/components/ui/action-button";

/**
 * Renders skeleton / error / empty / content states for a single async
 * section so one failing endpoint never breaks the whole page.
 */
export function AsyncBoundary<T>({
  isPending,
  isError,
  data,
  errorMessage,
  onRetry,
  skeleton,
  isEmpty,
  empty,
  children,
}: {
  isPending: boolean;
  isError: boolean;
  data: T | undefined;
  errorMessage: string;
  onRetry: () => void;
  skeleton: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (isPending) return <>{skeleton}</>;

  if (isError || data === undefined) {
    return (
      <div className="surface-panel rounded-2xl px-6 py-10 text-center" role="alert">
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="mt-5 flex justify-center">
          <ActionButton variant="outline" size="sm" onClick={onRetry}>
            Retry
          </ActionButton>
        </div>
      </div>
    );
  }

  if (isEmpty?.(data) && empty) return <>{empty}</>;

  return <>{children(data)}</>;
}
