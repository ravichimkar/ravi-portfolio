import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  Mail,
  UserRound,
} from "lucide-react";

import { AdminPage, Panel, StatusPill } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonCards, SkeletonRows } from "@/components/ui/skeletons";
import { adminQueries } from "@/lib/queries";

export const Route = createFileRoute("/admin/_shell/dashboard")({
  component: DashboardPage,
});

const statCards = [
  {
    key: "totalProjects",
    label: "Total projects",
    icon: FolderKanban,
  },
  {
    key: "publishedProjects",
    label: "Published projects",
    icon: CheckCircle2,
  },
  {
    key: "totalSkills",
    label: "Total skills",
    icon: BriefcaseBusiness,
  },
  {
    key: "certifications",
    label: "Certifications",
    icon: Award,
  },
  {
    key: "unreadMessages",
    label: "Unread messages",
    icon: Mail,
  },
  {
    key: "profileCompletion",
    label: "Profile completion",
    icon: UserRound,
  },
] as const;

function DashboardPage() {
  const query = useQuery(adminQueries.dashboard());

  return (
    <AdminPage
      title="Dashboard"
      description="Live content statistics served by GET /api/admin/dashboard."
      actions={
        <>
          <ActionButton asChild variant="gold" size="sm">
            <Link to="/admin/projects/new">Add project</Link>
          </ActionButton>

          <ActionButton asChild variant="outline" size="sm">
            <Link to="/admin/certifications">Add certification</Link>
          </ActionButton>

          <ActionButton asChild variant="ghost" size="sm">
            <Link to="/admin/messages">View messages</Link>
          </ActionButton>

          <ActionButton asChild variant="ghost" size="sm">
            <Link to="/admin/profile">Edit profile</Link>
          </ActionButton>
        </>
      }
    >
      <AsyncBoundary
        isPending={query.isPending}
        isError={query.isError}
        data={query.data}
        errorMessage="Dashboard statistics are temporarily unavailable."
        onRetry={() => query.refetch()}
        skeleton={
          <div className="space-y-6">
            <SkeletonCards count={6} />
            <SkeletonRows count={3} />
          </div>
        }
      >
        {(data) => (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map(({ key, label, icon: Icon }) => {
                const rawValue = data.stats[key];
                const value =
                  key === "profileCompletion"
                    ? `${rawValue}%`
                    : rawValue;

                return (
                  <div
                    key={key}
                    className="group surface-panel rounded-2xl border border-border p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/30 hover:bg-accent/[0.025] hover:shadow-[0_12px_32px_-22px_var(--accent)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          {label}
                        </p>

                        <p className="mt-3 text-3xl font-semibold tracking-tight text-primary transition-colors duration-200 group-hover:text-primary">
                          {value}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-background/40 p-2.5 transition-all duration-200 group-hover:border-accent/30 group-hover:bg-accent/[0.06]">
                        <Icon className="size-5 text-muted-foreground transition-all duration-200 group-hover:scale-105 group-hover:text-accent" />
                      </div>
                    </div>

                    <div className="mt-5 h-px w-full bg-border/60 transition-colors duration-200 group-hover:bg-accent/20" />
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            <Panel
              title="Recent activity"
              description="Audit trail from the backend."
            >
              {data.recentActivity.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.recentActivity.map((entry) => (
                    <li
                      key={entry.id}
                      className="group flex flex-wrap items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.025]"
                    >
                      <StatusPill tone="gold">{entry.action}</StatusPill>

                      <span className="min-w-0 flex-1 truncate text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                        {entry.entity}
                      </span>

                      <time className="font-mono text-[10px] text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString()}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        )}
      </AsyncBoundary>
    </AdminPage>
  );
}