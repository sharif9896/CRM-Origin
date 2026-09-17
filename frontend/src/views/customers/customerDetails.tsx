import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Customer, LeadStatus } from "../../data/types";
import { getResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6";
const MAIN_HEADING = "text-base font-bold text-gray-900 mb-4";
const SIDE_HEADING = "text-sm font-bold text-gray-900 mb-4";
const SIDE_LABEL = "text-xs text-gray-500 font-medium mb-1";
const SIDE_VALUE = "text-sm text-gray-900";
const RADIO_CLASS =
  "form-radio bg-white border-border-color rounded-full text-primary focus:ring-0 focus:outline-none focus:ring-offset-0";

const STATS = [
  { value: "3", label: "Properties Viewed" },
  { value: "2", label: "Showings" },
  { value: "1", label: "Offers" },
  { value: "11 days", label: "Active" },
];

const TIMELINE = [
  { icon: "icon-eye", tone: "bg-primary/10 text-primary", title: "Viewed a listing", time: "Today at 2:30 PM" },
  { icon: "icon-message-square", tone: "bg-info/10 text-info", title: "Contacted by agent", time: "Yesterday at 10:15 AM" },
  { icon: "icon-calendar-check-2", tone: "bg-warning/10 text-warning", title: "Showing scheduled", time: "2 days ago" },
  { icon: "icon-user-plus", tone: "bg-secondary/10 text-secondary", title: "Lead created", time: "11 days ago" },
];

const STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "New", label: "New" },
  { id: "Warm", label: "Warm" },
  { id: "Hot", label: "Hot" },
  { id: "Converted", label: "Converted" },
];

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LeadStatus>("New");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);
    getResource<Customer>("customers", id)
      .then((c) => {
        if (cancelled) return;
        setCustomer(c);
        setStatus(c.status);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load customer");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!id) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateResource<Customer>("customers", id, { status });
      setCustomer(updated);
    } catch {
      // Keep the selected radio as-is; a real app would surface a toast here.
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 lg:py-6 lg:px-0 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Customer not found"}</p>
        <Link to={all_routes.customers} className="text-primary text-sm font-medium">
          Back to Customers
        </Link>
      </div>
    );
  }

  const joinedLabel = customer.joined
    ? new Date(customer.joined).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const CONTACT = [
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone },
    { label: "Interested In", value: customer.interestedIn || "—" },
    { label: "Joined Date", value: joinedLabel },
  ];

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{customer.name}</h1>
          <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.customers} className="hover:text-primary">
              Customers
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">{customer.name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${all_routes.editCustomer}/${customer.id}`}
            className="page-back-button inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-4 hover:bg-light transition"
          >
            <i className="icon-pencil-line" /> Edit
          </Link>
          <button
            type="button"
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition cursor-pointer"
          >
            <i className="icon-phone" /> Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex items-start flex-wrap gap-4">
                <ImageWithBasePath
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-24 h-24 rounded-lg object-cover shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{customer.name}</h2>
                  <p className="text-sm text-gray-600 mb-3">Potential Buyer</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center text-xs font-bold text-success border border-success rounded-lg px-2.5 py-0.5">
                      {customer.status}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="icon-mail" /> {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="icon-phone" /> {customer.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-border-color">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-white border border-border-color p-3 text-center"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mb-0">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD}>
            <h3 className={MAIN_HEADING}>Activity Timeline</h3>
            <div className="space-y-4">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.title}
                  className={
                    i === TIMELINE.length - 1
                      ? "flex items-start gap-3"
                      : "flex items-start gap-3 pb-4 border-b border-border-color"
                  }
                >
                  <span
                    className={`size-10 shrink-0 flex items-center justify-center rounded-full text-sm ${item.tone}`}
                  >
                    <i className={item.icon} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-500 mb-0">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={SIDE_HEADING}>Contact Information</h3>
            <div className="space-y-3">
              {CONTACT.map((row) => (
                <div key={row.label}>
                  <p className={SIDE_LABEL}>{row.label}</p>
                  <p className={SIDE_VALUE}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD}>
            <h3 className={SIDE_HEADING}>Lead Status</h3>
            <div className="space-y-2 mb-4">
              {STATUSES.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded-lg bg-white border ${
                    status === item.id ? "border-success" : "border-border-color"
                  }`}
                >
                  <input
                    type="radio"
                    id={item.id}
                    name="leadStatus"
                    value={item.id}
                    checked={status === item.id}
                    onChange={() => setStatus(item.id)}
                    className={RADIO_CLASS}
                  />
                  <label className="text-sm text-gray-600 cursor-pointer" htmlFor={item.id}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={updatingStatus || status === customer.status}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updatingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
