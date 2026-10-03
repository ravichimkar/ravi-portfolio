import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { settingsApi } from "@/api/settingsApi";
import type { AppSettings } from "@/api/types";
import { AdminPage, FormField, Panel, adminFieldClass } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/action-button";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonRows } from "@/components/ui/skeletons";
import { adminQueries } from "@/lib/queries";

export const Route = createFileRoute("/admin/_shell/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const query = useQuery(adminQueries.settings());
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (query.data) setSettings(structuredClone(query.data));
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () => settingsApi.update(settings as AppSettings),
    onSuccess: () => {
      toast.success("Settings saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: () => toast.error("Unable to save settings. Please try again."),
  });

  const patch = <K extends keyof AppSettings>(section: K, value: Partial<AppSettings[K]>) =>
    setSettings((prev) => (prev ? { ...prev, [section]: { ...prev[section], ...value } } : prev));

  return (
    <AdminPage title="Settings" description="Site-wide configuration served by /api/admin/settings.">
      <AsyncBoundary
        isPending={query.isPending || !settings}
        isError={query.isError}
        data={settings ?? undefined}
        errorMessage="Settings are temporarily unavailable."
        onRetry={() => query.refetch()}
        skeleton={<SkeletonRows count={4} />}
      >
        {(data) => (
          <div className="space-y-5">
            <Panel title="General">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Site name" htmlFor="site-name">
                  <input
                    id="site-name"
                    className={adminFieldClass}
                    value={data.general.siteName}
                    onChange={(event) => patch("general", { siteName: event.target.value })}
                  />
                </FormField>
                <FormField label="Professional title" htmlFor="site-title">
                  <input
                    id="site-title"
                    className={adminFieldClass}
                    value={data.general.professionalTitle}
                    onChange={(event) =>
                      patch("general", { professionalTitle: event.target.value })
                    }
                  />
                </FormField>
                <FormField label="Email" htmlFor="site-email">
                  <input
                    id="site-email"
                    className={adminFieldClass}
                    value={data.general.email}
                    onChange={(event) => patch("general", { email: event.target.value })}
                  />
                </FormField>
                <FormField label="Location" htmlFor="site-location">
                  <input
                    id="site-location"
                    className={adminFieldClass}
                    value={data.general.location}
                    onChange={(event) => patch("general", { location: event.target.value })}
                  />
                </FormField>
              </div>
            </Panel>

            <Panel title="SEO">
              <div className="grid gap-5">
                <FormField label="Page title" htmlFor="seo-title">
                  <input
                    id="seo-title"
                    className={adminFieldClass}
                    value={data.seo.pageTitle}
                    onChange={(event) => patch("seo", { pageTitle: event.target.value })}
                  />
                </FormField>
                <FormField label="Meta description" htmlFor="seo-desc">
                  <textarea
                    id="seo-desc"
                    rows={3}
                    className={adminFieldClass}
                    value={data.seo.metaDescription}
                    onChange={(event) => patch("seo", { metaDescription: event.target.value })}
                  />
                </FormField>
                <FormField label="OG image URL" htmlFor="seo-og">
                  <input
                    id="seo-og"
                    className={adminFieldClass}
                    value={data.seo.ogImageUrl}
                    onChange={(event) => patch("seo", { ogImageUrl: event.target.value })}
                  />
                </FormField>
              </div>
            </Panel>

            <Panel title="Contact">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Contact email" htmlFor="contact-email">
                  <input
                    id="contact-email"
                    className={adminFieldClass}
                    value={data.contact.contactEmail}
                    onChange={(event) => patch("contact", { contactEmail: event.target.value })}
                  />
                </FormField>
                <FormField label="Contact form" htmlFor="contact-enabled">
                  <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
                    <input
                      id="contact-enabled"
                      type="checkbox"
                      className="size-4 accent-[var(--color-primary)]"
                      checked={data.contact.contactFormEnabled}
                      onChange={(event) =>
                        patch("contact", { contactFormEnabled: event.target.checked })
                      }
                    />
                    Enabled
                  </label>
                </FormField>
              </div>
            </Panel>

            <Panel
              title="Appearance"
              description="Accent emphasis only — the core dark design system cannot be overridden."
            >
              <div className="flex gap-3">
                {(["gold", "cyan"] as const).map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => patch("appearance", { accent })}
                    className={`rounded-xl border px-4 py-2 text-xs uppercase ${
                      data.appearance.accent === accent
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {accent}
                  </button>
                ))}
              </div>
            </Panel>

            <div className="flex flex-wrap gap-3">
              <ActionButton
                variant="gold"
                size="sm"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving…" : "Save changes"}
              </ActionButton>
              <ActionButton
                variant="ghost"
                size="sm"
                onClick={() => query.data && setSettings(structuredClone(query.data))}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        )}
      </AsyncBoundary>
    </AdminPage>
  );
}
