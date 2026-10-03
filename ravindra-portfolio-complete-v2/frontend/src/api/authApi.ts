import { apiClient, tokenStore } from "./client";
import type { AuthResponse, AuthUser, LoginRequest } from "./types";

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<AuthResponse>("/api/auth/login", credentials),
  me: () => apiClient.get<Partial<AuthUser> & { email: string; roles: string[] }>("/api/auth/me"),
  logout: async () => undefined,
  setToken: tokenStore.set,
  clearToken: tokenStore.clear,
};
