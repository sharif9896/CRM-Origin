import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { sidebarMenu, type MenuItem as MenuItemType } from "../../data/sidebarMenu";

const matchesPath = (path: string, pathname: string) =>
  pathname === path || pathname.startsWith(`${path}/`);

const collectPaths = (items: MenuItemType[]): string[] =>
  items.flatMap((item) => [
    ...(item.routeKey ? [all_routes[item.routeKey]] : []),
    ...collectPaths(item.children ?? []),
  ]);

const MENU_PATHS = collectPaths(sidebarMenu.flatMap((group) => group.items));

/**
 * A link owns the URL when it matches and no other menu link matches more
 * deeply — so /properties/grid highlights "Property Grid", not "All Properties".
 */
const ownsPath = (path: string, pathname: string) =>
  matchesPath(path, pathname) &&
  !MENU_PATHS.some((other) => other.length > path.length && matchesPath(other, pathname));

const containsPath = (item: MenuItemType, pathname: string): boolean => {
  if (item.routeKey && ownsPath(all_routes[item.routeKey], pathname)) return true;
  return item.children?.some((child) => containsPath(child, pathname)) ?? false;
};

const MenuItem = ({ item }: { item: MenuItemType }) => {
  const { pathname } = useLocation();
  const isActive = containsPath(item, pathname);

  const [toggled, setToggled] = useState<{ path: string; open: boolean } | null>(null);
  const open = toggled?.path === pathname ? toggled.open : isActive;

  if (item.children?.length) {
    return (
      <li className="submenu">
        <a
          href="#"
          className={isActive ? "active subdrop" : ""}
          onClick={(e) => {
            e.preventDefault();
            setToggled({ path: pathname, open: !open });
          }}
        >
          {item.icon && <i className={item.icon} />}
          <span>{item.label}</span>
          <span className="menu-arrow" />
        </a>
        <ul style={{ display: open ? "block" : "none" }}>
          {item.children.map((child) => (
            <MenuItem key={child.label} item={child} />
          ))}
        </ul>
      </li>
    );
  }

  
  if (!item.routeKey) return null;

  const path = all_routes[item.routeKey];
  const requiresRecord = /edit-|details/.test(path);
  const destination = requiresRecord ? "/" + path.split("/")[1] : item.routeKey === "resetPassword" ? all_routes.forgotPassword : item.routeKey === "verifyEmail" ? all_routes.profile : path;
  return (
    <li>
      <Link to={destination} className={isActive ? "active" : ""}>
        {item.icon && <i className={item.icon} />}
        <span>{item.label}</span>
      </Link>
    </li>
  );
};

export default MenuItem;
