import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_shell/projects")({
  component: () => <Outlet />,
});
