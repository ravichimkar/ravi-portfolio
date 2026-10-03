import { createFileRoute } from "@tanstack/react-router";

import { skillsApi } from "@/api/skillsApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "label", label: "Category", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "skills", label: "Skills (one per line)", type: "skillNames" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/skills")({
  component: () => (
    <ResourceManager
      title="Skills"
      description="Skill categories rendered in the public skills section."
      singular="Skill category"
      queryKey="skills"
      api={skillsApi}
      fields={FIELDS}
      primary={(category) => category.label}
      secondary={(category) =>
  category.skills.map((skill: { name: string }) => skill.name).join(", ")
}
    />
  ),
});
