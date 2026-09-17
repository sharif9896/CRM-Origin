import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { apiRequest, ApiError } from "../../lib/apiClient";

type DeliveryStatus = "queued" | "sent" | "failed" | "skipped";
type DeliveryChannel = "email" | "whatsapp";

type Delivery = {
  id: string;
  recipientType: "owner" | "agent";
  recipientName: string;
  channel: DeliveryChannel;
  destination: string;
  status: DeliveryStatus;
  attempts: number;
  providerMessageId?: string;
  error?: string;
  createdAt: string;
  appointment?: { id: string; title: string; when: string; client: string; notificationStatus?: string };
  property?: { id: string; name: string; location: string };
  requestedBy?: { id: string; name: string; email: string; phone?: string; role: string };
};

type DeliveryResponse = {
  success: boolean;
  data: Delivery[];
  total: number;
  page: number;
  pages: number;
  summary: Record<DeliveryStatus, number>;
};

const statusStyle: Record<DeliveryStatus, string> = {
  queued: "bg-info/10 text-info border-info/20",
  sent: "bg-success/10 text-success border-success/20",
  failed: "bg-danger/10 text-danger border-danger/20",
  skipped: "bg-warning/10 text-warning border-warning/20",
};

const cards: { status: DeliveryStatus; label: string; icon: string }[] = [
  { status: "sent", label: "Delivered", icon: "icon-circle-check-big" },
  { status: "queued", label: "Queued", icon: "icon-clock-3" },
  { status: "failed", label: "Failed", icon: "icon-circle-x" },
  { status: "skipped", label: "Needs setup", icon: "icon-circle-alert" },
];

const NotificationStatus = () => {
  const [rows, setRows] = useState<Delivery[]>([]);
  const [summary, setSummary] = useState<Record<DeliveryStatus, number>>({ queued: 0, sent: 0, failed: 0, skipped: 0 });
  const [status, setStatus] = useState<DeliveryStatus | "">("");
  const [channel, setChannel] = useState<DeliveryChannel | "">("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const response = await apiRequest<DeliveryResponse>("/notification-deliveries", { params: { status, channel, page, limit: 25 } });
      setRows(response.data);
      setSummary(response.summary);
      setPages(response.pages);
      setTotal(response.total);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to load notification deliveries.");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [channel, page, status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Load the authenticated delivery feed when filters change.
    void load();
    const timer = window.setInterval(() => void load(true), 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const retry = async (id: string) => {
    setRetrying(id);
    setError("");
    try {
      await apiRequest(`/notification-deliveries/${id}/retry`, { method: "POST" });
      await load(true);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Unable to retry this notification.");
    } finally {
      setRetrying("");
    }
  };

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">Notification Status</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">Dashboard</Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">Notification Status</span>
          </nav>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-light cursor-pointer">
          <i className="icon-refresh-cw" /> Refresh
        </button>
      </div>

      {error && <div className="ws-error mb-4" role="alert">{error}</div>}

      <div className="grid grid-cols-12 gap-4 mb-6">
        {cards.map((card) => (
          <button key={card.status} type="button" onClick={() => { setStatus(status === card.status ? "" : card.status); setPage(1); }} className={`col-span-12 sm:col-span-6 xl:col-span-3 rounded-xl border p-5 text-left transition cursor-pointer ${status === card.status ? "border-primary ring-2 ring-primary/10 bg-white" : "border-border-color bg-white hover:border-primary/40"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-0">{summary[card.status]}</p>
              </div>
              <span className={`size-11 rounded-xl inline-flex items-center justify-center border ${statusStyle[card.status]}`}><i className={`${card.icon} text-xl`} /></span>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border-color bg-white overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3 p-5 border-b border-border-color">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-0">Visit delivery log</h2>
            <p className="text-xs text-gray-500 mt-1 mb-0">{total} delivery attempts · refreshed every 15 seconds</p>
          </div>
          <div className="flex gap-2">
            <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value as DeliveryStatus | ""); setPage(1); }} className="form-select rounded-full border-border-color text-sm py-2 pl-4 pr-9 focus:border-primary focus:ring-0">
              <option value="">All statuses</option>
              <option value="sent">Delivered</option><option value="queued">Queued</option><option value="failed">Failed</option><option value="skipped">Needs setup</option>
            </select>
            <select aria-label="Filter by channel" value={channel} onChange={(event) => { setChannel(event.target.value as DeliveryChannel | ""); setPage(1); }} className="form-select rounded-full border-border-color text-sm py-2 pl-4 pr-9 focus:border-primary focus:ring-0">
              <option value="">All channels</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>

        {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div> : rows.length === 0 ? (
          <div className="py-16 text-center"><i className="icon-bell-off text-3xl text-gray-300" /><p className="text-sm text-gray-500 mt-3 mb-0">No notification attempts match these filters.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>{["Created", "Booking", "Requested by", "Recipient", "Channel", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-4 min-w-52"><p className="text-sm font-semibold text-gray-900 mb-0">{row.property?.name || row.appointment?.title || "Deleted record"}</p><p className="text-xs text-gray-500 mt-1 mb-0">{row.appointment?.when ? new Date(row.appointment.when).toLocaleString() : "—"}</p></td>
                    <td className="px-5 py-4 min-w-48"><p className="text-sm font-medium text-gray-900 mb-0">{row.requestedBy?.name || "Deleted user"}</p><p className="text-xs text-gray-500 mt-1 mb-0">{row.requestedBy?.email || "—"}</p></td>
                    <td className="px-5 py-4 min-w-48"><p className="text-sm font-medium capitalize text-gray-900 mb-0">{row.recipientName || row.recipientType}</p><p className="text-xs text-gray-500 mt-1 mb-0">{row.destination || "Missing destination"}</p></td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700"><i className={row.channel === "email" ? "icon-mail" : "icon-message-circle"} />{row.channel}</span></td>
                    <td className="px-5 py-4 min-w-44"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusStyle[row.status]}`}>{row.status === "sent" ? "Delivered" : row.status === "skipped" ? "Needs setup" : row.status}</span><p className="text-xs text-gray-500 mt-2 mb-0">{row.error || `Attempt ${row.attempts}`}</p></td>
                    <td className="px-5 py-4"><button type="button" disabled={retrying === row.id || row.status === "sent"} onClick={() => void retry(row.id)} className="inline-flex items-center gap-1.5 rounded-full border border-border-color px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"><i className="icon-rotate-ccw" />{retrying === row.id ? "Retrying" : "Retry"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && <div className="flex items-center justify-between p-4 border-t border-border-color"><p className="text-sm text-gray-600 mb-0">Page {page} of {pages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="size-9 rounded-full border border-border-color disabled:opacity-40 cursor-pointer"><i className="icon-chevron-left" /></button><button type="button" disabled={page >= pages} onClick={() => setPage((current) => current + 1)} className="size-9 rounded-full border border-border-color disabled:opacity-40 cursor-pointer"><i className="icon-chevron-right" /></button></div></div>}
      </div>
    </div>
  );
};

export default NotificationStatus;
