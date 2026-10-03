import { createFileRoute } from "@tanstack/react-router";

import { achievementsApi } from "@/api/achievementsApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "organization", label: "Organization", type: "text" },
  { name: "institution", label: "Institution", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "date", label: "Date", type: "text" },
  { name: "url", label: "URL", type: "url" },
  { name: "imageUrl", label: "Image URL", type: "text" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/achievements")({
  component: () => (
    <ResourceManager
      title="Achievements"
      description="Leadership and achievement records. The public section hides itself when empty."
      singular="Achievement"
      queryKey="achievements"
      api={achievementsApi}
      fields={FIELDS}
      primary={(item) => item.title}
      secondary={(item) => item.organization ?? ""}
    />
  ),
});
