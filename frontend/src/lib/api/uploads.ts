import { API_BASE_URL, ApiError, getToken } from '../apiClient';

type UploadedImage = { url: string; name: string; size: number; type: string };

export async function uploadImages(resource: string, files: File[]): Promise<UploadedImage[]> {
  const form = new FormData();
  form.append('resource', resource);
  files.forEach(file => form.append('images', file));
  const token = getToken();
  const response = await fetch(new URL(`${API_BASE_URL}/uploads/images`, window.location.origin), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const body = await response.json().catch(() => null) as { success?: boolean; message?: string; data?: UploadedImage[] } | null;
  if (!response.ok || body?.success === false) throw new ApiError(body?.message || `Upload failed with status ${response.status}`, response.status);
  return body?.data || [];
}
