import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { projectsApi } from "@/api/projectsApi";
import { PROJECT_FIELDS } from "@/components/admin/project-fields";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/admin/_shell/projects/")({
  component: ProjectsAdminPage,
});

function ProjectsAdminPage() {
  const navigate = useNavigate();
  return (
    <ResourceManager
      title="Projects"
      description="Create, publish and order the projects shown on the portfolio."
      singular="Project"
      queryKey="projects"
      api={projectsApi}
      fields={PROJECT_FIELDS}
      primary={(project) => project.name}
      secondary={(project) => `${project.architecture} · /projects/${project.slug}`}
      onNewRoute={() => navigate({ to: "/admin/projects/new" })}
      onEditRoute={(project) =>
        navigate({ to: "/admin/projects/$id/edit", params: { id: project.id } })
      }
    />
  );
}
