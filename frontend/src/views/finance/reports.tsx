import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { exportCsv } from '../../lib/exportCsv';
type Month = { month: string; revenue: number; expenses: number; net: number };
type ReportData = { year: number; currency: string; months: Month[]; received: number; invoiceStatuses: { status: string; amount: number; count: number }[] };
export default function Reports() {
  const [year,setYear] = useState(new Date().getFullYear()); const [data,setData] = useState<ReportData>({year, currency:'USD', months:[], received:0, invoiceStatuses:[]}); const [loading,setLoading] = useState(true); const [error,setError] = useState(''); const [revision,setRevision] = useState(0);
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Refresh starts a new network request.
    let active=true; setLoading(true); setError('');
    apiRequest<{data:ReportData}>('/workspace/reports',{params:{year}})
      .then(response=>{if(active)setData(response.data);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);}); return()=>{active=false;}; },[revision,year]);
  const months = data.months;
  const totals=months.reduce((s,m)=>({revenue:s.revenue+m.revenue,expenses:s.expenses+m.expenses,net:s.net+m.net}),{revenue:0,expenses:0,net:0});
  const money=(n:number)=>new Intl.NumberFormat('en',{style:'currency',currency:data.currency,maximumFractionDigits:0}).format(n);
  const max=Math.max(1,...months.flatMap(m=>[m.revenue,m.expenses]));
  return <section className="record-workspace"><div className="workspace-heading"><div><span className="eyebrow">FINANCE / INTELLIGENCE</span><h1>Financial overview</h1><p>Live reporting from your recorded transactions, payments, and invoices.</p></div><div className="workspace-actions"><label>Year <input className="year-input" aria-label="Report year" type="number" min={2000} max={2100} value={year} onChange={e=>setYear(Number(e.target.value))}/></label><button className="ws-button" disabled={loading} onClick={()=>exportCsv('financial-report-'+year,months)}><i className="icon-download"/> Export CSV</button><button className="ws-button" onClick={()=>window.print()}><i className="icon-printer"/> Print</button></div></div>
  {error ? <div className="ws-error" role="alert">{error}<button onClick={()=>setRevision(r=>r+1)}>Retry</button></div> : loading ? <div className="ws-state">Loading financial data…</div> : <>
  <div className="metric-grid">{[{label:'Recorded revenue',value:totals.revenue,icon:'icon-trending-up'},{label:'Recorded expenses',value:totals.expenses,icon:'icon-arrow-up-right'},{label:'Net cash flow',value:totals.net,icon:'icon-wallet'},{label:'Payments received',value:data.received,icon:'icon-credit-card'}].map(m=><article className="metric-card" key={m.label}><i className={m.icon}/><p>{m.label}</p><h2>{money(m.value)}</h2><small>Calendar year {year}</small></article>)}</div>
  <div className="workspace-panel"><div className="workspace-toolbar"><div><h2>Revenue & expenses</h2><p>Completed ledger transactions • {year}</p></div><span className="ws-badge">Revenue / Expenses</span></div><div className="financial-chart" role="img" aria-label={'Monthly revenue and expenses for '+year}>{months.map(m=><div className="chart-month" key={m.month}><div className="chart-bars"><span title={m.month+' revenue: '+money(m.revenue)} style={{height:Math.max(1,m.revenue/max*100)+'%'}}/><span title={m.month+' expenses: '+money(m.expenses)} style={{height:Math.max(1,m.expenses/max*100)+'%'}}/></div><small>{m.month.slice(0,3)}</small></div>)}</div>
  <div className="workspace-table-scroll"><table className="workspace-table"><thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Net cash flow</th></tr></thead><tbody>{months.map(m=><tr key={m.month}><td>{m.month} {year}</td><td>{money(m.revenue)}</td><td>{money(m.expenses)}</td><td>{money(m.net)}</td></tr>)}</tbody></table></div></div>
  <div className="workspace-panel report-invoices"><div className="workspace-toolbar"><h2>Invoice status</h2><span>All dates</span></div><div className="metric-grid">{data.invoiceStatuses.map(item=><div className="metric-card" key={item.status}><p>{item.status}</p><h2>{money(item.amount)}</h2><small>{item.count} invoices</small></div>)}</div></div>
  </>}</section>;
}

