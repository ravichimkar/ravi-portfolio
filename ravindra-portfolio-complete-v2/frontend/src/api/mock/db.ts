/**
 * In-memory mock datastore used only when VITE_USE_MOCK_API is enabled.
 *
 * It exists so the frontend stays fully functional while the Spring Boot +
 * MySQL backend is built. It is NOT a real database: the Spring Boot + MySQL
 * API remains the source of truth. To keep the demo coherent across full page
 * reloads (e.g. submitting the contact form, then opening /admin), the mock
 * state is mirrored into sessionStorage. This mirror is mock-mode only and is
 * dropped entirely once VITE_API_BASE_URL points at the real backend.
 */

import { mockPortfolio } from "@/data/mockPortfolio";
import type {
  ActivityEntry,
  AdminAchievement,
  AdminCertification,
  AdminEducation,
  AdminExperience,
  AdminProfile,
  AdminProject,
  AdminSkillCategory,
  AdminSocialLink,
  AppSettings,
  ContactMessageRecord,
} from "../types";

const withMeta = <T extends object>(item: T, index: number) => ({
  ...item,
  displayOrder: index + 1,
  published: true,
  updatedAt: new Date().toISOString(),
});

export interface MockDb {
  profile: AdminProfile;
  projects: AdminProject[];
  skills: AdminSkillCategory[];
  experience: AdminExperience[];
  education: AdminEducation[];
  certifications: AdminCertification[];
  achievements: AdminAchievement[];
  socialLinks: AdminSocialLink[];
  messages: ContactMessageRecord[];
  activity: ActivityEntry[];
  settings: AppSettings;
}

const STORAGE_KEY = "mock-api-state:v1";

const seed: MockDb = {
  profile: {
    ...mockPortfolio.profile,
    heroHeadline: mockPortfolio.profile.tagline,
    heroDescription: mockPortfolio.profile.summary,
    availabilityStatus: "Open to software engineering opportunities",
  },
  projects: mockPortfolio.projects.map(withMeta),
  skills: mockPortfolio.skills.map(withMeta),
  experience: mockPortfolio.experience.map(withMeta),
  education: mockPortfolio.education.map(withMeta),
  certifications: mockPortfolio.certifications.map(withMeta),
  achievements: mockPortfolio.achievements.map(withMeta),
  socialLinks: mockPortfolio.socialLinks.map((link, index) => ({
    ...withMeta(link, index),
    active: true,
  })),
  messages: [],
  activity: [],
  settings: {
    general: {
      siteName: "Ravindra Chimkar",
      professionalTitle: mockPortfolio.profile.title,
      email: mockPortfolio.profile.email,
      location: mockPortfolio.profile.location,
    },
    seo: {
      pageTitle: "Ravindra Chimkar | Software Engineer | Java Developer",
      metaDescription:
        "Portfolio of Ravindra Chimkar, a Software Engineer and Java Developer focused on Java, Spring Boot, REST APIs, Microservices and MySQL.",
      ogImageUrl: "",
    },
    contact: {
      contactEmail: mockPortfolio.profile.email,
      contactFormEnabled: true,
    },
    appearance: { accent: "gold" },
  },
};

function hydrate(): MockDb {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return { ...seed, ...(JSON.parse(raw) as Partial<MockDb>) };
  } catch {
    return seed;
  }
}

export const db: MockDb = hydrate();

/** Mirrors the mock state so a full page reload keeps demo data coherent. */
export function persistDb() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* quota or private mode — mock mode falls back to memory only */
  }
}


export function logActivity(action: string, entity: string, actor = "admin") {
  db.activity.unshift({
    id: newId("act"),
    action,
    entity,
    actor,
    createdAt: new Date().toISOString(),
  });
  db.activity = db.activity.slice(0, 50);
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nextOrder(items: { displayOrder?: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.displayOrder ?? 0), 0) + 1;
}

export function sortByOrder<T extends { displayOrder?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function publishedOnly<T extends { published?: boolean }>(items: T[]) {
  return items.filter((item) => item.published !== false);
}
