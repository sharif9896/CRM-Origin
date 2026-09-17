import { apiRequest } from "../apiClient";

type ListResponse<T> = {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
};

type ItemResponse<T> = {
  success: boolean;
  data: T;
};

/**
 * Fetches every row for a resource (the app's datasets are small demo
 * datasets, so a single high-limit request keeps this simple rather than
 * implementing server-side infinite scroll on top of the existing
 * client-side search/sort/pagination in useCrud).
 */
export async function listResource<T>(
  resource: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T[]> {
  const rows: T[] = [];
  let page = 1;
  let pages: number;
  do {
    const res = await apiRequest<ListResponse<T>>(`/${resource}`, {
      params: { ...params, limit: 100, page, sort: 'createdAt,_id' },
    });
    rows.push(...res.data);
    pages = res.pages;
    page += 1;
  } while (page <= pages);
  return rows;
}

export async function getResource<T>(resource: string, id: string): Promise<T> {
  const res = await apiRequest<ItemResponse<T>>(`/${resource}/${id}`);
  return res.data;
}

export async function createResource<T>(resource: string, body: unknown): Promise<T> {
  const res = await apiRequest<ItemResponse<T>>(`/${resource}`, { method: "POST", body });
  return res.data;
}

export async function updateResource<T>(
  resource: string,
  id: string,
  body: unknown,
): Promise<T> {
  const res = await apiRequest<ItemResponse<T>>(`/${resource}/${id}`, { method: "PUT", body });
  return res.data;
}

export async function deleteResource(resource: string, id: string): Promise<void> {
  await apiRequest(`/${resource}/${id}`, { method: "DELETE" });
}
