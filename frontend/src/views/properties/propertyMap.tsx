import { useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../routes/all_routes';
import type { Property } from '../../data/types';
import { useCrud } from '../../hooks/useCrud';
import PageHeader from '../../components/ui/pageHeader';
import ViewSwitch from './viewSwitch';
import ImageWithBasePath from '../../components/ui/imageWithBasePath';
import { formatPrice } from './constants';
export default function PropertyMap() {
 const crud=useCrud<Property>('properties',{pageSize:10000,searchKeys:['name','location','agent','type']});
 const [selected,setSelected]=useState('');
 const property=crud.rows.find(p=>p.id===selected)||crud.rows[0];
 return <div className="record-workspace"><PageHeader title="Property map" action={<ViewSwitch active="map" map/>}/>
 {crud.error&&<div className="ws-error" role="alert">{crud.error}</div>}
 <div className="profile-grid"><div className="workspace-panel"><div className="workspace-toolbar"><label className="workspace-search"><i className="icon-search"/><input aria-label="Search properties on map" value={crud.search} onChange={e=>crud.setSearch(e.target.value)} placeholder="Search properties…"/></label></div>
 <div style={{maxHeight:600,overflow:'auto'}}>{crud.loading?<div className="ws-state">Loading properties…</div>:crud.rows.map(p=><div key={p.id} style={{padding:16,borderBottom:'1px solid var(--ws-line)',background:property?.id===p.id?'#6366f10b':undefined}}><button onClick={()=>setSelected(p.id)} style={{display:'flex',gap:12,textAlign:'left',cursor:'pointer',width:'100%'}}><ImageWithBasePath src={p.image} alt="" className="size-14 rounded-lg object-cover"/><span><strong>{p.name}</strong><small style={{display:'block',color:'var(--ws-muted)'}}>{p.location}</small><span>{formatPrice(p.price)}</span></span></button><Link className="text-sm text-primary" to={all_routes.propertyDetails+'/'+p.id}>View property details →</Link></div>)}
 {!crud.loading&&!crud.rows.length&&<div className="ws-state">No matching properties.</div>}</div></div>
 <div className="workspace-panel">{property?<><div className="workspace-toolbar"><h2>{property.name}</h2><a className="ws-button" target="_blank" rel="noreferrer" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(property.location)}>Open map</a></div><iframe key={property.id} title={'Map of '+property.location} src={'https://maps.google.com/maps?q='+encodeURIComponent(property.location)+'&output=embed'} loading="lazy" referrerPolicy="no-referrer" style={{width:'100%',height:550,border:0}}/></>:<div className="ws-state">Select a property to explore its location.</div>}</div></div></div>;
}

