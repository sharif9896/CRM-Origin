import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest } from '../lib/apiClient';
import { useAuth } from '../store/hooks';
import { AccessContext } from './accessContextObject';

type AccessResponse = { data: { role: string; permissions: string[]; available: string[]; defaults: Record<string, string[]> } };

export default function AccessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.role || '');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [defaults, setDefaults] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    try {
      const response = await apiRequest<AccessResponse>('/workspace/access');
      setRole(response.data.role);
      setPermissions(response.data.permissions);
      setAvailable(response.data.available);
      setDefaults(response.data.defaults);
    } catch (requestError) {
      setError((requestError as Error).message);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Access is loaded from the authenticated API session.
    void refresh();
    const update = () => void refresh();
    window.addEventListener('crm:permissions-changed', update);
    return () => window.removeEventListener('crm:permissions-changed', update);
  }, [refresh]);

  const value = useMemo(() => ({
    role,
    permissions,
    available,
    defaults,
    loading,
    error,
    can: (permission: string | null) => permission === null || role === 'admin' || permissions.includes('*') || permissions.includes(permission),
    refresh,
  }), [role, permissions, available, defaults, loading, error, refresh]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}
