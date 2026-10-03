/**
 * API contract types.
 *
 * These mirror the payloads the Spring Boot backend will implement.
 * Every endpoint returns an ApiEnvelope so the frontend can handle
 * success/error uniformly.
 */

import type {
  Achievement,
  Certification,
  ContactMessage,
  Education,
  Experience,
  Profile,
  Project,
  SkillCategory,
  SocialLink,
} from "@/types/portfolio";

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  data: T | null;
  message: string | null;
  success: boolean;
  /** Present on paginated list responses. */
  pagination?: Pagination;
}

/* ------------------------------- auth ---------------------------------- */

export type AppRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
  tokenType: "Bearer";
  user: AuthUser;
}

/* ------------------------------ content -------------------------------- */

/** Fields every admin-managed record shares. */
export interface AdminRecordMeta {
  displayOrder?: number;
  published?: boolean;
  updatedAt?: string;
}

export type AdminProject = Project &
  AdminRecordMeta & {
    thumbnailUrl?: string;
  };

export type AdminSkillCategory = SkillCategory & AdminRecordMeta;
export type AdminExperience = Experience & AdminRecordMeta;
export type AdminEducation = Education & AdminRecordMeta & { description?: string };
export type AdminCertification = Certification & AdminRecordMeta & { description?: string };
export type AdminAchievement = Achievement &
  AdminRecordMeta & { date?: string; url?: string; imageUrl?: string };
export type AdminSocialLink = SocialLink & AdminRecordMeta & { active?: boolean };

export type AdminProfile = Profile & {
  heroHeadline?: string;
  heroDescription?: string;
  availabilityStatus?: string;
};

/* --------------------------- contact messages --------------------------- */

export interface ContactMessageRecord extends ContactMessage {
  id: string;
  read: boolean;
  createdAt: string;
}

/* ------------------------------ dashboard ------------------------------- */

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSkills: number;
  certifications: number;
  unreadMessages: number;
  profileCompletion: number;
}

export interface ActivityEntry {
  id: string;
  action: string;
  entity: string;
  actor: string;
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentActivity: ActivityEntry[];
}

/* -------------------------------- health -------------------------------- */

export type HealthState = "UP" | "DEGRADED" | "DOWN";

export interface HealthResponse {
  api: HealthState;
  database: HealthState;
  version: string;
  environment: string;
  responseTimeMs: number;
  lastContentUpdate?: string;
}

/* ------------------------------- settings ------------------------------- */

export interface AppSettings {
  general: {
    siteName: string;
    professionalTitle: string;
    email: string;
    location: string;
  };
  seo: {
    pageTitle: string;
    metaDescription: string;
    ogImageUrl: string;
  };
  contact: {
    contactEmail: string;
    contactFormEnabled: boolean;
  };
  appearance: {
    accent: "gold" | "cyan";
  };
}

/* --------------------------------- media -------------------------------- */

export interface MediaUploadResponse {
  url: string;
  filename: string;
  contentType: string;
  size: number;
}
