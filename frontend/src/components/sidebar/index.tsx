import { Fragment } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { all_routes } from "../../routes/all_routes";
import { sidebarMenu } from "../../data/sidebarMenu";
import { useLayout } from "../../hooks/useLayout";
import ImageWithBasePath from "../ui/imageWithBasePath";
import MenuItem from "./menuItem";
import { useAccess } from '../../hooks/useAccess';
import { menuPermissionForRoute } from '../../lib/access';
import type { MenuItem as MenuItemType } from '../../data/sidebarMenu';

const visibleItem = (item: MenuItemType, role: string, can: (permission: string | null) => boolean): MenuItemType | null => {
  if (item.children?.length) {
    const children = item.children.map(child => visibleItem(child, role, can)).filter((child): child is MenuItemType => child !== null);
    return children.length ? { ...item, children } : null;
  }
  if (!item.routeKey) return null;
  if (['roles', 'users', 'settings', 'notificationStatus'].includes(item.routeKey)) return role === 'admin' ? item : null;
  const allowed = can(menuPermissionForRoute(item.routeKey));
  return allowed ? item : null;
};

const Sidebar = () => {
  const {
    miniSidebar,
    toggleMiniSidebar,
    setExpandMenu,
    closeMobileSidebar,
  } = useLayout();
  const { role, can } = useAccess();
  const groups = sidebarMenu.map(group => ({ ...group, items: group.items.map(item => visibleItem(item, role, can)).filter((item): item is MenuItemType => item !== null) })).filter(group => group.items.length);

  return (
    <aside
      className="sidebar"
      id="sidebar"

      onMouseEnter={() => miniSidebar && setExpandMenu(true)}
      onMouseLeave={() => miniSidebar && setExpandMenu(false)}
    >
      <div className="sidebar-logo">
        <div className="flex items-center">
          <Link to={all_routes.dashboard} className="logo logo-normal sidebar-brand-logo">
            <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
          </Link>
          <Link to={all_routes.dashboard} className="logo-small sidebar-brand-logo sidebar-brand-logo-compact">
            <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
          </Link>
          <Link to={all_routes.dashboard} className="dark-logo sidebar-brand-logo">
            <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
          </Link>
        </div>
        <button
          className={`sidenav-toggle-btn btn border-0 p-0 ${miniSidebar ? "" : "active"}`}
          id="toggle_btn"
          type="button"
          aria-label="Collapse sidebar"
          onClick={toggleMiniSidebar}
        >
          <i className="icon-chevron-left" />
        </button>
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close menu"
          onClick={closeMobileSidebar}
        >
          <i className="icon icon-x align-middle" />
        </button>
      </div>

      <SimpleBar className="sidebar-inner">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul role="menu" aria-label="Main navigation">
            {groups.map((group) => (
              <Fragment key={group.title}>
                <li className="menu-title" aria-disabled="true">
                  <span>{group.title}</span>
                </li>
                {group.items.map((item) => (
                  <MenuItem key={item.label} item={item} />
                ))}
              </Fragment>
            ))}
          </ul>
        </div>

        {can('leads:create') && <div className="m-4 p-4 rounded-lg border border-border-color bg-white">
          <span className="eyebrow">YOUR NEXT OPPORTUNITY</span>
          <p className="text-sm text-gray-600 mb-3">Keep your pipeline moving.</p>
          <Link to={all_routes.addLead} className="ws-button primary">Create a lead <i className="icon-plus" /></Link>
        </div>}
      </SimpleBar>
    </aside>
  );
};

export default Sidebar;
