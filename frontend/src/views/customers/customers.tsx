import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { LEAD_STATUSES, leadStatusClass } from "../../data/statusStyles";
import type { Customer } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import BlobStatCards from "../../components/ui/blobStatCards";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";
import RowActions from "../../components/ui/rowActions";

const Customers = () => {
  const crud = useCrud<Customer>("customers", {
    pageSize: 8,
    searchKeys: ["name", "email", "phone", "interestedIn"],
  });
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null);

  usePrelineRefresh(crud.rows.map((c) => c.id).join(","));

  const totalCustomers = crud.allRows.length;
  const converted = crud.allRows.filter((c) => c.status === "Converted").length;
  const activeLeads = totalCustomers - converted;
  const newThisMonth = crud.allRows.filter((c) => {
    if (!c.joined) return false;
    const joined = new Date(c.joined);
    const now = new Date();
    return joined.getFullYear() === now.getFullYear() && joined.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Customers"
        action={
          <Link
            to={all_routes.addCustomer}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Customer
          </Link>
        }
      />

      <BlobStatCards
        cards={[
          { label: "Total Customers", value: String(totalCustomers), icon: "icon-circle-user-round", tone: "secondary" },
          { label: "Active Leads", value: String(activeLeads), icon: "icon-user-plus", tone: "primary" },
          { label: "Converted", value: String(converted), icon: "icon-badge-check", tone: "success" },
          { label: "New This Month", value: String(newThisMonth), icon: "icon-trending-up", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            searchPlaceholder="Search customers..."
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
            <table className="w-full min-w-[900px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["name", "Customer"],
                    ["phone", "Phone"],
                    ["interestedIn", "Interested In"],
                    ["status", "Status"],
                    ["joined", "Joined"],
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
                {crud.rows.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <div className="flex items-center gap-3">
                        <ImageWithBasePath
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <Link
                            to={`${all_routes.customerDetails}/${customer.id}`}
                            className="text-sm font-semibold text-gray-900 mb-0.5 hover:text-primary transition-colors block"
                          >
                            {customer.name}
                          </Link>
                          <p className="text-[13px] text-gray-600 mb-0">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{customer.phone}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm font-medium text-gray-900">{customer.interestedIn}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${leadStatusClass[customer.status]}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">
                        {customer.joined
                          ? new Date(customer.joined).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          className="size-9 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors text-base cursor-pointer"
                          aria-label="Call"
                        >
                          <i className="icon-phone text-sm" />
                        </button>
                        <button
                          type="button"
                          className="size-9 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors text-base cursor-pointer"
                          aria-label="Message"
                        >
                          <i className="icon-message-square text-sm" />
                        </button>
                        <RowActions
                          label={customer.name}
                          viewTo={`${all_routes.customerDetails}/${customer.id}`}
                          editTo={`${all_routes.editCustomer}/${customer.id}`}
                          onDelete={() => setPendingDelete(customer)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No customers match your search.</p>
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
            label="customers"
            onChange={crud.setPage}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="customer"
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

export default Customers;
