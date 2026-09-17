import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import type { Invoice } from "../../data/types";
import { getResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { invoiceStatusClass, money } from "../../data/invoiceStyles";

type InvoiceItemApi = { description: string; quantity: number; unitPrice: number; total: number };
type InvoiceWithItems = Invoice & { items?: InvoiceItemApi[]; notes?: string };

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6";
const SIDE_HEADING = "text-sm font-bold text-gray-900 mb-4";
const SIDE_LABEL = "text-xs text-gray-500 font-medium mb-1";
const ACTION_BTN =
  "w-full py-2 px-4 text-sm font-medium text-gray-900 bg-white border border-border-color rounded-lg hover:bg-light transition cursor-pointer";
const TH = "px-4 py-3 text-gray-900 text-sm font-semibold";
const TD = "px-4 py-3 text-gray-900 text-sm";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setError(null);
    getResource<InvoiceWithItems>("invoices", id)
      .then((inv) => {
        if (!cancelled) setInvoice(inv);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load invoice");
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

  if (error || !invoice) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{error ?? "Invoice not found"}</p>
        <Link to={all_routes.invoices} className="text-primary text-sm font-medium">
          Back to Invoices
        </Link>
      </div>
    );
  }

  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [{ description: "Invoice Amount", quantity: 1, unitPrice: invoice.amount, total: invoice.amount }];

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const isPaid = invoice.status === "Paid";

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-gray-900 text-xl lg:text-[28px] font-bold mb-1">{invoice.number}</h1>
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to={all_routes.dashboard} className="hover:text-primary">
              Dashboard
            </Link>
            <i className="icon-chevron-right text-xs" />
            <Link to={all_routes.invoices} className="hover:text-primary">
              Invoices
            </Link>
            <i className="icon-chevron-right text-xs" />
            <span className="text-gray-900 font-medium">{invoice.number}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`${all_routes.editInvoice}/${invoice.id}`}
            className="page-back-button inline-flex items-center gap-2 bg-white border border-border-color text-sm font-medium text-gray-900 rounded-full py-2 px-4 hover:bg-light transition"
          >
            <i className="icon-pencil-line" /> Edit
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn px-4 py-2 rounded-full bg-primary text-white text-sm font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition cursor-pointer"
          >
            <i className="icon-download" /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-border-color">
              <div>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Bill To
                </h2>
                <p className="text-sm font-semibold text-gray-900">{invoice.client}</p>
              </div>
              <div>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Notes
                </h2>
                <p className="text-xs text-gray-600 mb-0">{invoice.notes || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className={SIDE_LABEL}>Invoice Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className={SIDE_LABEL}>Due Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className={SIDE_LABEL}>Invoice #</p>
                <p className="text-sm font-semibold text-gray-900">{invoice.number}</p>
              </div>
            </div>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6 overflow-x-auto`}>
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-border-color">
                  <th className={`${TH} text-start`}>Description</th>
                  <th className={`${TH} text-center`}>Qty</th>
                  <th className={`${TH} text-center`}>Unit Price</th>
                  <th className={`${TH} text-end`}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {items.map((item, i) => (
                  <tr key={`${item.description}-${i}`}>
                    <td className={TD}>{item.description}</td>
                    <td className={`${TD} text-center`}>{item.quantity}</td>
                    <td className={`${TD} text-center`}>{money(item.unitPrice)}</td>
                    <td className={`${TD} text-end font-semibold`}>{money(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-color">
              <p className="text-gray-600 text-sm">Subtotal</p>
              <p className="text-gray-900 font-semibold text-sm">{money(subtotal)}</p>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
              <p className="text-primary font-semibold text-base">Total Due</p>
              <p className="text-primary font-bold text-2xl">{money(invoice.amount)}</p>
            </div>
          </div>

          <div className={CARD}>
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Invoice Total</p>
                <p className="text-sm font-semibold text-gray-900">{money(invoice.amount)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className={`text-sm font-semibold ${isPaid ? "text-success" : "text-gray-500"}`}>
                  {isPaid ? money(invoice.amount) : "$0.00"}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border-color">
                <p className="text-sm font-semibold text-gray-900">Balance Due</p>
                <p className="text-sm font-bold text-gray-900">{isPaid ? "$0.00" : money(invoice.amount)}</p>
              </div>
            </div>
            {isPaid ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 border border-success/20">
                <i className="icon-circle-check text-success text-lg" />
                <div>
                  <p className="text-xs font-semibold text-success uppercase">Payment Received</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <i className="icon-clock text-warning text-lg" />
                <div>
                  <p className="text-xs font-semibold text-warning uppercase">
                    {invoice.status === "Overdue" ? "Payment Overdue" : "Awaiting Payment"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={SIDE_HEADING}>Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center text-xs font-bold border rounded-lg px-3 py-1 ${invoiceStatusClass[invoice.status]}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <div className={`${CARD} mb-4 lg:mb-6`}>
            <h3 className={SIDE_HEADING}>Client Information</h3>
            <div>
              <p className={SIDE_LABEL}>Company</p>
              <p className="text-sm text-gray-900">{invoice.client}</p>
            </div>
          </div>

          <div className={CARD}>
            <h3 className={SIDE_HEADING}>Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full py-2 px-4 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-lg hover:bg-primary/20 transition cursor-pointer"
              >
                Send Invoice
              </button>
              <button type="button" onClick={() => window.print()} className={ACTION_BTN}>
                Print Invoice
              </button>
              <button type="button" className={ACTION_BTN}>
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
