export const INPUT_CLASS =
  "form-input w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary";

export const LABEL_CLASS = "block text-sm font-medium text-gray-900 mb-2";

export const LABEL_CLASS_TIGHT = "block text-sm font-medium text-gray-900 mb-1.5";

type Props = {
  label: string;
  htmlFor?: string;
  span?: string;
  required?: boolean;
  labelClass?: string;
  children: React.ReactNode;
};

const FormField = ({
  label,
  htmlFor,
  span = "md:col-span-6",
  required,
  labelClass = LABEL_CLASS,
  children,
}: Props) => (
  <div className={`col-span-12 ${span}`}>
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    {children}
  </div>
);

export default FormField;
