import { createFileRoute } from "@tanstack/react-router";

import { certificationsApi } from "@/api/certificationsApi";
import { ResourceManager, type FieldDef } from "@/components/admin/resource-manager";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "issuer", label: "Issuer", type: "text", required: true },
  { name: "date", label: "Issue / completion date", type: "text" },
  { name: "verificationUrl", label: "Credential URL", type: "url" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "skills", label: "Skills (one per line)", type: "list" },
  { name: "imageUrl", label: "Certificate image URL", type: "text" },
  { name: "published", label: "Published", type: "boolean" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

export const Route = createFileRoute("/admin/_shell/certifications")({
  component: () => (
    <ResourceManager
      title="Certifications"
      description="Certificates displayed publicly with lazy-loaded thumbnails."
      singular="Certification"
      queryKey="certifications"
      api={certificationsApi}
      fields={FIELDS}
      primary={(item) => item.name}
      secondary={(item) => `${item.issuer}${item.date ? ` · ${item.date}` : ""}`}
    />
  ),
});
