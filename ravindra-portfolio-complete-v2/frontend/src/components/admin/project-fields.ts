import type { FieldDef } from "@/components/admin/resource-manager";

/** Shared project form definition used by the list, create and edit routes. */
export const PROJECT_FIELDS: FieldDef[] = [
  { name: "name", label: "Title", type: "text", required: true },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    hint: "URL-safe, e.g. credit-score-analysis-tool",
  },
  {
    name: "architecture",
    label: "Architecture",
    type: "select",
    options: ["Microservices", "Monolithic", "Layered", "Serverless"],
  },
  { name: "shortDescription", label: "Short description", type: "textarea", required: true },
  { name: "overview", label: "Long description", type: "textarea" },
  { name: "technologies", label: "Technologies (one per line)", type: "list" },
  { name: "keyFeatures", label: "Key features (one per line)", type: "list" },
  {
    name: "technicalImplementation",
    label: "Technical implementation (one per line)",
    type: "list",
  },
  { name: "challenges", label: "Challenges (one per line)", type: "list" },
  { name: "githubUrl", label: "GitHub URL", type: "url" },
  { name: "liveDemoUrl", label: "Live demo URL", type: "url" },
  { name: "thumbnailUrl", label: "Thumbnail URL", type: "text" },
  { name: "featured", label: "Featured", type: "boolean", hint: "Highlight on the public site" },
  { name: "published", label: "Published", type: "boolean", hint: "Drafts stay hidden publicly" },
  { name: "displayOrder", label: "Display order", type: "number" },
];
