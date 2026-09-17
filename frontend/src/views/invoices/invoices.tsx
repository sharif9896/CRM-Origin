import { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { INVOICE_STATUSES, invoiceStatusClass, money } from "../../data/invoiceStyles";
import type { Invoice } from "../../data/types";
import { useCrud } from "../../hooks/useCrud";
import { usePrelineRefresh } from "../../hooks/usePrelineRefresh";
import PageHeader from "../../components/ui/pageHeader";
import TableToolbar from "../../components/ui/tableToolbar";
import Pagination from "../../components/ui/pagination";
import ConfirmDeleteModal from "../../components/ui/confirmDeleteModal";
import RowActions from "../../components/ui/rowActions";
import StatCards from "../../components/ui/statCards";
import TableHeadRow, { TH_CLASS, TH_END_CLASS } from "../../components/ui/tableHead";

const Invoices = () => {
  const crud = useCrud<Invoice>("invoices", {
    pageSize: 8,
    searchKeys: ["number", "client", "status"],
  });
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);

  usePrelineRefresh(crud.rows.map((i) => i.id).join(","));

  const totalByStatus = (status: Invoice["status"]) =>
    crud.allRows.filter((i) => i.status === status).reduce((sum, i) => sum + i.amount, 0);
  const totalInvoiced = crud.allRows.reduce((sum, i) => sum + i.amount, 0);
  const outstanding = totalByStatus("Pending") + totalByStatus("Overdue");
  const draftCount = crud.allRows.filter((i) => i.status === "Draft").length;

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {crud.error && <div className="ws-error" role="alert">{crud.error}<button onClick={() => void crud.reset()}>Retry</button></div>}
      {crud.loading && <div className="ws-notice" role="status">Loading records?</div>}
      <PageHeader
        title="Invoices"
        action={
          <Link
            to={all_routes.addInvoice}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition hover:text-white"
          >
            <span className="flex">
              <i className="icon-plus" />
            </span>
            Add Invoice
          </Link>
        }
      />

      <StatCards
        cards={[
          { label: "Total Invoiced", value: money(totalInvoiced), icon: "icon-file-text", tone: "secondary" },
          { label: "Paid", value: money(totalByStatus("Paid")), icon: "icon-circle-check", tone: "primary" },
          { label: "Outstanding", value: money(outstanding), icon: "icon-alert-circle", tone: "danger" },
          { label: "Draft", value: String(draftCount), icon: "icon-file-plus", tone: "warning" },
        ]}
      />

      <div className="grid grid-cols-1">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <TableToolbar
            searchPlaceholder="Search invoices..."
            search={crud.search}
            onSearch={crud.setSearch}
            filter={{
              label: "Status",
              icon: "icon-tag",
              options: INVOICE_STATUSES,
              value: crud.filters.status ?? "",
              onChange: (v) => crud.setFilter("status", v),
            }}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <TableHeadRow>
                  {([
                    ["number", "Invoice #"],
                    ["client", "Client"],
                    ["issueDate", "Issue Date"],
                    ["dueDate", "Due Date"],
                    ["amount", "Amount"],
                    ["status", "Status"],
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
                {crud.rows.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <Link
                        to={`${all_routes.invoiceDetails}/${invoice.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{invoice.client}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{invoice.issueDate}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm text-gray-600">{invoice.dueDate}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span className="text-sm font-medium text-gray-900">{money(invoice.amount)}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white">
                      <span
                        className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${invoiceStatusClass[invoice.status]}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-border-color bg-white text-end">
                      <RowActions
                        label={invoice.number}
                        viewTo={`${all_routes.invoiceDetails}/${invoice.id}`}
                        editTo={`${all_routes.editInvoice}/${invoice.id}`}
                        onDelete={() => setPendingDelete(invoice)}
                      />
                    </td>
                  </tr>
                ))}

                {crud.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center border-b border-border-color bg-white">
                      <i className="icon-search-x text-3xl text-gray-400 mb-2 block" />
                      <p className="mb-0">No invoices match your search.</p>
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
            label="invoices"
            onChange={crud.setPage}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        open={pendingDelete !== null}
        entity="invoice"
        name={pendingDelete?.number}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void crud.remove(pendingDelete.id).catch(() => undefined);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};

export default Invoices;
