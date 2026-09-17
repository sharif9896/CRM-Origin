import type { Payment, PaymentMethod, PaymentStatus } from "./types";

export const PAYMENT_METHODS: PaymentMethod[] = ["Bank Transfer", "Credit Card", "PayPal", "Check"];
export const PAYMENT_STATUSES: PaymentStatus[] = ["Completed", "Pending", "Failed", "Refunded"];

export const paymentStatusClass: Record<PaymentStatus, string> = {
  Completed: "text-success border-success",
  Pending: "text-warning border-warning",
  Failed: "text-danger border-danger",
  Refunded: "text-info border-info",
};

export const payments: Payment[] = [
  { id: "1", reference: "PAY-20240120-001", invoice: "INV-2024-0032", client: "Acme Corporation", date: "Jan 20, 2024", method: "Bank Transfer", amount: 8500, status: "Completed", avatar: "assets/img/avatar/avatar-01.jpg" },
  { id: "2", reference: "PAY-20240118-002", invoice: "INV-2024-0031", client: "Global Tech Solutions", date: "Jan 18, 2024", method: "Credit Card", amount: 6200, status: "Pending", avatar: "assets/img/avatar/avatar-05.jpg" },
  { id: "3", reference: "PAY-20240115-003", invoice: "INV-2024-0030", client: "Prime Enterprises", date: "Jan 15, 2024", method: "Bank Transfer", amount: 9750, status: "Completed", avatar: "assets/img/avatar/avatar-03.jpg" },
  { id: "4", reference: "PAY-20240112-004", invoice: "INV-2024-0029", client: "Digital Marketing Inc", date: "Jan 12, 2024", method: "PayPal", amount: 12350, status: "Completed", avatar: "assets/img/avatar/avatar-07.jpg" },
  { id: "5", reference: "PAY-20240110-005", invoice: "INV-2024-0028", client: "Sunrise Partners", date: "Jan 10, 2024", method: "Credit Card", amount: 15600, status: "Completed", avatar: "assets/img/avatar/avatar-04.jpg" },
  { id: "6", reference: "PAY-8806", invoice: "INV-2458", client: "Miguel Santos", date: "04 Jul 2026", method: "Bank Transfer", amount: 14300, status: "Completed", avatar: "assets/img/avatar/avatar-09.jpg" },
  { id: "7", reference: "PAY-8807", invoice: "INV-2457", client: "Yuki Sato", date: "06 Jul 2026", method: "PayPal", amount: 9750, status: "Pending", avatar: "assets/img/avatar/avatar-08.jpg" },
  { id: "8", reference: "PAY-8808", invoice: "INV-2461", client: "Nadia Rahman", date: "09 Jul 2026", method: "Bank Transfer", amount: 22400, status: "Completed", avatar: "assets/img/avatar/avatar-13.jpg" },
  { id: "9", reference: "PAY-8809", invoice: "INV-2459", client: "Clara Hoffmann", date: "11 Jul 2026", method: "Credit Card", amount: 31200, status: "Failed", avatar: "assets/img/avatar/avatar-10.jpg" },
  { id: "10", reference: "PAY-8810", invoice: "INV-2460", client: "Andre Silva", date: "13 Jul 2026", method: "Check", amount: 6850, status: "Pending", avatar: "assets/img/avatar/avatar-11.jpg" },
  { id: "11", reference: "PAY-8811", invoice: "INV-2455", client: "Leila Hassan", date: "14 Jul 2026", method: "Bank Transfer", amount: 18900, status: "Completed", avatar: "assets/img/avatar/avatar-06.jpg" },
  { id: "12", reference: "PAY-8812", invoice: "INV-2462", client: "Thomas Wright", date: "15 Jul 2026", method: "Credit Card", amount: 4950, status: "Completed", avatar: "assets/img/avatar/avatar-14.jpg" },
];
