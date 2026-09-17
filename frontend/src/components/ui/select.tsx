import { Dropdown } from "primereact/dropdown";

type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  inputId?: string;
};

const Select = ({ value, options, onChange, placeholder = "Select", inputId }: Props) => (
  <Dropdown
    inputId={inputId}
    value={value || null}
    options={options.map((o) => ({ label: o, value: o }))}
    onChange={(e) => onChange(e.value ?? "")}
    placeholder={placeholder}
    className="crm-select w-full"
    panelClassName="crm-select-panel"
    // Render at the body so the panel is never clipped by a modal or a
    // scrolling table wrapper.
    appendTo={typeof document !== "undefined" ? document.body : undefined}
  />
);

export default Select;
