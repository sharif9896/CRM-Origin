import { useEffect } from "react";

type Props = {
  open: boolean;
  entity: string;
  name?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({ open, entity, name, onCancel, onConfirm }: Props) => {
  
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="w-full h-full fixed top-0 start-0 z-80 bg-gray-900/50 overflow-x-hidden overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="p-3 mt-0 sm:max-w-lg sm:w-full sm:mx-auto min-h-screen flex items-center justify-center"
        
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border border-border-color rounded-lg shadow-sm w-full">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center size-14 rounded-full bg-danger/10">
                  <i className="icon-trash-2 text-danger text-2xl!" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete {entity}?</h3>
              <p className="text-sm text-gray-600 mb-0">
                Are you sure you want to delete{" "}
                {name ? <span className="font-semibold text-gray-900">{name}</span> : `this ${entity}`}
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                className="btn px-4 py-2 rounded-full border border-border-color bg-white text-sm font-medium text-gray-900 hover:bg-light cursor-pointer"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn px-4 py-2 rounded-full bg-danger text-white text-sm font-medium hover:opacity-90 cursor-pointer"
                onClick={onConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
