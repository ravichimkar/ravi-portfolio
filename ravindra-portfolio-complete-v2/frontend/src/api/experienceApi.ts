import { createResourceApi } from "./resource";
import type { AdminExperience } from "./types";
const base = createResourceApi<AdminExperience, AdminExperience>("/api/experience", "experience");
export const experienceApi = { ...base, getPublishedExperience: base.listPublic };
