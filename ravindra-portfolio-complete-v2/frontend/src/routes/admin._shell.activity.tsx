import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AdminPage, Panel, StatusPill } from "@/components/admin/admin-ui";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonRows } from "@/components/ui/skeletons";
import { adminQueries } from "@/lib/queries";

export const Route = createFileRoute("/admin/_shell/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const query = useQuery(adminQueries.activity());

  return (
    <AdminPage title="Activity" description="Audit trail from GET /api/admin/activity.">
      <AsyncBoundary
        isPending={query.isPending}
        isError={query.isError}
        data={query.data}
        errorMessage="The activity log is temporarily unavailable."
        onRetry={() => query.refetch()}
        skeleton={<SkeletonRows />}
        isEmpty={(data) => data.length === 0}
        empty={
          <Panel>
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          </Panel>
        }
      >
        {(data) => (
          <ul className="space-y-3">
            {data.map((entry) => (
              <li
                key={entry.id}
                className="surface-panel flex flex-wrap items-center gap-3 rounded-xl px-5 py-4"
              >
                <StatusPill tone="gold">{entry.action}</StatusPill>
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {entry.entity}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{entry.actor}</span>
                <time className="font-mono text-[10px] text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
    </AdminPage>
  );
}
