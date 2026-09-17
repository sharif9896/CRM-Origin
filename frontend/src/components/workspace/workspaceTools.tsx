import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecordWorkspace from './recordWorkspace';
export default function WorkspaceTools() {
  const { pathname } = useLocation(); const [openedAt, setOpenedAt] = useState('');
  const segment = pathname.split('/').filter(Boolean)[0];
  const aliases: Record<string, string> = { categories: 'taxonomies', amenities: 'taxonomies', 'manual-tour': 'tours' };
  const resource = aliases[segment] || segment;
  if (!['properties', 'agents', 'customers', 'leads', 'deals', 'invoices', 'appointments', 'staff', 'reviews', 'taxonomies', 'tours'].includes(resource)) return null;
  const params: Record<string, string> = resource === 'taxonomies' ? { kind: segment === 'amenities' ? 'amenity' : 'category' } : {};
  return <div className="workspace-tools"><div><i className="icon-database" /><span>Connected workspace</span><small>Changes are saved to your database</small></div><button className="ws-button" onClick={() => setOpenedAt(openedAt === pathname ? '' : pathname)}>{openedAt === pathname ? 'Close record manager' : 'Manage all records'}<i className="icon-arrow-up-right" /></button>{openedAt === pathname && <div className="workspace-manager"><RecordWorkspace resource={resource} params={params} /></div>}</div>;
}
