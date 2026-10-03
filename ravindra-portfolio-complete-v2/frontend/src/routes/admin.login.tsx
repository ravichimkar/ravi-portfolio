import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ApiError } from "@/api/client";
import { useAuth } from "@/auth/auth-context";
import { adminFieldClass, FormField } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login, isAuthenticated, status } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/admin/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.7971_0.1339_211.53/8%),transparent_70%)]"
      />
      <div className="surface-panel relative w-full max-w-md rounded-2xl p-7 sm:p-9">
        <p className="font-mono text-[10px] tracking-[0.28em] text-primary uppercase">
          Portfolio CMS
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Authentication is handled by the Spring Boot backend (Spring Security + JWT).
        </p>

        <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
          <FormField label="Email" htmlFor="admin-email">
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              className={adminFieldClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>
          <FormField label="Password" htmlFor="admin-password">
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className={adminFieldClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <ActionButton
            type="submit"
            variant="gold"
            className="w-full"
            disabled={submitting || status === "loading"}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </ActionButton>
        </form>

        <Link
          to="/"
          className="mt-6 inline-block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase hover:text-primary"
        >
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
