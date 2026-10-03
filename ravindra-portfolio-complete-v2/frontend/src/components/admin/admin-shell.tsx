import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Award,
  Bell,
  Briefcase,
  FolderKanban,
  GaugeCircle,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "@/auth/auth-context";
import { adminQueries } from "@/lib/queries";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/achievements", label: "Achievements", icon: Award },
  { to: "/admin/social-links", label: "Social Links", icon: Link2 },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/operations", label: "Operations", icon: GaugeCircle },
  { to: "/admin/activity", label: "Activity", icon: Activity },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => setOpen(false), [pathname]);

  const dashboard = useQuery({
    ...adminQueries.dashboard(),
    refetchOnWindowFocus: false,
  });

  const unread = dashboard.data?.stats.unreadMessages ?? 0;

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-surface/95 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          aria-label="Admin navigation"
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <Link to="/" className="group flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md border border-primary/30 bg-primary/10 font-mono text-[11px] text-primary transition-all duration-200 group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent">
                RC
              </span>

              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors duration-200 group-hover:text-foreground">
                Portfolio CMS
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-accent lg:hidden"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex h-[calc(100vh-3.5rem)] flex-col gap-0.5 overflow-y-auto p-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group admin-hover flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground hover:text-accent data-[status=active]:border-primary/30 data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                <item.icon
                  className="size-4 shrink-0 transition-all duration-200 ease-out group-hover:scale-105 group-hover:text-accent group-hover:drop-shadow-[0_0_6px_var(--accent)] group-data-[status=active]:text-primary"
                  aria-hidden="true"
                />

                <span className="truncate">{item.label}</span>

                {item.label === "Messages" && unread > 0 ? (
                  <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent transition-all duration-200 group-hover:bg-accent/20">
                    {unread}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>

        {open ? (
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          />
        ) : null}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-accent lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>

            <Link
              to="/"
              className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors duration-200 hover:text-accent sm:inline"
            >
              View public site
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/admin/messages"
                className="group relative rounded-lg border border-border p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.04] hover:text-accent"
                aria-label={`Notifications${
                  unread > 0 ? `, ${unread} unread messages` : ""
                }`}
              >
                <Bell className="size-4 transition-transform duration-200 group-hover:scale-105" />

                {unread > 0 ? (
                  <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-accent font-mono text-[9px] text-background">
                    {unread > 9 ? "9+" : unread}
                  </span>
                ) : null}
              </Link>

              <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 transition-colors duration-200 hover:border-accent/20 sm:flex">
                <span className="grid size-6 place-items-center rounded-full bg-primary/15 font-mono text-[10px] text-primary">
                  {(user?.name ?? "A").slice(0, 1).toUpperCase()}
                </span>

                <div className="leading-tight">
                  <p className="text-xs font-medium">
                    {user?.name ?? "Admin"}
                  </p>

                  <p className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground uppercase">
                    {user?.roles.join(" · ") ?? "ADMIN"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-destructive/40 hover:bg-destructive/[0.04] hover:text-destructive"
              >
                <LogOut className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />

                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}