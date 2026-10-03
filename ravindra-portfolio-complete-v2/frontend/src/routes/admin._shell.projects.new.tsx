import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { projectsApi } from "@/api/projectsApi";
import { PROJECT_FIELDS } from "@/components/admin/project-fields";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_shell/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const navigate = useNavigate();
  return (
    <ResourceManager
      title="New project"
      description="Create a project. Drafts stay hidden on the public website."
      singular="Project"
      queryKey="projects"
      api={projectsApi}
      fields={PROJECT_FIELDS}
      primary={(project) => project.name}
      secondary={(project) => `${project.architecture} · /projects/${project.slug}`}
      initialAction={{ mode: "new" }}
      onEditorClose={() => navigate({ to: "/admin/projects" })}
      searchable={false}
      hideList
    />
  );
}
