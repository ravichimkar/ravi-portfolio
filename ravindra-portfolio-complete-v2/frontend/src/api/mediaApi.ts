import { request } from "./client";
import type { MediaUploadResponse } from "./types";

/**
 * POST /api/admin/media/upload
 * Uploads through the backend and returns a URL — images are never embedded
 * as base64 blobs inside content records.
 */
export const mediaApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<MediaUploadResponse>("/api/admin/media/upload", {
      method: "POST",
      formData,
      timeoutMs: 60_000,
    });
  },
};
