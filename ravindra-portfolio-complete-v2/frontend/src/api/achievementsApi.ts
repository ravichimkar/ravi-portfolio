import { createResourceApi } from "./resource";
import type { AdminAchievement } from "./types";
const base = createResourceApi<AdminAchievement, AdminAchievement>("/api/achievements", "achievements");
export const achievementsApi = { ...base, getPublishedAchievements: base.listPublic };
