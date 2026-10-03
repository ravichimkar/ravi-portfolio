import { apiClient } from "./client";
import type { HealthResponse } from "./types";
export const operationsApi = { health: () => apiClient.get<HealthResponse>("/api/admin/operations/health") };
