import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Lead } from "../../data/types";
import { LEAD_STATUSES, leadStatusClass } from "../../data/statusStyles";
import { useCrud } from "../../hooks/useCrud";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import StatCards from "../../components/ui/statCards";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";
import RowActions from "../../components/ui/rowActions";

const Leads = () => {
  const crud = useCrud<Lead>("leads", {
    pageSize: 8,
    searchKeys: ["name", "email", "phone", "assignedTo"],
  });
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);

  usePrelineRefresh(crud.rows.map((l) => l.id).join(","));

  const leadCount = (status: Lead["status"]) => crud.allRows.filter((l) => l.status === status).length;
  const totalLeads = crud.allRows.length;
  const conversionRate = totalLeads ? (leadCount("Converted") / totalLeads) * 100 : 0;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Leads"
        action={
          <Link
            to={all_routes.addLead}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Lead
          </Link>
        }
      />

      <StatCards
        cards={[
          { label: "Total Leads", value: String(totalLeads), icon: "icon-trending-up", tone: "secondary" },
          { label: "New Leads", value: String(leadCount("New")), icon: "icon-user-plus", tone: "primary" },
          { label: "Conversion Rate", value: `${conversionRate.toFixed(1)}%`, icon: "icon-percent", tone: "info" },
          { label: "Needs Follow-up", value: String(leadCount("Warm")), icon: "icon-alert-circle", tone: "warning" },
        ]}
      />

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            searchPlaceholder="Search leads..."
            search={crud.search}
            onSearch={crud.setSearch}
            filter={{
              label: "Status",
              icon: "icon-tag",
              options: LEAD_STATUSES,
              value: crud.filters.status ?? "",
              onChange: (v) => crud.setFilter("status", v),
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["name", "Lead Name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                    ["status", "Status"],
                    ["budget", "Budget"],
                    ["assignedTo", "Assigned To"],
                  ] as const).map(([key, label]) => (
                    <th
                      key={key}
                      className={`${TH_CLASS} cursor-pointer select-none`}
                      onClick={() => crud.toggleSort(key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {crud.sort?.key === key && (
                          <i className={crud.sort.dir === "asc" ? "icon-arrow-up" : "icon-arrow-down"} />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className={TH_END_CLASS}>Action</th>
                </TableHeadRow>
              </thead>
              <tbody className="divide-y">
                {crud.rows.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <Link
                        to={`${all_routes.leadDetails}/${lead.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{lead.email}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{lead.phone}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span
                        className={`inline-flex items-center text-xs font-bold rounded-lg px-3 py-1 border ${leadStatusClass[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm font-medium text-gray-900">{lead.budget}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-2">
                        <ImageWithBasePath
                          src={lead.avatar}
                          alt={lead.assignedTo}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-900">{lead.assignedTo.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <RowActions
                        label={lead.name}
                        viewTo={`${all_routes.leadDetails}/${lead.id}`}
                        editTo={`${all_routes.editLead}/${lead.id}`}
                        onDelete={() => setPendingDelete(lead)}
                      />
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No leads match your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={crud.page}
            pageCount={crud.pageCount}
            pageSize={crud.pageSize}
            total={crud.total}
            label="leads"
            onChange={crud.setPage}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="lead"
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

export default Leads;
