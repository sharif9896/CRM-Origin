import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { useLayout } from "../../hooks/useLayout";
import { useAppDispatch, useAuth, useTheme } from "../../store/hooks";
import { toggleTheme } from "../../store/themeSlice";
import { logout } from "../../store/authSlice";
import ImageWithBasePath from "../ui/imageWithBasePath";
import GlobalSearch from "./globalSearch";
import NotificationDropdown from "./notificationDropdown";
import ChatPanel from './chatPanel';
import { useAccess } from '../../hooks/useAccess';

const quickLinks = [
  { label: "New Lead", to: all_routes.addLead, permission: "leads:create", className: "" },
  { label: "Schedule Visit", to: all_routes.appointments, permission: "appointments:create", className: "" },
  { label: "View Reports", to: all_routes.reports, permission: "reports:read", className: "xxl:flex hidden" },
];

const accountInitials = (name?: string) => {
  const names = (name || "User").trim().split(/\s+/).filter(Boolean);
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return Array.from(names[0] || "User").slice(0, 2).join("").toUpperCase();
};

const Header = () => {
  const { toggleMiniSidebar, openMobileSidebar } = useLayout();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = useAccess();
  const [fixed, setFixed] = useState(false);
  const initials = accountInitials(user?.name);

  useEffect(() => {
    const onScroll = () => setFixed(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar-header flex items-center max-lg:w-full${fixed ? " fixed-header" : ""}`}
    >
      <div className="topbar-menu flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            id="mobile_btn"
            type="button"
            className="mobile-btn"
            aria-label="Open menu"
            onClick={openMobileSidebar}
          >
            <i className="icon icon-menu" />
          </button>
          <Link to={all_routes.dashboard} className="logo">
            <span className="logo-light">
              <span className="logo-lg">
                <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
              </span>
              <span className="logo-sm">
                <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
              </span>
            </span>
            <span className="logo-dark">
              <span className="logo-lg">
                <ImageWithBasePath src="logo-thu.png" alt="Realestate CRM" />
              </span>
            </span>
          </Link>
          <button
            className="sidenav-toggle-btn topbar-link shrink-0 size-9 text-[20px] items-center justify-center rounded-full"
            id="toggle_btn2"
            type="button"
            aria-label="Collapse sidebar"
            onClick={toggleMiniSidebar}
          >
            <i className="icon-arrow-left" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 lg:w-full">
          <GlobalSearch />

          <div className="m-auto hidden lg:flex items-center gap-2">
            {quickLinks.filter(link => can(link.permission)).map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `header-nav-link text-sm font-medium rounded-full py-2 px-4 items-center gap-1 transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white border border-border-color text-dark hover:bg-light"
                  } ${link.className || "flex"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="header-item">
              <button
                className="topbar-link items-center justify-center light-dark-mode"
                type="button"
                aria-label="Toggle theme"
                onClick={() => dispatch(toggleTheme())}
              >
                <i className={theme === "dark" ? "icon-sun" : "icon-moon"} />
              </button>
            </div>

            <NotificationDropdown />
            <ChatPanel />

            <div className="profile-dropdown hs-dropdown [--placement:bottom-right] [--auto-close:inside] relative me-4">
              <button
                type="button"
                className="hs-dropdown-toggle account-menu-button relative flex items-center justify-center"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label={`${user?.name || "User"} account menu`}
                title={user?.name || "Account"}
              >
                <span className="account-avatar" aria-hidden="true">
                  {initials}
                </span>
              </button>
              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-50 p-5 bg-white border border-border-color shadow rounded-lg mt-2 z-1 divide-y divide-border-color"
                role="menu"
                aria-orientation="vertical"
              >
                {user && (
                  <div className="pb-3">
                    <p className="text-sm font-semibold text-gray-900 mb-0">{user.name}</p>
                    <p className="text-xs text-gray-500 mb-0 truncate">{user.email}</p>
                  </div>
                )}
                <div className="pb-3 space-y-1">
                  <Link to={all_routes.agents} className="flex items-center p-2 rounded-md text-gray-900 hover:bg-light">
                    <i className="icon-users text-base me-2" />
                    Agents
                  </Link>
                  <Link to={all_routes.properties} className="flex items-center p-2 rounded-md text-gray-900 hover:bg-light">
                    <i className="icon-hotel text-base me-2" />
                    Properties
                  </Link>
                  <Link to={all_routes.customers} className="flex items-center p-2 rounded-md text-gray-900 hover:bg-light">
                    <i className="icon-circle-user-round text-base me-2" />
                    Customers
                  </Link>
                  <Link to={all_routes.amenities} className="flex items-center p-2 rounded-md text-gray-900 hover:bg-light">
                    <i className="icon-sparkles text-base me-2" />
                    Amenities
                  </Link>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(logout());
                      navigate(all_routes.login, { replace: true });
                    }}
                    className="w-full flex items-center p-2 rounded-md text-gray-900 hover:bg-light cursor-pointer"
                  >
                    <i className="icon-log-out text-base me-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
