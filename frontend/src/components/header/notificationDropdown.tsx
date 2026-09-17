import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { HSDropdown } from "preline";
import ImageWithBasePath from "../ui/imageWithBasePath";
import { apiRequest } from "../../lib/apiClient";
import type { Notification } from "../../data/notifications";

const closeDropdown = (e: React.MouseEvent<HTMLElement>) => {
  const parent = e.currentTarget.closest(".hs-dropdown");
  if (parent) HSDropdown.close(parent as HTMLElement);
};

type NotificationApi = Notification & { createdAt?: string };

const timeAgo = (value?: string) => {
  if (!value) return "";
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const NotificationDropdown = () => {
  const [items, setItems] = useState<NotificationApi[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const load = () => {
    setLoading(true);
    apiRequest<{ data: NotificationApi[]; unreadCount: number }>("/notifications", {
      params: { limit: 10 },
    })
      .then((res) => {
        setItems(res.data);
        setUnreadCount(res.unreadCount);
        setLoaded(true);
      })
      .catch(() => {
        // Leave the dropdown empty if notifications can't be reached.
      })
      .finally(() => setLoading(false));
  };

  // Fetch once eagerly so the unread badge is accurate as soon as the app
  // loads, not only after the user opens the dropdown.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Start initial notification fetch.
    load();
  }, []);

  const markAsRead = async (id: string) => {
    setItems((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PUT" });
    } catch {
      load();
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    setItems((current) => current.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await apiRequest("/notifications/read-all", { method: "PUT" });
    } catch {
      load();
    }
  };

  return (
    <div
      className="header-item hs-dropdown [--placement:bottom-right] [--auto-close:inside] hidden relative sm:flex"
      id="notification-dropdown"
    >
      <button
        type="button"
        onClick={() => {
          if (!loaded) load();
        }}
        className="hs-dropdown-toggle topbar-link flex items-center justify-center relative cursor-pointer"
        aria-label="Notifications"
      >
        <i className="icon-bell" />
        {unreadCount > 0 && (
          <span className="absolute top-2 end-2 size-2 bg-danger-transparent rounded-full flex items-center justify-center">
            <span className="size-1 bg-danger border-1 border-danger/20 rounded-full" />
          </span>
        )}
      </button>
      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-102 p-5 mt-[-8px]! bg-white border border-border-color shadow rounded-lg z-1 notification-dropdown"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="flex items-center justify-between border-b border-border-color pb-5">
          <p className="text-[18px] max-lg:text-base font-bold text-title">
            Notifications {unreadCount > 0 && <span className="text-primary">({unreadCount})</span>}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1 cursor-pointer"
            >
              <i className="icon-check-check" />
              Mark all as read
            </button>
            <button
              type="button"
              id="close-notification"
              onClick={closeDropdown}
              className="size-8 inline-flex justify-center items-center rounded-full border border-border-color bg-white text-gray-900 text-base hover:bg-danger hover:border-danger hover:text-white dark:hover:text-dark focus:outline-hidden focus:bg-danger cursor-pointer shadow"
              aria-label="Close"
            >
              <i className="icon-x" />
            </button>
          </div>
        </div>

        <SimpleBar className="max-h-96">
          <div id="all-notifications">
            <div className="pt-5 space-y-3 pb-3">
              {loading && items.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 mb-0">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 mb-0">No notifications yet.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !item.read && markAsRead(item.id)}
                    className={`notification-item relative flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer hover:bg-light ${
                      item.read ? "" : "bg-light/60"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative size-10 shrink-0 me-2">
                        {item.avatar ? (
                          <ImageWithBasePath
                            src={item.avatar}
                            className="rounded-full border border-border-color"
                            alt=""
                          />
                        ) : (
                          <span
                            className={`size-10 font-semibold rounded-full flex items-center justify-center ${item.badgeClass ?? "bg-secondary-transparent text-secondary"}`}
                          >
                            {item.icon ? <i className={item.icon} /> : item.initials}
                          </span>
                        )}
                        {item.online && (
                          <span className="bottom-0 end-0.5 absolute size-2 bg-success border border-white rounded-full" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-title inline-flex items-center gap-1.5 mb-1">
                          {item.title}
                          {!item.read && <span className="size-1.5 bg-primary rounded-full inline-block" />}
                        </p>
                        <p className="text-[13px] font-medium mb-0">{item.message}</p>
                      </div>
                    </div>
                    <p className="shrink-0">{timeAgo(item.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default NotificationDropdown;
