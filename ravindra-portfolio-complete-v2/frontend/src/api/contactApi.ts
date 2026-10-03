import { apiClient } from "./client";
import type { ContactMessageRecord } from "./types";
import type { ContactMessage } from "@/types/portfolio";

const map = (m: any): ContactMessageRecord => ({
  id: String(m.id),
  name: m.sender_name ?? "",
  email: m.email ?? "",
  subject: m.subject ?? "",
  message: m.message ?? "",
  read: Boolean(m.is_read),
  createdAt: m.created_at ?? "",
});

export const contactApi = {
  send: (message: ContactMessage) => apiClient.post<{ received: boolean }>("/api/contact", message),
  list: async () => (await apiClient.get<any[]>("/api/admin/contact-messages")).map(map),
  get: async (id: string) => map(await apiClient.get<any>(`/api/admin/contact-messages/${id}`)),
  markRead: async (id: string) => map(await apiClient.patch<any>(`/api/admin/contact-messages/${id}/read`)),
  remove: (id: string) => apiClient.delete<null>(`/api/admin/contact-messages/${id}`),
};
