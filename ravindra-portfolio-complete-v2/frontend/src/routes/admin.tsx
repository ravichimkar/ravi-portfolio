import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthProvider } from "@/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin | Ravindra Chimkar Portfolio CMS" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Secure administration area for the portfolio content." },
    ],
  }),
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
