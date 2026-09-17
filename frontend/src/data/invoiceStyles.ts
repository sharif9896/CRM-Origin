import type { InvoiceStatus } from "./types";

export const INVOICE_STATUSES: InvoiceStatus[] = ["Paid", "Pending", "Overdue", "Draft"];

export const invoiceStatusClass: Record<InvoiceStatus, string> = {
  Paid: "text-success border-success",
  Pending: "text-warning border-warning",
  Overdue: "text-danger border-danger",
  Draft: "text-gray-500 border-gray-300",
};

export const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export const compactMoney = (value: number) =>
  value >= 1_000_000 ? `$${(value / 1_000_000).toFixed(1)}M` : `$${(value / 1000).toFixed(1)}K`;
