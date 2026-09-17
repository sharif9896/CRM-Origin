import { Link } from "react-router-dom";
import { useAccess } from '../../hooks/useAccess';
import { permissionForPath, resourceForPath } from '../../lib/access';

type Props = {
  viewTo: string;
  editTo: string;
  onDelete: () => void;
  label: string;
};

const RowActions = ({ viewTo, editTo, onDelete, label }: Props) => {
  const { can } = useAccess();
  const resource = resourceForPath(viewTo);
  const canEdit = can(permissionForPath(editTo));
  const canDelete = resource ? can(`${resource}:delete`) : false;
  return (
  <div className="hs-dropdown [--placement:bottom-right] [--auto-close:inside] relative inline-flex">
    <button
      type="button"
      className="hs-dropdown-toggle size-9 rounded-full cursor-pointer hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors text-base"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label={`Actions for ${label}`}
    >
      <i className="icon-ellipsis-vertical" />
    </button>
    <div
      className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-40 bg-white border border-border-color shadow rounded-lg mt-2 z-1"
      role="menu"
      aria-orientation="vertical"
    >
      <div className="p-2 space-y-1">
        <Link
          to={viewTo}
          className="flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white"
        >
          <i className="icon-eye me-2" />
          View
        </Link>
        {canEdit && <Link
          to={editTo}
          className="flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white"
        >
          <i className="icon-pencil-line me-2" />
          Edit
        </Link>}
        {canDelete && <button
          type="button"
          onClick={onDelete}
          className="w-full flex items-center hover:bg-primary-50 px-4 py-1.75 rounded-lg text-sm text-default hover:text-primary focus:outline-hidden focus:bg-white cursor-pointer"
        >
          <i className="icon-trash-2 me-2" />
          Delete
        </button>}
      </div>
    </div>
  </div>
  );
};

export default RowActions;
