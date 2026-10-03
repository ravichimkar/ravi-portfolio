import { createFileRoute } from "@tanstack/react-router";

import { socialLinksApi } from "@/api/socialLinksApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "label", label: "Platform", type: "text", required: true },
  { name: "url", label: "URL", type: "url", required: true },
  { name: "handle", label: "Handle", type: "text" },
  { name: "icon", label: "Icon", type: "select", options: ["github", "linkedin", "leetcode", "mail"] },
  { name: "active", label: "Active", type: "boolean" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/social-links")({
  component: () => (
    <ResourceManager
      title="Social links"
      description="Profile links surfaced in the hero, contact section and footer."
      singular="Social link"
      queryKey="social-links"
      api={socialLinksApi}
      fields={FIELDS}
      primary={(item) => item.label}
      secondary={(item) => item.url}
    />
  ),
});
