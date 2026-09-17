import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Agent } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import RowActions from "../../components/ui/rowActions";
import AccentStatCards from "../../components/ui/accentStatCards";

const compactMoney = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(1)}M` : `$${Math.round(value / 1000)}K`;

const Agents = () => {
  const crud = useCrud<Agent>("agents", {
    pageSize: 100,
    searchKeys: ["name", "email", "role", "phone"],
  });
  const [pendingDelete, setPendingDelete] = useState<Agent | null>(null);

  usePrelineRefresh(crud.rows.map((a) => a.id).join(","));

  const totalAgents = crud.allRows.length;
  const activeAgents = crud.allRows.filter((a) => a.status === "Active").length;
  const totalRevenue = crud.allRows.reduce((sum, a) => sum + a.revenue, 0);
  const topAgent = [...crud.allRows].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Agents"
        action={
          <Link
            to={all_routes.addAgent}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Agent
          </Link>
        }
      />

      <AccentStatCards
        cards={[
          {
            label: "Total Agents",
            value: String(totalAgents),
            icon: "icon-users",
            tone: "secondary",
          },
          {
            label: "Active Now",
            value: String(activeAgents),
            icon: "icon-user-check",
            tone: "primary",
            trend: totalAgents ? `${Math.round((activeAgents / totalAgents) * 100)}% active` : undefined,
            trendIcon: "icon-circle-check",
          },
          {
            label: "Top Performer",
            value: topAgent ? topAgent.name.split(" ")[0] : "—",
            icon: "icon-award",
            tone: "warning",
            caption: topAgent?.role,
            compactValue: true,
            trend: topAgent ? `${compactMoney(topAgent.revenue)} sales` : undefined,
            trendIcon: "icon-star",
          },
          {
            label: "Total Revenue",
            value: compactMoney(totalRevenue),
            icon: "icon-trending-up",
            tone: "info",
          },
        ]}
      />

      <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-4 mb-4 lg:mb-6">
        <TableToolbar
          className=""
          searchPlaceholder="Search agents..."
          search={crud.search}
          onSearch={crud.setSearch}
          filter={{
            label: "Status",
            icon: "icon-tag",
            options: ["Active", "Inactive"],
            value: crud.filters.status ?? "",
            onChange: (v) => crud.setFilter("status", v),
          }}
        />
      </div>

      {crud.rows.length === 0 ? (
        <div className="bg-white-50 rounded-lg border border-border-color p-12 text-center">
          <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
          <p className="mb-0">No agents match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {crud.rows.map((agent) => (
            <div key={agent.id} className="col-span-12 md:col-span-6 xl:col-span-4">
              <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5 hover:shadow-md transition-shadow duration-200 h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 shrink-0">
                      <ImageWithBasePath
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                          agent.status === "Active" ? "bg-success" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                        <Link to={`${all_routes.agentDetails}/${agent.id}`} className="hover:text-primary">
                          {agent.name}
                        </Link>
                      </h3>
                      <p className="text-[13px] text-gray-600 mb-0">{agent.role}</p>
                    </div>
                  </div>
                  <RowActions
                    label={agent.name}
                    viewTo={`${all_routes.agentDetails}/${agent.id}`}
                    editTo={`${all_routes.editAgent}/${agent.id}`}
                    onDelete={() => setPendingDelete(agent)}
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 border border-secondary/20 rounded-md px-2 py-0.5">
                    {agent.rank}
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-bold border rounded-lg px-2.5 py-0.5 ${
                      agent.status === "Active"
                        ? "text-success border-success"
                        : agent.status === "Away"
                          ? "text-danger border-danger"
                          : "text-gray-500 border-gray-300"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { value: agent.listings, label: "Listings" },
                    { value: agent.deals, label: "Sales" },
                    { value: compactMoney(agent.revenue), label: "Revenue" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-white border border-border-color p-2.5 text-center"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-0.5">{stat.value}</h4>
                      <p className="text-xs text-gray-500 mb-0">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${agent.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-full py-2 hover:bg-light transition"
                  >
                    <i className="icon-phone" />
                    Call
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary rounded-full py-2 hover:bg-primary-hover hover:text-white transition cursor-pointer"
                  >
                    <i className="icon-message-square" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="agent"
        name={pendingDelete?.name}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void crud.remove(pendingDelete.id).catch(() => undefined);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default Agents;
