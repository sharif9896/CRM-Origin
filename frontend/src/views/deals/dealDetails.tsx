import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Deal } from "../../data/types";
import { dealStageClass } from "../../data/deals";
import { getResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { fullMoney } from "./constants";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6";
const MAIN_HEADING = "text-base font-bold text-gray-900 mb-4";
const SIDE_HEADING = "text-sm font-bold text-gray-900 mb-4";
const SIDE_LABEL = "text-xs text-gray-500 font-medium mb-1";
const ACTION_BTN =
  "w-full py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg hover:bg-light transition cursor-pointer";

const TIMELINE_BY_STAGE: Record<string, { icon: string; tone: string; title: string }[]> = {
  New: [{ icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Deal Created" }],
  Negotiation: [
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Deal Created" },
    { icon: "icon-arrow-right", tone: "bg-warning/10 text-warning", title: "Negotiation Phase (Current)" },
  ],
  "Due Diligence": [
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Deal Created" },
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Negotiation Completed" },
    { icon: "icon-arrow-right", tone: "bg-info/10 text-info", title: "Due Diligence (Current)" },
  ],
  Won: [
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Deal Created" },
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Negotiation Completed" },
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Due Diligence Completed" },
    { icon: "icon-circle-check", tone: "bg-success/10 text-success", title: "Deal Won" },
  ],
};

const DealDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);
    getResource<Deal>("deals", id)
      .then((d) => {
        if (!cancelled) setDeal(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load deal");
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

  if (error || !deal) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Deal not found"}</p>
        <Link to={all_routes.deals} className="text-primary text-sm font-medium">
          Back to Deals
        </Link>
      </div>
    );
  }

  const closeDateLabel = deal.closeDate
    ? new Date(deal.closeDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const INFO = [
    { label: "Customer", value: deal.customer || "—" },
    { label: "Agent", value: deal.agent || "—" },
    { label: "Expected Close Date", value: closeDateLabel },
    { label: "Stage", value: deal.stage },
  ];

  const timeline = TIMELINE_BY_STAGE[deal.stage] ?? TIMELINE_BY_STAGE.New;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{deal.title}</h1>
          <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.deals} className="hover:text-primary">
              Deals
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">{deal.title}</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{deal.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center text-xs font-bold rounded-lg px-2.5 py-0.5 ${dealStageClass[deal.stage]}`}
                  >
                    {deal.stage}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary mb-0">{deal.price || fullMoney(deal.value)}</p>
                <p className="text-xs text-gray-500 mb-0">Deal Value</p>
              </div>
            </div>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={MAIN_HEADING}>Deal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INFO.map((row) => (
                <div key={row.label}>
                  <p className={SIDE_LABEL}>{row.label}</p>
                  <p className="text-sm text-gray-900">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD}>
            <h3 className={MAIN_HEADING}>Deal Timeline</h3>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span
                    className={`size-10 shrink-0 flex items-center justify-center rounded-full text-sm mt-0.5 ${item.tone}`}
                  >
                    <i className={item.icon} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={SIDE_HEADING}>Buyer Information</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border-color">
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {deal.customer ? deal.customer.charAt(0) : "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0">{deal.customer || "Unknown"}</p>
                <p className="text-xs text-gray-500 mb-0">Primary Buyer</p>
              </div>
            </div>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={SIDE_HEADING}>Agent Information</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border-color">
              <ImageWithBasePath
                src={deal.avatar}
                alt={deal.agent}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0">{deal.agent || "Unassigned"}</p>
                <p className="text-xs text-gray-500 mb-0">Listing Agent</p>
              </div>
            </div>
          </div>

          <div className={CARD}>
            <h3 className={SIDE_HEADING}>Actions</h3>
            <div className="space-y-2">
              <button type="button" className={ACTION_BTN}>
                Add Note
              </button>
              <button type="button" className={ACTION_BTN}>
                Schedule Meeting
              </button>
              <button type="button" className={ACTION_BTN}>
                Send Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
