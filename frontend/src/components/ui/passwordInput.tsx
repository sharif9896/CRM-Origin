import { useState } from "react";

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
};

const PasswordInput = ({
  id,
  label,
  placeholder = "••••••••••••",
  defaultValue,
  value,
  onChange,
  required,
  autoComplete,
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          {...(onChange
            ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) }
            : { defaultValue })}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 pe-10! focus:ring-0 focus:border-primary"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-900 hover:text-gray-600 focus:outline-none cursor-pointer"
        >
          <i className={`${visible ? "icon-eye" : "icon-eye-off"} text-base`} />
        </button>
      </div>
    </>
  );
};

export default PasswordInput;
