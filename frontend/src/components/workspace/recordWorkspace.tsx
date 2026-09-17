import { csvDataUrl } from "../../lib/exportCsv";
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { createResource, updateResource, deleteResource, listResource } from '../../lib/api/resource';
import ImagePicker from '../ui/imagePicker';
import PermissionChecklist from './permissionChecklist';
type Row = { id: string; [key: string]: unknown };
type Field = { key: string; type: string; required: boolean; options: string[]; ref?: string; min?: number; max?: number; default?: unknown; arrayOf?: string };
type Item = { description: string; quantity: number; unitPrice: number; tax: number };
type Page = { data: Row[]; total: number; pages: number };
const humanize = (s: string) => s.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
const display = (v: unknown): string => v == null || v === '' ? '-' : typeof v === 'boolean' ? v ? 'Yes' : 'No' : typeof v === 'object' ? JSON.stringify(v) : String(v);
export default function RecordWorkspace({ resource, params = {}, title, summary }: { resource: string; params?: Record<string, string>; title?: string; summary?: ReactNode }) {
 const [fields,setFields]=useState<Field[]>([]);
 const [data,setData]=useState<Page>({data:[],total:0,pages:1});
 const [query,setQuery]=useState(''); const [search,setSearch]=useState(''); const [page,setPage]=useState(1);
 const [sort,setSort]=useState('-createdAt'); const [revision,setRevision]=useState(0);
 const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [notice,setNotice]=useState('');
 const [editing,setEditing]=useState<Row|'new'|null>(null); const [viewing,setViewing]=useState<Row|null>(null); const [deleting,setDeleting]=useState<Row|null>(null);
 const [values,setValues]=useState<Record<string,unknown>>({}); const [busy,setBusy]=useState(false); const [formError,setFormError]=useState('');
 const [permissions,setPermissions]=useState<string[]>([]); const [available,setAvailable]=useState<string[]>([]);
 const [accessRole,setAccessRole]=useState('');
 const [references,setReferences]=useState<Record<string,Row[]>>({});
 const dialog=useRef<HTMLDialogElement>(null); const lock=useRef(false); const paramsKey=JSON.stringify(params);
 const allowed=(a:string)=>accessRole==='admin'||permissions.includes(resource+':'+a);
 useEffect(()=>{const t=setTimeout(()=>{setSearch(query);setPage(1);},250);return()=>clearTimeout(t);},[query]);
 useEffect(()=>{
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Pagination and filters start a new request.
  let active=true;setLoading(true);setError('');
  Promise.all([
   apiRequest<Page>('/'+resource,{params:{...JSON.parse(paramsKey),page,limit:15,search,sort}}),
   apiRequest<{data:Field[]}>('/workspace/schema/'+resource),
   apiRequest<{data:{role:string;permissions:string[];available:string[]}}>('/workspace/access'),
  ]).then(([records,schema,access])=>{if(active){setData(records);setFields(schema.data);setAccessRole(access.data.role);setPermissions(access.data.permissions);setAvailable(access.data.available);}})
    .catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[resource,paramsKey,page,search,sort,revision]);
 useEffect(()=>{if(editing||viewing||deleting)dialog.current?.showModal();else dialog.current?.close();},[editing,viewing,deleting]);
 const close=()=>{if(!busy){setEditing(null);setViewing(null);setDeleting(null);setFormError('');}};
 const set=(key:string,value:unknown)=>setValues(v=>({...v,[key]:value}));
 const begin=async(row:Row|'new')=>{
  setFormError('');
  setValues(Object.fromEntries(fields.map(f=>{
   const v=row==='new'?JSON.parse(paramsKey)[f.key]??f.default??(f.type==='Boolean'?false:f.type==='Date'?new Date().toISOString().slice(0,10):f.type==='Array'?[]:''):row[f.key];
   return [f.key,f.type==='Date'&&v?String(v).slice(0,10):f.key==='images'?Array.isArray(v)?v:[]:f.type==='Array'&&!['permissions','items'].includes(f.key)?f.arrayOf==='String'?(Array.isArray(v)?v.join('\n'):''):JSON.stringify(v||[],null,2):v??''];
  })));
  setEditing(row);
  const models:Record<string,string>={Customer:'customers',Property:'properties',Agent:'agents',Invoice:'invoices',User:'users',ReimbursementType:'reimbursement-types'};
  const results=await Promise.allSettled(fields.filter(f=>f.ref).map(async f=>[f.key,await listResource<Row>(models[f.ref!]||f.ref!.toLowerCase()+'s')] as const));
  setReferences(Object.fromEntries(results.flatMap(r=>r.status==='fulfilled'?[r.value]:[])));
 };
 const changed=(message:string)=>{setNotice(message);setRevision(n=>n+1);setEditing(null);setDeleting(null);window.dispatchEvent(new Event('crm:records-changed'));if(['roles','users'].includes(resource))window.dispatchEvent(new Event('crm:permissions-changed'));};
 const save=async(event:React.FormEvent)=>{
  event.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setFormError('');
  try{
   const body:Record<string,unknown>={};
   for(const f of fields){
    const v=values[f.key];
    if(f.type==='ObjectId'||f.type==='Date')body[f.key]=v||null;
    else if(f.type==='Number')body[f.key]=v===''?(f.required?0:null):Number(v);
    else if(f.type==='Array')body[f.key]=['permissions','items','images'].includes(f.key)?v:f.arrayOf==='String'?String(v||'').split('\n').map(s=>s.trim()).filter(Boolean):JSON.parse(String(v||'[]'));
    else body[f.key]=v;
   }
   if(resource==='deals')body.price=Number(body.value||0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
   if(resource==='reviews')body.replied=!!body.reply;
   if(editing==='new')await createResource(resource,body);else if(editing)await updateResource(resource,editing.id,body);
   changed('Record saved successfully.');
  }catch(e){setFormError((e as Error).message);}finally{setBusy(false);lock.current=false;}
 };
 const remove=async()=>{
  if(!deleting||lock.current)return;lock.current=true;setBusy(true);setFormError('');
  try{await deleteResource(resource,deleting.id);changed('Record deleted.');setPage(1);}catch(e){setFormError((e as Error).message);}finally{setBusy(false);lock.current=false;}
 };
 const preferredColumns:Record<string,string[]>={reimbursements:['claimNumber','employeeName','kind','category','amount','status'],'reimbursement-types':['name','code','kind','category','defaultLimit','active']};
 const columns=(preferredColumns[resource]?.map(key=>fields.find(field=>field.key===key)).filter((field):field is Field=>!!field)||fields.filter(f=>!['password','avatar','image','images','agentAvatar','description','comment','reply','items','notes','amenities','permissions'].includes(f.key)&&!f.ref)).slice(0,6);
 const itemValues=Array.isArray(values.items)?values.items as Item[]:[];
 const exportUrl=csvDataUrl(data.data);
 return <section className="record-workspace">
  <div className="workspace-heading"><div><span className="eyebrow">WORKSPACE / RECORDS</span><h1>{title||humanize(resource)}</h1><p>A complete, connected view of your business.</p></div>
   <div className="workspace-actions">{exportUrl&&!busy?<a className="ws-button" href={exportUrl} download={resource+'-page-'+page+'.csv'}><i className="icon-download"/> Export page CSV</a>:<button className="ws-button" disabled><i className="icon-download"/> Export page CSV</button>}{allowed('create')&&<button className="ws-button primary" disabled={loading} onClick={()=>void begin('new')}><i className="icon-plus"/> Add record</button>}</div>
  </div>
  {notice&&<div className="ws-notice" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={()=>setNotice('')}>x</button></div>}
  {summary}
  <div className="workspace-panel"><div className="workspace-toolbar"><label className="workspace-search"><i className="icon-search"/><input aria-label="Search records" placeholder={'Search '+(title?.toLowerCase()||resource)+'...'} value={query} onChange={e=>setQuery(e.target.value)}/></label><span>{data.total.toLocaleString()} records</span><button className="ws-button" onClick={()=>setRevision(n=>n+1)} aria-label="Refresh records"><i className="icon-refresh-cw"/></button></div>
   {error?<div className="ws-state" role="alert"><h3>Unable to load records</h3><p>{error}</p><button className="ws-button" onClick={()=>setRevision(n=>n+1)}>Try again</button></div>:loading?<div className="ws-state" role="status">Loading records...</div>:<>
   <div className="workspace-table-scroll"><table className="workspace-table"><thead><tr>{columns.map(f=><th key={f.key}><button onClick={()=>{setSort(sort===f.key?'-'+f.key:f.key);setPage(1);}}>{humanize(f.key)} {sort.replace('-','')===f.key?sort.startsWith('-')?'↓':'↑':'↕'}</button></th>)}<th>Actions</th></tr></thead><tbody>{data.data.map(row=><tr key={row.id}>{columns.map((f,i)=><td key={f.key}>{i===0?<button className="record-name" onClick={()=>setViewing(row)}>{display(row[f.key])}</button>:['status','stage','type'].includes(f.key)?<span className="ws-badge">{display(row[f.key])}</span>:f.type==='Date'&&row[f.key]?new Date(String(row[f.key])).toLocaleDateString():f.type==='Number'?Number(row[f.key]||0).toLocaleString():display(row[f.key])}</td>)}<td><div className="row-buttons"><button aria-label="View record" onClick={()=>setViewing(row)}><i className="icon-eye"/></button>{allowed('update')&&<button aria-label="Edit record" onClick={()=>void begin(row)}><i className="icon-pencil"/></button>}{allowed('delete')&&<button aria-label="Delete record" onClick={()=>{setFormError('');setDeleting(row);}}><i className="icon-trash-2"/></button>}</div></td></tr>)}</tbody></table></div>
   {!data.data.length&&<div className="ws-state"><i className="icon-folder-open"/><h3>{search?'No matching records':'Your workspace is ready'}</h3><p>{search?'Try another search.':'Add your first record to get started.'}</p></div>}
   <div className="workspace-pagination"><span>Page {page} of {Math.max(1,data.pages)}</span><div><button className="ws-button" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button><button className="ws-button" disabled={page>=data.pages} onClick={()=>setPage(p=>p+1)}>Next</button></div></div></>}
  </div>
  <dialog ref={dialog} className="workspace-dialog" onCancel={e=>{e.preventDefault();close();}}><div className="dialog-header"><div><span className="eyebrow">{humanize(resource)}</span><h2>{deleting?'Delete this record?':viewing?'Record details':editing==='new'?'Create a record':'Edit record'}</h2></div><button className="ws-button" aria-label="Close dialog" disabled={busy} onClick={close}>x</button></div>
   {formError&&<div className="ws-error" role="alert">{formError}</div>}
   {deleting?<div className="dialog-body"><p>Delete <strong>{display(deleting[columns[0]?.key]||deleting.id)}</strong>? This action cannot be undone.</p><div className="dialog-footer"><button className="ws-button" disabled={busy} onClick={close}>Cancel</button><button className="ws-button danger" disabled={busy} onClick={()=>void remove()}>{busy?'Deleting...':'Delete record'}</button></div></div>:viewing?<div className="dialog-body"><dl className="record-details">{fields.filter(f=>f.key!=='password').map(f=><div key={f.key}><dt>{humanize(f.key)}</dt><dd>{display(viewing[f.key])}</dd></div>)}</dl></div>:editing&&<form onSubmit={save}><fieldset disabled={busy} className="dialog-body field-grid">{fields.filter(f=>!(f.key in JSON.parse(paramsKey))).map(f=>f.key==='items'?<div className="wide" key={f.key} style={{gridColumn:'1 / -1'}}><span>Line items</span>{itemValues.map((item,index)=><div className="field-grid" key={index} style={{padding:'12px 0',borderBottom:'1px solid var(--ws-line)'}}>{(['description','quantity','unitPrice','tax'] as const).map(key=><label key={key}><span>{humanize(key)}</span><input required type={key==='description'?'text':'number'} min={key==='quantity'?1:0} max={key==='tax'?100:undefined} step={key==='description'?undefined:'any'} value={item[key]??''} onChange={e=>set('items',itemValues.map((it,i)=>i===index?{...it,[key]:key==='description'?e.target.value:Number(e.target.value)}:it))}/></label>)}<button type="button" className="ws-button" onClick={()=>set('items',itemValues.filter((_,i)=>i!==index))}>Remove line</button></div>)}<button className="ws-button" type="button" onClick={()=>set('items',[...itemValues,{description:'',quantity:1,unitPrice:0,tax:0}])}>Add line item</button></div>:f.key==='permissions'?<div className="wide" key={f.key}><PermissionChecklist available={available} value={Array.isArray(values[f.key])?values[f.key] as string[]:[]} onChange={next=>set(f.key,next)}/></div>:['image','avatar','agentAvatar','images'].includes(f.key)&&['properties','customers','agents','staff'].includes(resource)?<div className={f.key==='images'?'wide':''} key={f.key}><ImagePicker label={humanize(f.key)} resource={resource as 'properties'|'customers'|'agents'|'staff'} values={f.key==='images'?(Array.isArray(values[f.key])?values[f.key] as string[]:[]):values[f.key]?[String(values[f.key])]:[]} multiple={f.key==='images'} onChange={images=>set(f.key,f.key==='images'?images:images[0]||'')}/></div>:<label key={f.key} className={f.type==='Array'||['description','notes','comment','reply'].includes(f.key)?'wide':''}><span>{humanize(f.key)}{f.required?' *':''}</span>
    {f.type==='Boolean'?<input type="checkbox" checked={!!values[f.key]} onChange={e=>set(f.key,e.target.checked)}/>
    :f.options.length||f.ref?<select required={f.required} value={String(values[f.key]||'')} onChange={e=>set(f.key,e.target.value)}><option value="">Select...</option>{f.ref?(references[f.key]||[]).map(r=><option value={r.id} key={r.id}>{display(r.name||r.number||r.title||r.id)}</option>):f.options.map(o=><option value={o} key={o}>{f.key==='role'?humanize(o):o}</option>)}</select>
    :f.type==='Array'||['description','notes','comment','reply'].includes(f.key)?<><textarea required={f.required} rows={4} value={String(values[f.key]||'')} onChange={e=>set(f.key,e.target.value)}/>{f.type==='Array'&&<small>Enter one value per line.</small>}</>
    :<input required={f.key==='password'?editing==='new':f.required} type={f.key==='password'?'password':f.type==='Number'?'number':f.type==='Date'?'date':f.key.toLowerCase().includes('email')?'email':'text'} min={f.min} max={f.max} step={f.type==='Number'?'any':undefined} autoComplete={f.key==='password'?'new-password':undefined} value={String(values[f.key]??'')} onChange={e=>set(f.key,e.target.value)}/>}
   </label>)}</fieldset><div className="dialog-footer"><button className="ws-button" type="button" disabled={busy} onClick={close}>Cancel</button><button className="ws-button primary" disabled={busy} type="submit">{busy?'Saving...':'Save record'}</button></div></form>}
  </dialog>
 </section>;
}

