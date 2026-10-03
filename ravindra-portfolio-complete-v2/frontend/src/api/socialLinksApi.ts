import { createResourceApi } from "./resource";
import type { AdminSocialLink } from "./types";
const base = createResourceApi<AdminSocialLink, AdminSocialLink>("/api/social-links", "social-links");
export const socialLinksApi = { ...base, getActiveSocialLinks: base.listPublic };
