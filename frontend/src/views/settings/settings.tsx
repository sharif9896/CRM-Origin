import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { useAuth } from '../../store/hooks';
import { exportCsv } from '../../lib/exportCsv';
type SettingsData = { companyName: string; timezone: string; currency: string; website: string; contactEmail: string; address: string };
type Audit = { id: string; actor: string; action: string; resource: string; label: string; createdAt: string };
export default function Settings() {
  const { user } = useAuth();
  const [data, setData] = useState<SettingsData | null>(null);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('organization');
  useEffect(() => { apiRequest<{data: SettingsData}>('/workspace/settings').then(r => setData(r.data)).catch(e => setError(e.message)); }, []);
  useEffect(() => { if (tab === 'audit') apiRequest<{data: Audit[]}>('/workspace/audit').then(r => setAudit(r.data)).catch(e => setError(e.message)); }, [tab]);
  const save = async (e: React.FormEvent) => { e.preventDefault(); if (!data) return; setBusy(true); setError(''); setNotice('');
    try { const res = await apiRequest<{data: SettingsData}>('/workspace/settings', { method: 'PUT', body: data }); setData(res.data); setNotice('Organization settings saved.'); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  return <section className="record-workspace"><div className="workspace-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Workspace settings</h1><p>Your organization, preferences, and activity in one place.</p></div></div>
    <div className="workspace-tabs"><button className={tab === 'organization' ? 'selected' : ''} onClick={() => setTab('organization')}>Organization</button>{user?.role === 'admin' && <button className={tab === 'audit' ? 'selected' : ''} onClick={() => setTab('audit')}>Audit trail</button>}</div>
    {error && <div className="ws-error" role="alert">{error}</div>}{notice && <div className="ws-notice" role="status">{notice}</div>}
    {tab === 'organization' ? <div className="workspace-panel">{data ? <form onSubmit={save}><fieldset className="dialog-body field-grid" disabled={busy || user?.role !== 'admin'}>
      <label><span>Company name *</span><input required value={data.companyName} onChange={e => setData({...data, companyName:e.target.value})}/></label>
      <label><span>Contact email</span><input type="email" value={data.contactEmail} onChange={e => setData({...data, contactEmail:e.target.value})}/></label>
      <label><span>Timezone</span><select value={data.timezone} onChange={e => setData({...data, timezone:e.target.value})}>{[...new Set([data.timezone, 'UTC','Asia/Kolkata','America/New_York','America/Chicago','America/Los_Angeles','Europe/London','Asia/Dubai','Asia/Singapore','Australia/Sydney'])].map(v => <option key={v}>{v}</option>)}</select></label>
      <label><span>Currency</span><select value={data.currency} onChange={e => setData({...data, currency:e.target.value})}>{['USD','INR','EUR','GBP','CAD'].map(v => <option key={v}>{v}</option>)}</select></label>
      <label className="wide"><span>Website</span><input type="url" placeholder="https://example.com" value={data.website} onChange={e => setData({...data, website:e.target.value})}/></label>
      <label className="wide"><span>Business address</span><textarea rows={3} value={data.address} onChange={e => setData({...data, address:e.target.value})}/></label>
      </fieldset><div className="dialog-footer">{user?.role === 'admin' ? <button className="ws-button primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button> : <p>Only administrators can update organization settings.</p>}</div></form> : <div className="ws-state">Loading organization…</div>}</div> :
      <div className="workspace-panel"><div className="workspace-toolbar"><div><h3>Recent workspace activity</h3><p>Latest 200 changes. Audit entries are read-only.</p></div><button className="ws-button" onClick={() => exportCsv('audit-trail',audit)}>Export CSV</button></div><div className="workspace-table-scroll"><table className="workspace-table"><thead><tr><th>When</th><th>Team member</th><th>Action</th><th>Module</th><th>Record</th></tr></thead><tbody>{audit.map(a => <tr key={a.id}><td>{new Date(a.createdAt).toLocaleString()}</td><td>{a.actor}</td><td><span className="ws-badge">{a.action}</span></td><td>{a.resource}</td><td>{a.label || '—'}</td></tr>)}</tbody></table>{!audit.length && <div className="ws-state">No changes recorded yet.</div>}</div></div>}
  </section>;
}

