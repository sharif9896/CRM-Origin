import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/apiClient';
import { useAccess } from '../../hooks/useAccess';
type Result = {id:string;name:string;resource:string;path:string};
export default function GlobalSearch() {
 const { can } = useAccess();
 const [query,setQuery]=useState(''); const [results,setResults]=useState<Result[]>([]); const [open,setOpen]=useState(false); const [loading,setLoading]=useState(false); const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();input.current?.focus();} if(e.key==='Escape')setOpen(false);};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);},[]);
 useEffect(()=>{let active=true; if(query.trim().length<2){return;}
 const allowedResources=['properties','leads','agents','customers'].filter(resource=>can(resource+':read'));
 const timer=setTimeout(()=>{setLoading(true);Promise.allSettled(allowedResources.map(async resource=>{const r=await apiRequest<{data:{id:string;name:string}[]}>('/'+resource,{params:{search:query,limit:4}});const detail:Record<string,string>={properties:'property',leads:'lead',agents:'agent',customers:'customer'};return r.data.map(row=>({...row,resource,path:'/'+resource+'/'+detail[resource]+'-details/'+row.id}));})).then(r=>{if(active){setResults(r.flatMap(x=>x.status==='fulfilled'?x.value:[]));setLoading(false);}});},250);
 return()=>{active=false;clearTimeout(timer);};},[query,can]);
 return <div className="header-search hidden md:flex"><div className="relative w-full"><label className="workspace-search"><i className="icon-search"/><input ref={input} aria-label="Search workspace" placeholder="Search your workspace…" value={query} onChange={e=>{setQuery(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)}/><kbd className="text-xs">Ctrl K</kbd></label>{open&&query.length>=2&&<div className="global-search-results">{loading?<p>Searching…</p>:results.length?results.map(r=><Link key={r.resource+r.id} to={r.path} onClick={()=>{setOpen(false);setQuery('');}}>{r.name}<small>{r.resource}</small></Link>):<p>No matching records.</p>}<button className="ws-button" onClick={()=>setOpen(false)}>Close</button></div>}</div></div>;
}

