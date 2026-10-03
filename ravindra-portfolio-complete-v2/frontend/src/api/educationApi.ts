import { createResourceApi } from "./resource";
import type { AdminEducation } from "./types";
const base = createResourceApi<AdminEducation, AdminEducation>("/api/education", "education");
export const educationApi = { ...base, getPublishedEducation: base.listPublic };
