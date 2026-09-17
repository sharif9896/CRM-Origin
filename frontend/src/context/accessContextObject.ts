import { createContext } from 'react';

export type AccessContextValue = {
  role: string;
  permissions: string[];
  available: string[];
  defaults: Record<string, string[]>;
  loading: boolean;
  error: string;
  can: (permission: string | null) => boolean;
  refresh: () => Promise<void>;
};

export const AccessContext = createContext<AccessContextValue | null>(null);
