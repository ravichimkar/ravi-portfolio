import { apiClient } from "./client";
import { groupSkills } from "./backend-adapters";
import type { AdminSkillCategory } from "./types";

const mapCategory = (x: any): AdminSkillCategory => ({
  id: String(x.id),
  label: x.label ?? "",
  description: x.description ?? "",
  skills: Array.isArray(x.skills) ? x.skills.map((s: any) => ({ name: s.name ?? "" })) : [],
  published: x.published !== false,
  displayOrder: Number(x.displayOrder ?? 0),
});

export const skillsApi = {
  listPublic: async () => groupSkills(await apiClient.get<any[]>("/api/skills")) as AdminSkillCategory[],
  list: async () => (await apiClient.get<any[]>("/api/admin/skills")).map(mapCategory),
  create: async (payload: any) => {
    const body = {
      label: payload.label,
      description: payload.description,
      skills: (payload.skills ?? []).map((s: any) => s.name ?? s),
      published: payload.published,
      displayOrder: payload.displayOrder,
    };
    await apiClient.post("/api/admin/skills", body);
    return payload;
  },
  update: async (id: string, payload: any) => {
    const body = {
      label: payload.label,
      description: payload.description,
      skills: (payload.skills ?? []).map((s: any) => s.name ?? s),
      published: payload.published,
      displayOrder: payload.displayOrder,
    };
    await apiClient.put(`/api/admin/skills/${encodeURIComponent(id)}`, body);
    return payload;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/api/admin/skills/${encodeURIComponent(id)}`);
    return null;
  },
  getPublishedSkills: async () => groupSkills(await apiClient.get<any[]>("/api/skills")) as AdminSkillCategory[],
};
