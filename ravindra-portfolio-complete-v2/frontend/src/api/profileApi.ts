import { apiClient } from "./client";
import { mapProfile } from "./backend-adapters";
import type { AdminProfile } from "./types";

export const profileApi = {
  getPublic: async () => mapProfile(await apiClient.get<any>("/api/profile")) as AdminProfile,
  update: async (payload: Partial<AdminProfile>) => {
    const body = {
      name: payload.name,
      professional_title: payload.title,
      location: payload.location,
      email: payload.email,
      summary: payload.summary,
      hero_headline: payload.heroHeadline,
      hero_description: payload.heroDescription,
      availability: payload.availabilityStatus,
      resume_url: payload.resumeUrl,
      profile_image_url: payload.photoUrl,
    };
    await apiClient.put("/api/admin/profile", body);
    return mapProfile(await apiClient.get<any>("/api/profile")) as AdminProfile;
  },
};
