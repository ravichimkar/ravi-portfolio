import { createFileRoute } from "@tanstack/react-router";

import { experienceApi } from "@/api/experienceApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "organization", label: "Company / organization", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "program", label: "Program", type: "text" },
  { name: "type", label: "Type", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "startDate", label: "Start date", type: "text" },
  { name: "endDate", label: "End date", type: "text" },
  { name: "summary", label: "Description", type: "textarea" },
  { name: "focusAreas", label: "Key areas (one per line)", type: "list" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/experience")({
  component: () => (
    <ResourceManager
      title="Experience"
      description="Professional and training experience stored in the backend."
      singular="Experience"
      queryKey="experience"
      api={experienceApi}
      fields={FIELDS}
      primary={(item) => `${item.role} · ${item.organization}`}
      secondary={(item) => `${item.startDate} – ${item.endDate}`}
    />
  ),
});
