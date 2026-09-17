import { useId, useState } from 'react';
import { uploadImages } from '../../lib/api/uploads';

type Props = {
  label: string;
  resource: 'properties' | 'customers' | 'agents' | 'staff';
  values: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
};

const previewSource = (value: string) => /^(https?:|data:|blob:|\/)/.test(value) ? value : `/${value}`;

export default function ImagePicker({ label, resource, values, onChange, multiple = false, maxFiles = multiple ? 10 : 1, disabled = false }: Props) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const current = values.filter(Boolean).slice(0, maxFiles);

  const choose = async (selected: File[]) => {
    setError('');
    const files = selected.slice(0, multiple ? Math.max(0, maxFiles - current.length) : 1);
    if (!files.length) return;
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type))) return setError('Choose JPG, PNG, WebP, or GIF images.');
    if (files.some(file => file.size > 5 * 1024 * 1024)) return setError('Each image must be 5 MB or smaller.');
    setUploading(true);
    try {
      const uploaded = await uploadImages(resource, files);
      const urls = uploaded.map(image => image.url);
      onChange(multiple ? [...current, ...urls].slice(0, maxFiles) : urls.slice(0, 1));
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return <div className="image-picker">
    <div className="image-picker-heading"><div><strong>{label}</strong><span>{multiple ? `Up to ${maxFiles} images` : 'One image'} · JPG, PNG, WebP or GIF · 5 MB max</span></div>{current.length > 0 && <span className="ws-badge">{current.length}/{maxFiles}</span>}</div>
    {current.length > 0 && <div className="image-preview-grid">{current.map((value, index) => <figure key={value}><img src={previewSource(value)} alt={`${label} preview ${index + 1}`}/><button type="button" aria-label={`Remove ${label} image ${index + 1}`} onClick={() => onChange(current.filter((_, itemIndex) => itemIndex !== index))}><i className="icon-x"/></button></figure>)}</div>}
    <label className={`image-dropzone ${disabled || uploading || current.length >= maxFiles ? 'disabled' : ''}`} htmlFor={id} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (!disabled && !uploading) void choose(Array.from(event.dataTransfer.files)); }}>
      <i className={uploading ? 'icon-loader-circle image-picker-spin' : 'icon-image-plus'}/>
      <span>{uploading ? 'Uploading securely…' : current.length ? 'Choose another image' : 'Choose image from your device'}</span>
      <small>You can also drag and drop here</small>
    </label>
    <input id={id} className="image-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={multiple} disabled={disabled || uploading || current.length >= maxFiles} onChange={event => { void choose(Array.from(event.target.files || [])); event.target.value = ''; }}/>
    {error && <p className="image-picker-error" role="alert">{error}</p>}
  </div>;
}
