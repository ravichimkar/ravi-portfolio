import { apiClient } from "./client";
import type { DashboardResponse } from "./types";

export const dashboardApi = {
  get: async (): Promise<DashboardResponse> => {
    const raw = await apiClient.get<any>("/api/admin/dashboard");
    return {
      stats: {
        totalProjects: Number(raw.totalProjects ?? 0),
        publishedProjects: Number(raw.publishedProjects ?? 0),
        totalSkills: Number(raw.skills ?? raw.totalSkills ?? 0),
        certifications: Number(raw.certifications ?? 0),
        unreadMessages: Number(raw.unreadMessages ?? 0),
        profileCompletion: Number(raw.profileCompletion ?? 0),
      },
      recentActivity: (raw.recentActivity ?? []).map((x: any) => ({
        id: String(x.id),
        action: x.action ?? "",
        entity: x.entity_type ?? x.entity ?? "",
        actor: x.actor_email ?? x.actor ?? "",
        createdAt: x.created_at ?? x.createdAt ?? "",
      })),
    };
  },
};
