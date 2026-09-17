import { useEffect, useState } from 'react';
import { listResource } from '../lib/api/resource';
export function useResourceOptions(resource:string, params?:Record<string,string>) {
 const [options,setOptions]=useState<string[]>([]); const [error,setError]=useState(''); const key=JSON.stringify(params||{});
 useEffect(()=>{let active=true;listResource<{name:string}>(resource,JSON.parse(key)).then(rows=>{if(active)setOptions(rows.map(r=>r.name));}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[resource,key]);
 return { options,error };
}

