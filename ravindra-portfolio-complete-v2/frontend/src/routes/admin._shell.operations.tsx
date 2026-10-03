import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { API_BASE_URL, USE_MOCK_API } from "@/api/client";
import type { HealthState } from "@/api/types";
import { AdminPage, Panel, StatusPill } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";
import { adminQueries } from "@/lib/queries";

export const Route = createFileRoute("/admin/_shell/operations")({
  component: OperationsPage,
});

function HealthRow({ label, state }: { label: string; state: HealthState | "UNKNOWN" }) {
  const tone = state === "UP" ? "cyan" : state === "DEGRADED" ? "gold" : state === "DOWN" ? "danger" : "muted";
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <StatusPill tone={tone}>{state === "UNKNOWN" ? "Unable to verify" : state}</StatusPill>
    </div>
  );
}

function OperationsPage() {
  const query = useQuery(adminQueries.health());
  const health = query.data;

  return (
    <AdminPage
      title="Operations"
      description="Application health reported by GET /api/admin/operations/health. No credentials or server controls are exposed here."
      actions={
        <ActionButton variant="outline" size="sm" onClick={() => query.refetch()}>
          Re-check
        </ActionButton>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Service health">
          <HealthRow label="Frontend" state="UP" />
          <HealthRow label="Backend API" state={health?.api ?? "UNKNOWN"} />
          <HealthRow label="Database" state={health?.database ?? "UNKNOWN"} />
        </Panel>

        <Panel title="Environment">
          <dl className="space-y-3 text-sm">
            {[
              ["API base URL", API_BASE_URL || "not configured"],
              ["Mode", USE_MOCK_API ? "Mock API (no backend connected)" : "Live REST API"],
              ["Version", health?.version ?? "Unable to verify"],
              ["Environment", health?.environment ?? "Unable to verify"],
              [
                "API response time",
                health?.responseTimeMs !== undefined ? `${health.responseTimeMs} ms` : "Unable to verify",
              ],
              [
                "Last successful check",
                query.isSuccess ? new Date(query.dataUpdatedAt).toLocaleString() : "Never",
              ],
              ["Last content update", health?.lastContentUpdate ?? "Unable to verify"],
            ].map(([term, value]) => (
              <div key={term} className="flex flex-wrap justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="font-mono text-xs break-all">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {query.isError ? (
        <p className="mt-5 rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
          Degraded: the backend health endpoint could not be reached, so live status cannot be
          verified. {query.error instanceof Error ? query.error.message : ""}
        </p>
      ) : null}
    </AdminPage>
  );
}
