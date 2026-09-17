import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  submitLabel: string;
  size?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
};

const FormModal = ({
  open,
  title,
  subtitle,
  submitLabel,
  size = "sm:max-w-lg",
  onClose,
  onSubmit,
  children,
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="w-full h-full fixed top-0 start-0 z-80 bg-gray-900/50 overflow-x-hidden overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`p-3 mt-0 ${size} sm:w-full sm:mx-auto min-h-screen flex items-center justify-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border border-border-color rounded-lg shadow-sm w-full">
          <div className="flex items-center justify-between p-5 border-b border-border-color">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-0">{title}</h3>
              {subtitle && <p className="text-xs text-gray-500 mt-1 mb-0">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="size-8 inline-flex justify-center items-center rounded-full border border-border-color bg-white text-gray-900 hover:bg-light cursor-pointer"
            >
              <i className="icon-x" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="p-5 grid grid-cols-12 gap-4">{children}</div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border-color">
              <button
                type="button"
                onClick={onClose}
                className="btn px-4 py-2 rounded-full border border-border-color bg-white text-sm font-medium text-gray-900 hover:bg-light cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover cursor-pointer"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
