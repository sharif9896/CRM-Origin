import type { Invoice } from "./types";

export const invoices: Invoice[] = [
  { id: "1", number: "INV-2451", client: "Sarah Jenkins", issueDate: "01 Jun 2026", dueDate: "15 Jun 2026", amount: 12500, status: "Paid", avatar: "assets/img/avatar/avatar-01.jpg" },
  { id: "2", number: "INV-2452", client: "Raj Patel", issueDate: "03 Jun 2026", dueDate: "17 Jun 2026", amount: 8400, status: "Pending", avatar: "assets/img/avatar/avatar-03.jpg" },
  { id: "3", number: "INV-2453", client: "Emily Carter", issueDate: "05 Jun 2026", dueDate: "19 Jun 2026", amount: 24750, status: "Overdue", avatar: "assets/img/avatar/avatar-04.jpg" },
  { id: "4", number: "INV-2454", client: "Victor Moreau", issueDate: "08 Jun 2026", dueDate: "22 Jun 2026", amount: 5600, status: "Paid", avatar: "assets/img/avatar/avatar-05.jpg" },
  { id: "5", number: "INV-2455", client: "Leila Hassan", issueDate: "11 Jun 2026", dueDate: "25 Jun 2026", amount: 18900, status: "Draft", avatar: "assets/img/avatar/avatar-06.jpg" },
  { id: "6", number: "INV-2456", client: "Kevin O'Brien", issueDate: "14 Jun 2026", dueDate: "28 Jun 2026", amount: 3200, status: "Paid", avatar: "assets/img/avatar/avatar-07.jpg" },
  { id: "7", number: "INV-2457", client: "Yuki Sato", issueDate: "17 Jun 2026", dueDate: "01 Jul 2026", amount: 9750, status: "Pending", avatar: "assets/img/avatar/avatar-08.jpg" },
  { id: "8", number: "INV-2458", client: "Miguel Santos", issueDate: "20 Jun 2026", dueDate: "04 Jul 2026", amount: 14300, status: "Paid", avatar: "assets/img/avatar/avatar-09.jpg" },
  { id: "9", number: "INV-2459", client: "Clara Hoffmann", issueDate: "23 Jun 2026", dueDate: "07 Jul 2026", amount: 31200, status: "Overdue", avatar: "assets/img/avatar/avatar-10.jpg" },
  { id: "10", number: "INV-2460", client: "Andre Silva", issueDate: "26 Jun 2026", dueDate: "10 Jul 2026", amount: 6850, status: "Pending", avatar: "assets/img/avatar/avatar-11.jpg" },
  { id: "11", number: "INV-2461", client: "Nadia Rahman", issueDate: "29 Jun 2026", dueDate: "13 Jul 2026", amount: 22400, status: "Paid", avatar: "assets/img/avatar/avatar-13.jpg" },
  { id: "12", number: "INV-2462", client: "Thomas Wright", issueDate: "02 Jul 2026", dueDate: "16 Jul 2026", amount: 4950, status: "Draft", avatar: "assets/img/avatar/avatar-14.jpg" },
];
