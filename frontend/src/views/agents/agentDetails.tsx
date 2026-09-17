import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Agent, Property } from "../../data/types";
import { getResource, listResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import { formatPrice } from "../properties/constants";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6";
const MAIN_HEADING = "text-base font-bold text-gray-900 mb-4";
const SIDE_HEADING = "text-sm font-bold text-gray-900 mb-4";
const SIDE_LABEL = "text-xs text-gray-500 font-medium mb-1";
const SIDE_VALUE = "text-sm text-gray-900";
const ACTION_BTN =
  "w-full py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg hover:bg-light transition cursor-pointer";

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);

    getResource<Agent>("agents", id)
      .then((a) => {
        if (cancelled) return;
        setAgent(a);
        return listResource<Property>("properties").then((props) => {
          if (cancelled) return;
          setListings(props.filter((p) => p.agent === a.name).slice(0, 5));
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load agent");
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

  if (error || !agent) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Agent not found"}</p>
        <Link to={all_routes.agents} className="text-primary text-sm font-medium">
          Back to Agents
        </Link>
      </div>
    );
  }

  const STATS = [
    { value: String(agent.listings), label: "Listings" },
    { value: String(agent.deals), label: "Deals" },
    { value: formatPrice(agent.revenue), label: "Revenue" },
    { value: `${agent.rating.toFixed(1)} / 5`, label: "Rating" },
  ];

  const CONTACT = [
    { label: "Email", value: agent.email },
    { label: "Phone", value: agent.phone },
    { label: "Role", value: agent.role },
    { label: "Rank", value: agent.rank || "—" },
  ];

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{agent.name}</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.agents} className="hover:text-primary">
              Agents
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">{agent.name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${all_routes.editAgent}/${agent.id}`}
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
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-24 h-24 rounded-lg object-cover shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{agent.name}</h2>
                  <p className="text-sm text-gray-600 mb-3">{agent.role}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {agent.rank && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 border border-secondary/20 rounded-md px-2 py-0.5">
                        {agent.rank}
                      </span>
                    )}
                    <span className="inline-flex items-center text-xs font-bold text-success border border-success rounded-lg px-2.5 py-0.5">
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="icon-mail" /> {agent.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="icon-phone" /> {agent.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
            <h3 className={MAIN_HEADING}>Current Listings</h3>
            {listings.length === 0 ? (
              <p className="text-sm text-gray-500 mb-0">No properties currently listed by this agent.</p>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 p-3 border border-border-color rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <ImageWithBasePath
                        src={listing.image}
                        alt="Property"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-0">
                          <Link to={`${all_routes.propertyDetails}/${listing.id}`}>{listing.name}</Link>
                        </p>
                        <p className="text-xs text-gray-500 mb-0">{listing.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(listing.price)}</span>
                  </div>
                ))}
              </div>
            )}
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
            <h3 className={SIDE_HEADING}>Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full py-2 px-4 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition cursor-pointer"
              >
                Send Message
              </button>
              <button type="button" className={ACTION_BTN}>
                Schedule Call
              </button>
              <button type="button" className={ACTION_BTN}>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
