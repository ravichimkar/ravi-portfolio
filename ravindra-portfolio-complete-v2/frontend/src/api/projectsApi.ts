import { apiClient } from "./client";
import { createResourceApi } from "./resource";
import { mapProject } from "./backend-adapters";
import type { AdminProject } from "./types";

const base = createResourceApi<AdminProject, AdminProject>("/api/projects", "projects");
export const projectsApi = {
  ...base,
  getPublishedProjects: base.listPublic,
  getPublicBySlug: async (slug: string) => mapProject(await apiClient.get<any>(`/api/projects/${slug}`)) as AdminProject,
};
