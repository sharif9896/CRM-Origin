import type { Transaction, TransactionStatus, TransactionType } from "./types";

export const TRANSACTION_TYPES: TransactionType[] = ["Credit", "Debit"];

export const transactionTypeClass: Record<TransactionType, string> = {
  Credit: "text-success border-success",
  Debit: "text-danger border-danger",
};
export const TRANSACTION_STATUSES: TransactionStatus[] = ["Completed", "Pending", "Failed"];

export const transactionStatusClass: Record<TransactionStatus, string> = {
  Completed: "text-success border-success",
  Pending: "text-warning border-warning",
  Failed: "text-danger border-danger",
};

export const transactions: Transaction[] = [
  { id: "1", reference: "TXN-20240120-045", type: "Credit", description: "Invoice Payment - Acme Corp", date: "Jan 20, 2024", account: "Checking", amount: 8500, status: "Completed" },
  { id: "2", reference: "TXN-20240119-044", type: "Debit", description: "Office Supplies Purchase", date: "Jan 19, 2024", account: "Expenses", amount: 1250, status: "Completed" },
  { id: "3", reference: "TXN-20240118-043", type: "Credit", description: "Payment - Global Tech", date: "Jan 18, 2024", account: "Savings", amount: 6200, status: "Completed" },
  { id: "4", reference: "TXN-20240117-042", type: "Debit", description: "Payroll Distribution", date: "Jan 17, 2024", account: "Payroll", amount: 18500, status: "Completed" },
  { id: "5", reference: "TXN-20240116-041", type: "Credit", description: "Invoice Settlement - Prime", date: "Jan 16, 2024", account: "Checking", amount: 9750, status: "Completed" },
  { id: "6", reference: "TXN-5506", type: "Debit", description: "Property photography", date: "10 Jul 2026", account: "Marketing Account", amount: 1850, status: "Completed" },
  { id: "7", reference: "TXN-5507", type: "Credit", description: "Commission — Coral Heights", date: "08 Jul 2026", account: "Operating Account", amount: 24450, status: "Completed" },
  { id: "8", reference: "TXN-5508", type: "Debit", description: "Agent payroll — July", date: "05 Jul 2026", account: "Payroll Account", amount: 42600, status: "Completed" },
  { id: "9", reference: "TXN-5509", type: "Debit", description: "MLS subscription renewal", date: "03 Jul 2026", account: "Operating Account", amount: 2400, status: "Failed" },
  { id: "10", reference: "TXN-5510", type: "Credit", description: "Commission — Aspen Ridge Estate", date: "01 Jul 2026", account: "Operating Account", amount: 93600, status: "Completed" },
  { id: "11", reference: "TXN-5511", type: "Debit", description: "Software licences", date: "28 Jun 2026", account: "Operating Account", amount: 3150, status: "Completed" },
  { id: "12", reference: "TXN-5512", type: "Credit", description: "Referral fee — partner agency", date: "26 Jun 2026", account: "Operating Account", amount: 5200, status: "Pending" },
  { id: "13", reference: "TXN-5513", type: "Debit", description: "Client entertainment", date: "24 Jun 2026", account: "Operating Account", amount: 940, status: "Completed" },
  { id: "14", reference: "TXN-5514", type: "Credit", description: "Commission — Bayview Terrace", date: "21 Jun 2026", account: "Operating Account", amount: 28200, status: "Completed" },
];
