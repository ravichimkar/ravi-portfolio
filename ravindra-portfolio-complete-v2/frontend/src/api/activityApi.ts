import { apiClient } from "./client";
import type { ActivityEntry } from "./types";

export const activityApi = {
  list: async (): Promise<ActivityEntry[]> => {
    const rows = await apiClient.get<any[]>("/api/admin/activity");
    return rows.map((x) => ({
      id: String(x.id),
      action: x.action ?? "",
      entity: x.entity_type ?? x.entity ?? "",
      actor: x.actor_email ?? x.actor ?? "",
      createdAt: x.created_at ?? x.createdAt ?? "",
    }));
  },
};
