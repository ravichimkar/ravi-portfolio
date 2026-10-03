import { apiClient } from "./client";
import { mapResource, projectPayload } from "./backend-adapters";

type ResourceType = "projects" | "experience" | "education" | "certifications" | "achievements" | "social-links";

const endpoint = (type: ResourceType) => `/api/admin/content/${type}`;

function toSnake(value: any): any {
  if (Array.isArray(value)) return value.map(toSnake);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [
    k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
    toSnake(v),
  ]));
}

function payloadFor(type: ResourceType, payload: any) {
  if (type === "projects") return projectPayload(payload);
  if (type === "experience") {
    return {
      company: payload.organization,
      role: payload.role,
      location: payload.location,
      start_date: payload.startDate || null,
      end_date: payload.endDate || null,
      description: payload.summary,
      published: payload.published !== false,
      display_order: Number(payload.displayOrder ?? 0),
    };
  }
  if (type === "education") return {
    institution: payload.institution,
    degree: payload.degree,
    field_of_study: payload.field,
    start_year: payload.startYear ? Number(payload.startYear) : null,
    end_year: payload.endYear ? Number(payload.endYear) : null,
    cgpa: payload.score ? Number(payload.score) : null,
    description: payload.description,
    published: payload.published !== false,
    display_order: Number(payload.displayOrder ?? 0),
  };
  if (type === "certifications") return {
    name: payload.name,
    issuer: payload.issuer,
    completion_date: payload.date || null,
    credential_url: payload.verificationUrl,
    description: payload.description,
    image_url: payload.imageUrl,
    published: payload.published !== false,
    display_order: Number(payload.displayOrder ?? 0),
  };
  if (type === "achievements") return {
    title: payload.title,
    description: payload.description,
    achievement_date: payload.date || null,
    url: payload.url,
    image_url: payload.imageUrl,
    published: payload.published !== false,
    display_order: Number(payload.displayOrder ?? 0),
  };
  if (type === "social-links") return {
    platform: payload.label,
    url: payload.url,
    icon: payload.icon,
    display_order: Number(payload.displayOrder ?? 0),
    active: payload.active !== false,
  };
  return toSnake(payload);
}

export function createResourceApi<TPublic, TAdmin extends { id: string }>(
  publicPath: string,
  type: ResourceType,
) {
  const adminPath = endpoint(type);
  return {
    listPublic: async () => {
      const rows = await apiClient.get<any[]>(publicPath);
      return rows.map((row) => mapResource(type, row)) as TPublic[];
    },
    list: async () => {
      const rows = await apiClient.get<any[]>(adminPath);
      return rows.map((row) => mapResource(type, row)) as TAdmin[];
    },
    get: async (id: string) => {
      const rows = await apiClient.get<any[]>(adminPath);
      const found = rows.find((row) => String(row.id) === String(id));
      if (!found) throw new Error("Record not found");
      return mapResource(type, found) as TAdmin;
    },
    create: async (payload: Partial<TAdmin>) => {
      await apiClient.post(adminPath, payloadFor(type, payload));
      return payload as TAdmin;
    },
    update: async (id: string, payload: Partial<TAdmin>) => {
      await apiClient.put(`${adminPath}/${id}`, payloadFor(type, payload));
      return payload as TAdmin;
    },
    remove: async (id: string) => {
      await apiClient.delete(`${adminPath}/${id}`);
      return null;
    },
  };
}
