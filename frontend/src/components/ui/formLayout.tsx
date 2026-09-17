const TONE_TILE: Record<string, string> = {
  info: "bg-info/10 text-info",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
};

export const FormCardHeader = ({
  icon,
  tone = "info",
  title,
  subtitle,
}: {
  icon: string;
  tone?: keyof typeof TONE_TILE;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-color">
    <div
      className={`size-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${TONE_TILE[tone]}`}
    >
      <i className={icon} />
    </div>
    <div>
      <h2 className="text-xl max-lg:text-lg font-bold text-gray-900 mb-0">{title}</h2>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export const FormGroup = ({
  title,
  bordered,
  children,
}: {
  title: string;
  bordered?: boolean;
  children: React.ReactNode;
}) => (
  <div className={bordered ? "mb-6 pb-6 border-b border-border-color" : "mb-6"}>
    <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

export const FormActions = ({
  cancelTo,
  submitLabel,
  icon,
}: {
  cancelTo: React.ReactNode;
  submitLabel: string;
  icon?: string;
}) => (
  <div className="flex items-center gap-2">
    {cancelTo}
    <button
      type="submit"
      className="py-2 px-4 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover cursor-pointer inline-flex items-center gap-2"
    >
      {icon && <i className={icon} />}
      {submitLabel}
    </button>
  </div>
);

export const CANCEL_CLASS =
  "py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg hover:bg-gray-50 cursor-pointer";

export const QuickTips = ({ tips }: { tips: string[] }) => (
  <div className="col-span-12 xl:col-span-4">
    <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Tips</h3>
      <ul className="space-y-3 text-sm text-gray-600 p-0">
        {tips.map((tip) => (
          <li key={tip} className="flex items-center gap-2">
            <i className="icon-circle-check text-primary mt-0.5 shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
