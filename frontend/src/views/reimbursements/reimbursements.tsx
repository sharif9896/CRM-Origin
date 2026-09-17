import { useEffect, useMemo, useState } from "react";
import RecordWorkspace from "../../components/workspace/recordWorkspace";
import { apiRequest } from "../../lib/apiClient";

type ReimbursementSummary = {
  total: number;
  totalAmount: number;
  pending: { count: number; amount: number };
  approved: { count: number; amount: number };
  paid: { count: number; amount: number };
  rejected: { count: number; amount: number };
  currency: string;
};

const ReimbursementMetrics = ({ params }: { params: Record<string, string> }) => {
  const [summary, setSummary] = useState<ReimbursementSummary | null>(null);
  const [error, setError] = useState("");
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const load = () => {
      setError("");
      apiRequest<{ data: ReimbursementSummary }>("/reimbursements/summary", { params: JSON.parse(paramsKey) })
        .then((response) => {
          if (active) setSummary(response.data);
        })
        .catch((requestError: Error) => {
          if (active) setError(requestError.message);
        });
    };
    load();
    window.addEventListener("crm:records-changed", load);
    return () => {
      active = false;
      window.removeEventListener("crm:records-changed", load);
    };
  }, [paramsKey]);

  const money = useMemo(
    () => (value: number) => new Intl.NumberFormat("en", {
      style: "currency",
      currency: summary?.currency || "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value),
    [summary?.currency],
  );

  if (error) return <div className="ws-error reimbursement-summary-error" role="alert">Unable to load reimbursement totals: {error}</div>;
  if (!summary) return <div className="reimbursement-summary-grid" role="status">{Array.from({ length: 4 }, (_, index) => <div className="reimbursement-summary-skeleton" key={index} />)}</div>;

  const cards = [
    { label: "Total claims", value: summary.total.toLocaleString(), note: money(summary.totalAmount), icon: "icon-receipt-text", accent: "gold" },
    { label: "Pending review", value: summary.pending.count.toLocaleString(), note: money(summary.pending.amount), icon: "icon-clock-3", accent: "orange" },
    { label: "Approved", value: summary.approved.count.toLocaleString(), note: money(summary.approved.amount), icon: "icon-badge-check", accent: "blue" },
    { label: "Paid", value: money(summary.paid.amount), note: `${summary.paid.count} completed claims`, icon: "icon-circle-dollar-sign", accent: "green" },
  ];

  return <div className="reimbursement-summary-grid">
    {cards.map((card) => <article className={`reimbursement-summary-card accent-${card.accent}`} key={card.label}>
      <div><span>{card.label}</span><strong>{card.value}</strong><small>{card.note}</small></div>
      <i className={card.icon} />
    </article>)}
  </div>;
};

const ClaimsWorkspace = ({ title, params = {} }: { title: string; params?: Record<string, string> }) => (
  <RecordWorkspace
    resource="reimbursements"
    title={title}
    params={params}
    summary={<ReimbursementMetrics params={params} />}
  />
);

export default function Reimbursements() {
  return <ClaimsWorkspace title="Reimbursement claims" />;
}

export function ReimbursementAllowances() {
  return <ClaimsWorkspace title="Allowances" params={{ kind: "Allowance" }} />;
}

export function ReimbursementExpenses() {
  return <ClaimsWorkspace title="Expense claims" params={{ kind: "Expense" }} />;
}

export function ReimbursementTravel() {
  return <ClaimsWorkspace title="Travel expense reimbursements" params={{ category: "Travel" }} />;
}

export function ReimbursementMeals() {
  return <ClaimsWorkspace title="Food & meal reimbursements" params={{ category: "Food & Meals" }} />;
}

export function ReimbursementTypes() {
  return <RecordWorkspace resource="reimbursement-types" title="Reimbursement types & policies" />;
}
