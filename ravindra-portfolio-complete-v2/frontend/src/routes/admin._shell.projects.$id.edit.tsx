import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { projectsApi } from "@/api/projectsApi";
import { PROJECT_FIELDS } from "@/components/admin/project-fields";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_shell/projects/$id/edit")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  return (
    <ResourceManager
      title="Edit project"
      description="Update this project. Changes appear on the public site immediately."
      singular="Project"
      queryKey="projects"
      api={projectsApi}
      fields={PROJECT_FIELDS}
      primary={(project) => project.name}
      secondary={(project) => `${project.architecture} · /projects/${project.slug}`}
      initialAction={{ mode: "edit", id }}
      onEditorClose={() => navigate({ to: "/admin/projects" })}
      searchable={false}
      hideList
    />
  );
}
