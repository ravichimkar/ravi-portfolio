import { createResourceApi } from "./resource";
import type { AdminCertification } from "./types";
const base = createResourceApi<AdminCertification, AdminCertification>("/api/certifications", "certifications");
export const certificationsApi = { ...base, getPublishedCertifications: base.listPublic };
