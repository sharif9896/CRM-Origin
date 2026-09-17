import { useResourceOptions } from "../../hooks/useResourceOptions";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Nullable } from "primereact/ts-helpers";
import { all_routes } from "../../routes/all_routes";
import type { Invoice } from "../../data/types";
import { getResource, createResource, updateResource } from "../../lib/api/resource";
import { ApiError } from "../../lib/apiClient";
import { INVOICE_STATUSES } from "../../data/invoiceStyles";
import PageHeader from "../../components/ui/pageHeader";
import { INPUT_CLASS, LABEL_CLASS } from "../../components/ui/formField";
import Select from "../../components/ui/select";
import DatePicker from "../../components/ui/datePicker";
import TableHeadRow from "../../components/ui/tableHead";
import {
  FormCardHeader,
  FormGroup,
  FormActions,
  CANCEL_CLASS,
  QuickTips,
} from "../../components/ui/formLayout";

type LineItem = {
  id: number;
  description: string;
  qty: number;
  price: number;
  tax: number;
};

type InvoiceItemApi = {
  description: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  total: number;
};

type InvoiceWithItems = Invoice & { items?: InvoiceItemApi[]; notes?: string };



const TIPS = [
  "Add multiple line items for detailed billing",
  "Tax percentage is auto-calculated per line",
  "Total updates instantly as you edit",
  "Set due date for payment tracking",
];

const blankItem = (id: number): LineItem => ({ id, description: "", qty: 1, price: 0, tax: 0 });

const lineTotal = (item: LineItem) => item.qty * item.price * (1 + item.tax / 100);

const money2 = (n: number) => `$${n.toFixed(2)}`;

const CELL = "px-4 py-3 bg-white border-b border-border-color";
const TH_ITEM =
  "px-4 py-3 bg-white text-gray-900 text-start text-[12px] font-semibold uppercase tracking-wider";
const TH_ITEM_CENTER =
  "px-4 py-3 bg-white text-gray-900 text-center text-[12px] font-semibold uppercase tracking-wider";
const TH_ITEM_END =
  "px-4 py-3 bg-white text-gray-900 text-end text-[12px] font-semibold uppercase tracking-wider";
const ITEM_INPUT =
  "w-full bg-white border border-border-color text-sm text-gray-900 rounded-lg py-2 px-3 focus:ring-0 focus:border-primary";

const InvoiceForm = ({ mode }: { mode: "add" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit";
  const lookup = useResourceOptions("customers");

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("Draft");
  const [issueDate, setIssueDate] = useState<Nullable<Date>>(new Date());
  const [dueDate, setDueDate] = useState<Nullable<Date>>(null);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([blankItem(1)]);

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset state when loading a different record.
    setLoading(true);
    setLoadError(null);
    getResource<InvoiceWithItems>("invoices", id)
      .then((invoice) => {
        if (cancelled) return;
        setInvoiceNumber(invoice.number ?? "");
        setClient(invoice.client ?? "");
        setStatus(invoice.status ?? "Draft");
        setIssueDate(invoice.issueDate ? new Date(invoice.issueDate) : new Date());
        setDueDate(invoice.dueDate ? new Date(invoice.dueDate) : null);
        setNotes(invoice.notes ?? "");
        if (invoice.items && invoice.items.length > 0) {
          setItems(
            invoice.items.map((it, i) => ({
              id: i + 1,
              description: it.description,
              qty: it.quantity,
              price: it.unitPrice,
              tax: it.tax ?? 0,
            })),
          );
        } else {
          // Older/seed invoices have no line items - fall back to a single
          // item that reproduces the stored total amount.
          setItems([{ id: 1, description: "Invoice Amount", qty: 1, price: invoice.amount, tax: 0 }]);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load invoice");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isEdit, id]);

  const update = (itemId: number, patch: Partial<LineItem>) =>
    setItems((current) => current.map((i) => (i.id === itemId ? { ...i, ...patch } : i)));

  const addItem = () =>
    setItems((current) => [...current, blankItem(Math.max(0, ...current.map((i) => i.id)) + 1)]);

  const removeItem = (itemId: number) =>
    setItems((current) => (current.length === 1 ? current : current.filter((i) => i.id !== itemId)));

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const tax = items.reduce((sum, i) => sum + i.qty * i.price * (i.tax / 100), 0);
  const total = subtotal + tax;

  const title = isEdit ? "Edit Invoice" : "Add Invoice";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!dueDate) {
      setSubmitError("Please select a due date.");
      return;
    }

    const apiItems: InvoiceItemApi[] = items
      .filter((i) => i.description.trim().length > 0)
      .map((i) => ({
        description: i.description,
        quantity: i.qty,
        unitPrice: i.price,
        total: lineTotal(i),
        tax: i.tax,
      }));

    const payload: Partial<InvoiceWithItems> = {
      ...(invoiceNumber ? { number: invoiceNumber } : {}),
      client,
      status,
      issueDate: issueDate ? issueDate.toISOString() : undefined,
      dueDate: dueDate.toISOString(),
      amount: Number(total.toFixed(2)),
      items: apiItems,
      notes,
    };

    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateResource<Invoice>("invoices", id, payload);
      } else {
        await createResource<Invoice>("invoices", payload);
      }
      navigate(all_routes.invoices);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save invoice");
      setSubmitting(false);
    }
  };

  if (isEdit && loading) {
    return (
      <div className="p-3 lg:py-6 lg:px-0 flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isEdit && loadError) {
    return (
      <div className="p-3 lg:py-6 lg:px-0">
        <p className="text-danger text-sm">{loadError}</p>
        <Link to={all_routes.invoices} className="text-primary text-sm font-medium">
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      {lookup.error && <div className="ws-error" role="alert">{lookup.error}</div>}
      <PageHeader
        title={title}
        crumbs={[{ label: "Invoices", to: all_routes.invoices }, { label: title }]}
      />

      {submitError && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
            <FormCardHeader
              icon="icon-file-plus"
              tone="info"
              title="Invoice Information"
              subtitle={
                isEdit
                  ? "Edit invoice and manage payment terms"
                  : "Create a new invoice and manage payment terms"
              }
            />

            <form onSubmit={handleSubmit}>
              <FormGroup title="Invoice Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="invoiceClient" className={LABEL_CLASS}>
                      Client
                    </label>
                    <Select
                      inputId="invoiceClient"
                      value={client}
                      options={[...new Set([...lookup.options, client].filter(Boolean))]}
                      onChange={setClient}
                      placeholder="Select client"
                    />
                  </div>
                  <div>
                    <label htmlFor="invoiceNumber" className={LABEL_CLASS}>
                      Invoice #
                    </label>
                    <input
                      type="text"
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Auto-generated if left blank"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="invoiceIssueDate" className={LABEL_CLASS}>
                      Issue Date
                    </label>
                    <DatePicker inputId="invoiceIssueDate" value={issueDate} onChange={setIssueDate} />
                  </div>
                  <div>
                    <label htmlFor="invoiceDueDate" className={LABEL_CLASS}>
                      Due Date
                    </label>
                    <DatePicker inputId="invoiceDueDate" value={dueDate} onChange={setDueDate} />
                  </div>
                  <div>
                    <label htmlFor="invoiceStatus" className={LABEL_CLASS}>
                      Status
                    </label>
                    <Select
                      inputId="invoiceStatus"
                      value={status}
                      options={INVOICE_STATUSES}
                      onChange={(v) => setStatus(v as Invoice["status"])}
                    />
                  </div>
                </div>
              </FormGroup>

              <div className="mb-6 pb-6 border-b border-border-color">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0">Line Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm font-medium text-primary hover:text-primary-hover transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <i className="icon-plus" /> Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <TableHeadRow>
                        <th className={TH_ITEM}>Description</th>
                        <th className={TH_ITEM_CENTER}>Qty</th>
                        <th className={TH_ITEM_CENTER}>Unit Price</th>
                        <th className={TH_ITEM_CENTER}>Tax %</th>
                        <th className={TH_ITEM_END}>Line Total</th>
                        <th className={TH_ITEM_CENTER}>Action</th>
                      </TableHeadRow>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item) => (
                        <tr key={item.id} className="line-item">
                          <td className={CELL}>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => update(item.id, { description: e.target.value })}
                              placeholder="Service description"
                              className={`item-description ${ITEM_INPUT}`}
                              aria-label="Description"
                            />
                          </td>
                          <td className={CELL}>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => update(item.id, { qty: Number(e.target.value) })}
                              placeholder="1"
                              className={`item-qty ${ITEM_INPUT} text-center`}
                              aria-label="Quantity"
                            />
                          </td>
                          <td className={CELL}>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.price}
                              onChange={(e) => update(item.id, { price: Number(e.target.value) })}
                              placeholder="0.00"
                              className={`item-price ${ITEM_INPUT} text-center`}
                              aria-label="Unit price"
                            />
                          </td>
                          <td className={CELL}>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.tax}
                              onChange={(e) => update(item.id, { tax: Number(e.target.value) })}
                              placeholder="0"
                              className={`item-tax ${ITEM_INPUT} text-center`}
                              aria-label="Tax percent"
                            />
                          </td>
                          <td className={`${CELL} text-end`}>
                            <span className="item-total text-sm font-semibold text-gray-900">
                              {money2(lineTotal(item))}
                            </span>
                          </td>
                          <td className={`${CELL} text-center`}>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="remove-item size-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition cursor-pointer mx-auto"
                              aria-label="Remove item"
                            >
                              <i className="icon-trash-2 text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-border-color">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900" id="subtotal">
                      {money2(subtotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Tax</p>
                    <p className="text-xl font-bold text-gray-900" id="taxAmount">
                      {money2(tax)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="text-xs text-primary font-medium mb-1 uppercase">Total</p>
                    <p className="text-2xl font-bold text-primary" id="total">
                      {money2(total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="invoiceNotes" className={LABEL_CLASS}>
                  Notes / Terms
                </label>
                <textarea
                  id="invoiceNotes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter payment terms, notes, or conditions..."
                  className={INPUT_CLASS}
                />
              </div>

              <FormActions
                cancelTo={
                  <Link to={all_routes.invoices} className={CANCEL_CLASS}>
                    Cancel
                  </Link>
                }
                submitLabel={submitting ? "Saving..." : isEdit ? "Save Invoice" : "Create Invoice"}
              />
            </form>
          </div>
        </div>

        <QuickTips tips={TIPS} />
      </div>
    </div>
  );
};

export default InvoiceForm;
