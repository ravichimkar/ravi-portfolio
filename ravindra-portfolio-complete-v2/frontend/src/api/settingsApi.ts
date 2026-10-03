import { apiClient } from "./client";
import type { AppSettings } from "./types";

const defaults: AppSettings = {
  general: { siteName: "Ravindra Chimkar", professionalTitle: "Software Engineer | Java Developer", email: "ravichimkar2004@gmail.com", location: "Pune, Maharashtra, India" },
  seo: { pageTitle: "Ravindra Chimkar | Software Engineer | Java Developer", metaDescription: "", ogImageUrl: "" },
  contact: { contactEmail: "ravichimkar2004@gmail.com", contactFormEnabled: true },
  appearance: { accent: "gold" },
};

export const settingsApi = {
  get: async () => {
    const rows = await apiClient.get<any[]>("/api/admin/settings");
    const out: AppSettings = structuredClone(defaults);
    for (const row of rows) {
      const key = String(row.setting_key ?? "");
      const value = row.setting_value;
      if (key === "general.siteName") out.general.siteName = value;
      else if (key === "general.professionalTitle") out.general.professionalTitle = value;
      else if (key === "general.email") out.general.email = value;
      else if (key === "general.location") out.general.location = value;
      else if (key === "seo.pageTitle") out.seo.pageTitle = value;
      else if (key === "seo.metaDescription") out.seo.metaDescription = value;
      else if (key === "seo.ogImageUrl") out.seo.ogImageUrl = value;
      else if (key === "contact.contactEmail") out.contact.contactEmail = value;
      else if (key === "contact.contactFormEnabled") out.contact.contactFormEnabled = value !== "false";
      else if (key === "appearance.accent") out.appearance.accent = value === "cyan" ? "cyan" : "gold";
    }
    return out;
  },
  update: async (payload: AppSettings) => {
    const entries: Record<string, unknown> = {
      "general.siteName": payload.general.siteName,
      "general.professionalTitle": payload.general.professionalTitle,
      "general.email": payload.general.email,
      "general.location": payload.general.location,
      "seo.pageTitle": payload.seo.pageTitle,
      "seo.metaDescription": payload.seo.metaDescription,
      "seo.ogImageUrl": payload.seo.ogImageUrl,
      "contact.contactEmail": payload.contact.contactEmail,
      "contact.contactFormEnabled": String(payload.contact.contactFormEnabled),
      "appearance.accent": payload.appearance.accent,
    };
    for (const [key, value] of Object.entries(entries)) await apiClient.put(`/api/admin/settings/${encodeURIComponent(key)}`, { value });
    return payload;
  },
};
