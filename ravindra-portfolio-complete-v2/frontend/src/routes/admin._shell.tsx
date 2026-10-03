import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/auth/auth-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { SkeletonRows } from "@/components/ui/skeletons";

export const Route = createFileRoute("/admin/_shell")({
  component: AdminGuardedLayout,
});

function AdminGuardedLayout() {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate({
        to: "/admin/login",
        replace: true,
      });
    }
  }, [status, navigate]);

  if (status !== "authenticated") {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-20">
        <SkeletonRows count={3} />
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}