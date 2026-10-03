import { queryOptions } from "@tanstack/react-query";

import { achievementsApi } from "@/api/achievementsApi";
import { activityApi } from "@/api/activityApi";
import { operationsApi } from "@/api/operationsApi";
import { certificationsApi } from "@/api/certificationsApi";

import { contactApi } from "@/api/contactApi";
import { dashboardApi } from "@/api/dashboardApi";
import { educationApi } from "@/api/educationApi";
import { experienceApi } from "@/api/experienceApi";
import { profileApi } from "@/api/profileApi";
import { projectsApi } from "@/api/projectsApi";
import { settingsApi } from "@/api/settingsApi";
import { skillsApi } from "@/api/skillsApi";
import { socialLinksApi } from "@/api/socialLinksApi";

/** Public content changes rarely — cache aggressively and dedupe requests. */
const PUBLIC_STALE_TIME = 5 * 60 * 1000;

const publicOptions = { staleTime: PUBLIC_STALE_TIME, gcTime: 30 * 60 * 1000, retry: 1 } as const;

export const publicQueries = {
  profile: () =>
    queryOptions({ queryKey: ["public", "profile"], queryFn: profileApi.getPublic, ...publicOptions }),
  socialLinks: () =>
    queryOptions({
      queryKey: ["public", "social-links"],
      queryFn: socialLinksApi.getActiveSocialLinks,
      ...publicOptions,
    }),
  skills: () =>
    queryOptions({
      queryKey: ["public", "skills"],
      queryFn: skillsApi.getPublishedSkills,
      ...publicOptions,
    }),
  experience: () =>
    queryOptions({
      queryKey: ["public", "experience"],
      queryFn: experienceApi.getPublishedExperience,
      ...publicOptions,
    }),
  education: () =>
    queryOptions({
      queryKey: ["public", "education"],
      queryFn: educationApi.getPublishedEducation,
      ...publicOptions,
    }),
  certifications: () =>
    queryOptions({
      queryKey: ["public", "certifications"],
      queryFn: certificationsApi.getPublishedCertifications,
      ...publicOptions,
    }),
  achievements: () =>
    queryOptions({
      queryKey: ["public", "achievements"],
      queryFn: achievementsApi.getPublishedAchievements,
      ...publicOptions,
    }),
  projects: () =>
    queryOptions({
      queryKey: ["public", "projects"],
      queryFn: projectsApi.getPublishedProjects,
      ...publicOptions,
    }),
  project: (slug: string) =>
    queryOptions({
      queryKey: ["public", "projects", slug],
      queryFn: () => projectsApi.getPublicBySlug(slug),
      ...publicOptions,
    }),
};

const adminOptions = { staleTime: 30 * 1000, retry: 0 } as const;

export const adminQueries = {
  dashboard: () =>
    queryOptions({ queryKey: ["admin", "dashboard"], queryFn: dashboardApi.get, ...adminOptions }),
  activity: () =>
    queryOptions({ queryKey: ["admin", "activity"], queryFn: activityApi.list, ...adminOptions }),
  health: () =>
    queryOptions({
      queryKey: ["admin", "operations", "health"],
      queryFn: operationsApi.health,
      retry: 0,
      staleTime: 15 * 1000,
    }),

  settings: () =>
    queryOptions({ queryKey: ["admin", "settings"], queryFn: settingsApi.get, ...adminOptions }),
  messages: () =>
    queryOptions({ queryKey: ["admin", "messages"], queryFn: contactApi.list, ...adminOptions }),
  profile: () =>
    queryOptions({ queryKey: ["admin", "profile"], queryFn: profileApi.getPublic, ...adminOptions }),
  collection: <T>(key: string, fetcher: () => Promise<T>) =>
    queryOptions({ queryKey: ["admin", key], queryFn: fetcher, ...adminOptions }),
};
