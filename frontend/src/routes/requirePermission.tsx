import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccess } from '../hooks/useAccess';
import { menuPermissionForPath, permissionForPath } from '../lib/access';
import { all_routes } from './all_routes';

export default function RequirePermission({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { role, loading, error, can } = useAccess();
  const permission = permissionForPath(pathname);
  const menuPermission = menuPermissionForPath(pathname);
  if (loading) return <div className="ws-state" role="status">Checking access…</div>;
  if (error) return <div className="ws-error" role="alert">Unable to verify access: {error}</div>;
  const denied = permission === 'admin' ? role !== 'admin' : !can(permission) || !can(menuPermission);
  if (denied) return <section className="access-denied"><i className="icon-shield-alert"/><span className="eyebrow">ACCESS CONTROL</span><h1>Access denied</h1><p>Your administrator has not enabled this area for your role.</p>{can('menu:profile') && <Link className="ws-button primary" to={all_routes.profile}>Open my profile</Link>}</section>;
  return children;
}
