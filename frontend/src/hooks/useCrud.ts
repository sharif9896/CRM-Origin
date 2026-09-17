import { useCallback, useEffect, useMemo, useState } from "react";
import type { Entity } from "../data/types";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
} from "../lib/api/resource";
import { ApiError } from "../lib/apiClient";

export type SortDir = "asc" | "desc";

type Options<T> = {
  pageSize?: number;
  searchKeys?: (keyof T)[];
  /** Extra exact-match query params sent with every list fetch, e.g. { kind: "amenity" }. */
  params?: Record<string, string | number | boolean | undefined>;
};

export type Filters<T> = Partial<Record<keyof T, string>>;

/**
 * Drives a list view against a backend resource (e.g. "leads", "properties").
 * Fetches the full dataset once (these are small demo collections) and does
 * search/filter/sort/pagination client-side, exactly as before - so the
 * many list views built on this hook needed no changes beyond passing a
 * resource name instead of a static seed array. `add`/`update`/`remove` now
 * call the real API and only update local state once the server confirms.
 */
export function useCrud<T extends Entity>(resource: string, options: Options<T> = {}) {
  const { pageSize = 10, searchKeys = [], params } = options;

  const searchKeysId = searchKeys.join(",");
  const paramsId = params ? JSON.stringify(params) : "";

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters<T>>({});
  const [sort, setSort] = useState<{ key: keyof T; dir: SortDir } | null>(null);
  const [page, setPage] = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listResource<T>(resource, params);
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, paramsId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Resource changes start a new request.
    fetchAll();
    const refresh = () => { void fetchAll(); };
    window.addEventListener("crm:records-changed", refresh);
    return () => window.removeEventListener("crm:records-changed", refresh);
  }, [fetchAll]);

  const processed = useMemo(() => {
    let out = rows;
    const keys = (searchKeysId ? searchKeysId.split(",") : []) as (keyof T)[];

    const q = search.trim().toLowerCase();
    if (q && keys.length) {
      out = out.filter((row) =>
        keys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
      );
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      out = out.filter((row) => String(row[key as keyof T] ?? "") === value);
    }

    if (sort) {
      out = [...out].sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        const cmp =
          typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return out;
  }, [rows, search, filters, sort, searchKeysId]);

  const total = processed.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(
    () => processed.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [processed, currentPage, pageSize],
  );

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((key: keyof T, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: keyof T) => {
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  }, []);

  const add = useCallback(
    async (row: Omit<T, "id">) => {
      // Merge in any fixed list params (e.g. { kind: "amenity" }) so a row
      // created from a filtered view lands in the right bucket.
      const created = await createResource<T>(resource, { ...params, ...row });
      setRows((r) => [created, ...r]);
      return created;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paramsId represents the value of params.
    [resource, paramsId],
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const updated = await updateResource<T>(resource, id, patch);
      setRows((r) => r.map((row) => (row.id === id ? updated : row)));
      return updated;
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteResource(resource, id);
        setRows((r) => r.filter((row) => row.id !== id));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete record.");
        throw err;
      }
    },
    [resource],
  );

  const reset = useCallback(() => fetchAll(), [fetchAll]);

  return {
    rows: paged,
    allRows: rows,
    total,
    page: currentPage,
    pageCount,
    pageSize,
    search,
    filters,
    sort,
    loading,
    error,
    setPage,
    setSearch,
    setFilter,
    toggleSort,
    add,
    update,
    remove,
    reset,
  };
}
