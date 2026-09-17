import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Lead } from "../../data/types";
import { getResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { leadStatusClass } from "../../data/statusStyles";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6";
const MAIN_HEADING = "text-base font-bold text-gray-900 mb-4";
const SIDE_HEADING = "text-sm font-bold text-gray-900 mb-4";
const SIDE_LABEL = "text-xs text-gray-500 font-medium mb-1";
const SIDE_VALUE = "text-sm text-gray-900";
const ACTION_BTN =
  "w-full py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg hover:bg-light transition cursor-pointer";

const STATS = [
  { value: "12", label: "Properties Viewed" },
  { value: "4", label: "Showings" },
  { value: "2", label: "Offers" },
];

const ACTIVITY = [
  { icon: "icon-eye", tone: "bg-primary/10 text-primary", title: "Viewed a listing", time: "Today at 3:00 PM" },
  { icon: "icon-calendar-check-2", tone: "bg-warning/10 text-warning", title: "Showing scheduled", time: "Yesterday at 2:30 PM" },
  { icon: "icon-message-square", tone: "bg-secondary/10 text-secondary", title: "Lead Contacted", time: "2 days ago" },
];

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);
    getResource<Lead>("leads", id)
      .then((l) => {
        if (!cancelled) setLead(l);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load lead");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-3 lg:py-6 lg:px-0 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Lead not found"}</p>
        <Link to={all_routes.leads} className="text-primary text-sm font-medium">
          Back to Leads
        </Link>
      </div>
    );
  }

  const CONTACT = [
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "Budget", value: lead.budget || "—" },
    { label: "Assigned To", value: lead.assignedTo || "—" },
  ];

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{lead.name}</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.leads} className="hover:text-primary">
              Leads
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">{lead.name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${all_routes.editLead}/${lead.id}`}
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
            <div className="flex items-start flex-wrap flex-col sm:flex-row justify-between gap-6 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{lead.name}</h2>
                <p className="text-sm text-gray-600 mb-3">{lead.status} Lead</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-xs font-bold border rounded-lg px-2.5 py-0.5 ${leadStatusClass[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-2xl font-bold text-primary mb-0">{lead.budget || "—"}</p>
                <p className="text-xs text-gray-500 mb-0">Budget Range</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border-color">
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

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={MAIN_HEADING}>Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT.map((row) => (
                <div key={row.label}>
                  <p className={SIDE_LABEL}>{row.label}</p>
                  <p className={SIDE_VALUE}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD}>
            <h3 className={MAIN_HEADING}>Recent Activity</h3>
            <div className="space-y-4">
              {ACTIVITY.map((item, i) => (
                <div
                  key={item.title}
                  className={
                    i === ACTIVITY.length - 1
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
            <h3 className={SIDE_HEADING}>Assigned Agent</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border-color mb-4">
              <ImageWithBasePath
                src={lead.avatar}
                alt={lead.assignedTo}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0">{lead.assignedTo || "Unassigned"}</p>
                <p className="text-xs text-gray-500 mb-0">Agent</p>
              </div>
            </div>
            <button type="button" className={ACTION_BTN}>
              Change Agent
            </button>
          </div>

          <div className={CARD}>
            <h3 className={SIDE_HEADING}>Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full py-2 px-4 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition cursor-pointer"
              >
                Send Email
              </button>
              <button type="button" className={ACTION_BTN}>
                Schedule Call
              </button>
              <button type="button" className={ACTION_BTN}>
                Convert to Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
