import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

export type Crumb = { label: string; to?: string };

type Props = {
  title: string;
  crumb?: string;
  crumbs?: Crumb[];
  action?: React.ReactNode;
};

const PageHeader = ({ title, crumb, crumbs, action }: Props) => {
  const trail: Crumb[] = crumbs ?? [{ label: crumb ?? title }];

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <div>
        <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{title}</h1>
        <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link to={all_routes.dashboard} className="hover:text-primary">
            Dashboard
          </Link>
          {trail.map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <i className="icon-chevron-right text-xs" />
              {item.to ? (
                <Link to={item.to} className="hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
