import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { profileApi } from "@/api/profileApi";
import { AdminPage, Panel } from "@/components/admin/admin-ui";
import { ResourceFields, type FieldDef } from "@/components/admin/resource-manager";
import { ActionButton } from "@/components/ui/action-button";
import { AsyncBoundary } from "@/components/ui/async-boundary";
import { SkeletonRows } from "@/components/ui/skeletons";
import { adminQueries } from "@/lib/queries";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "title", label: "Professional title", type: "text", required: true },
  { name: "location", label: "Location", type: "text" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "summary", label: "Professional summary", type: "textarea" },
  { name: "heroHeadline", label: "Hero headline", type: "textarea" },
  { name: "heroDescription", label: "Hero description", type: "textarea" },
  { name: "availabilityStatus", label: "Availability status", type: "text" },
  { name: "resumeUrl", label: "Resume URL", type: "text" },
  { name: "photoUrl", label: "Profile image URL", type: "text", hint: "Uploaded via the media endpoint." },
];

export const Route = createFileRoute("/admin/_shell/profile")({
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const query = useQuery(adminQueries.profile());
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (query.data) setValues({ ...(query.data as unknown as Record<string, unknown>) });
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: () => profileApi.update(values),
    onSuccess: () => {
      toast.success("Profile saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Unable to save profile. Please try again.",
      ),
  });

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    if (!String(values["name"] ?? "").trim()) nextErrors["name"] = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values["email"] ?? "")))
      nextErrors["email"] = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    mutation.mutate();
  };

  return (
    <AdminPage title="Profile" description="Content shown in the hero, about and contact sections.">
      <AsyncBoundary
        isPending={query.isPending}
        isError={query.isError}
        data={query.data}
        errorMessage="Profile is temporarily unavailable."
        onRetry={() => query.refetch()}
        skeleton={<SkeletonRows count={5} />}
      >
        {() => (
          <Panel>
            <ResourceFields
              fields={FIELDS}
              values={values}
              errors={errors}
              idPrefix="profile"
              onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton variant="gold" size="sm" onClick={submit} disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : "Save changes"}
              </ActionButton>
              <ActionButton
                variant="ghost"
                size="sm"
                onClick={() => query.data && setValues({ ...(query.data as unknown as Record<string, unknown>) })}
                disabled={mutation.isPending}
              >
                Cancel
              </ActionButton>
            </div>
          </Panel>
        )}
      </AsyncBoundary>
    </AdminPage>
  );
}
