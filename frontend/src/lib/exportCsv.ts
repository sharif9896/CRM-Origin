const display = (v: unknown): string => v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
export function csvDataUrl(rows: Record<string, unknown>[]) {
 if (!rows.length) return '';
 const keys = [...new Set(rows.flatMap(r => Object.keys(r)))].filter(k => !['_id', '__v', 'password'].includes(k));
 const cell = (v: unknown) => { const s = display(v); return '"' + (/^[=+@\-\t\r]/.test(s) ? "'" : '') + s.replace(/"/g, '""') + '"'; };
 const csv = '\ufeff' + [keys.map(cell).join(','), ...rows.map(r => keys.map(k => cell(r[k])).join(','))].join('\r\n');
 return 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
}
export function exportCsv(name: string, rows: Record<string, unknown>[]) {
 const href = csvDataUrl(rows);
 if (!href) return;
 const link = document.createElement('a');
 link.href = href;
 link.download = name + '.csv';
 link.style.display = 'none';
 document.body.appendChild(link);
 link.click();
 link.remove();
}
