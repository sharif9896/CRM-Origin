type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TextEditor = ({
  value,
  onChange,
  placeholder = "Write a detailed description of the property...",
}: Props) => (
  <div className="crm-editor bg-white rounded-lg border border-border-color overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border-color bg-light/30 text-xs text-gray-600">
      <i className="icon-align-left" /> Plain-text description
    </div>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={8}
      maxLength={10000}
      className="w-full resize-y border-0 bg-white text-gray-900 text-sm p-4 focus:ring-0 focus:outline-none"
    />
  </div>
);

export default TextEditor;
