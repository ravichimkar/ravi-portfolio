import { createFileRoute } from "@tanstack/react-router";

import { educationApi } from "@/api/educationApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "institution", label: "Institution", type: "text", required: true },
  { name: "degree", label: "Degree", type: "text", required: true },
  { name: "field", label: "Field", type: "text" },
  { name: "startYear", label: "Start year", type: "text" },
  { name: "endYear", label: "End year", type: "text" },
  { name: "score", label: "CGPA / score", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/education")({
  component: () => (
    <ResourceManager
      title="Education"
      description="Academic records shown in the education section."
      singular="Education"
      queryKey="education"
      api={educationApi}
      fields={FIELDS}
      primary={(item) => item.institution}
      secondary={(item) => `${item.degree} · ${item.startYear} – ${item.endYear}`}
    />
  ),
});
