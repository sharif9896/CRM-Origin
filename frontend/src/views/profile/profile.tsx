import { useEffect, useState } from 'react';
import { meRequest, updateProfileRequest, updatePasswordRequest } from '../../lib/api/auth';
import { useAppDispatch, useAuth } from '../../store/hooks';
import { fetchMe } from '../../store/authSlice';
import { setToken } from '../../lib/apiClient';
export default function Profile() {
  const { user } = useAuth(); const dispatch = useAppDispatch();
  const [name,setName] = useState(user?.name || ''); const [phone,setPhone] = useState(''); const [avatar,setAvatar] = useState(user?.avatar || '');
  const [currentPassword,setCurrent] = useState(''); const [newPassword,setNew] = useState(''); const [confirm,setConfirm] = useState('');
  const [error,setError] = useState(''); const [notice,setNotice] = useState(''); const [busy,setBusy] = useState(false);
  useEffect(() => { meRequest().then(r => { setName(r.data.name); setAvatar(r.data.avatar || ''); setPhone(r.data.phone || ''); }).catch(e => setError(e.message)); }, []);
  const save = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setError(''); setNotice(''); try { await updateProfileRequest({name,phone,avatar}); await dispatch(fetchMe()); setNotice('Your profile has been updated.'); } catch(e) { setError((e as Error).message); } finally { setBusy(false); } };
  const password = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setNotice(''); if(newPassword !== confirm) { setError('New passwords do not match.'); return; } setBusy(true); try { const r = await updatePasswordRequest({currentPassword,newPassword}); setToken(r.token); setCurrent(''); setNew(''); setConfirm(''); setNotice('Password updated successfully.'); } catch(e) { setError((e as Error).message); } finally { setBusy(false); } };
  return <section className="record-workspace"><div className="workspace-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>My profile</h1><p>Manage your personal information and sign-in security.</p></div><span className="ws-badge">{user?.role}</span></div>
    {error && <div className="ws-error" role="alert">{error}</div>}{notice && <div className="ws-notice" role="status">{notice}</div>}
    <div className="profile-grid"><div className="workspace-panel"><div className="profile-banner"><span className="profile-initials">{name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span><div><h2>{user?.name}</h2><p>{user?.email}</p></div></div>
      <form onSubmit={save}><fieldset disabled={busy} className="dialog-body field-grid"><label><span>Full name *</span><input required value={name} onChange={e=>setName(e.target.value)}/></label><label><span>Phone</span><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}/></label><label className="wide"><span>Avatar URL</span><input value={avatar} onChange={e=>setAvatar(e.target.value)} placeholder="https://…"/></label></fieldset><div className="dialog-footer"><button className="ws-button primary" disabled={busy}>Save profile</button></div></form></div>
      <div className="workspace-panel"><div className="dialog-header"><h2>Change password</h2><i className="icon-shield-check"/></div><form onSubmit={password}><fieldset disabled={busy} className="dialog-body field-grid"><label className="wide"><span>Current password</span><input type="password" autoComplete="current-password" required value={currentPassword} onChange={e=>setCurrent(e.target.value)}/></label><label className="wide"><span>New password</span><input type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={e=>setNew(e.target.value)}/></label><label className="wide"><span>Confirm new password</span><input type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label></fieldset><div className="dialog-footer"><button className="ws-button primary" disabled={busy}>Update password</button></div></form></div></div>
  </section>;
}

