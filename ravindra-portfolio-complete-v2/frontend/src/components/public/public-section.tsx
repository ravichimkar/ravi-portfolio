import type { ReactNode } from "react";

import { Section, SectionHeading } from "@/components/ui/section";
import { SkeletonBlock, SkeletonLines } from "@/components/ui/skeletons";
import { ActionButton } from "@/components/ui/action-button";

/**
 * Wraps a public section so a single failing endpoint degrades that section
 * only — the rest of the portfolio keeps working.
 */
export function PublicSection<T>({
  id,
  ariaLabel,
  eyebrow,
  title,
  isPending,
  isError,
  data,
  onRetry,
  hideWhenEmpty,
  children,
}: {
  id: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  isPending: boolean;
  isError: boolean;
  data: T | undefined;
  onRetry: () => void;
  hideWhenEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
}) {
  if (isPending) {
    return (
      <Section id={id} ariaLabel={ariaLabel}>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-panel rounded-2xl p-6">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonLines className="mt-4" count={3} />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (isError || data === undefined) {
    return (
      <Section id={id} ariaLabel={ariaLabel}>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="surface-panel mt-10 rounded-2xl px-6 py-10 text-center" role="alert">
          <p className="text-sm text-muted-foreground">
            {title} are temporarily unavailable.
          </p>
          <div className="mt-5 flex justify-center">
            <ActionButton variant="outline" size="sm" onClick={onRetry}>
              Retry
            </ActionButton>
          </div>
        </div>
      </Section>
    );
  }

  if (hideWhenEmpty?.(data)) return null;

  return <>{children(data)}</>;
}
