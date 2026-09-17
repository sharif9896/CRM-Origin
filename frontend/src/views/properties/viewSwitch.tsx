import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

const VIEWS = [
  { key: "grid", to: all_routes.propertyGrid, icon: "icon-grid-3x3", label: "Grid view" },
  { key: "list", to: all_routes.propertyList, icon: "icon-list", label: "List view" },
  { key: "map", to: all_routes.propertyMap, icon: "icon-map", label: "Map view" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

const ViewSwitch = ({ active, map = false }: { active: ViewKey; map?: boolean }) => (
  <div className="inline-flex items-center bg-white border border-border-color rounded-full p-1">
    {(map ? VIEWS : VIEWS.slice(0, 2)).map((view) => (
      <Link
        key={view.key}
        to={view.to}
        aria-label={view.label}
        aria-current={view.key === active ? "page" : undefined}
        className={`size-8 flex items-center justify-center rounded-full text-sm ${
          view.key === active ? "bg-primary text-white" : "text-gray-600 hover:bg-light"
        }`}
      >
        <i className={view.icon} />
      </Link>
    ))}
  </div>
);

export default ViewSwitch;
