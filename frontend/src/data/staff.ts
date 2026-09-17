import type { Staff, StaffStatus } from "./types";

export const STAFF_STATUSES: StaffStatus[] = ["Active", "Inactive", "On Leave", "Pending"];

export const STAFF_FORM_STATUSES = ["Active", "Inactive"];

export const STAFF_ROLES = ["Admin", "Manager", "Senior Agent", "Junior Agent", "Viewer"];

export const STAFF_DEPARTMENTS = ["Sales", "Operations", "Support", "Management"];

export const staffStatusClass: Record<StaffStatus, string> = {
  Active: "text-success border-success",
  Inactive: "text-danger border-danger",
  "On Leave": "text-warning border-warning",
  Pending: "text-info border-info",
};

export const staff: Staff[] = [
  { id: "1", name: "Jennifer Martinez", email: "jennifer@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: "Jan 15, 2022", avatar: "assets/img/avatar/avatar-02.jpg" },
  { id: "2", name: "Gabriella White", email: "gabriella@example.com", role: "Manager", department: "Operations", status: "Active", joinDate: "Mar 22, 2021", avatar: "assets/img/avatar/avatar-03.jpg" },
  { id: "3", name: "Christopher Rey", email: "christopher@example.com", role: "Junior Agent", department: "Sales", status: "On Leave", joinDate: "Jul 08, 2023", avatar: "assets/img/avatar/avatar-04.jpg" },
  { id: "4", name: "Michelle Anderson", email: "michelle@example.com", role: "Viewer", department: "Support", status: "Inactive", joinDate: "Nov 30, 2023", avatar: "assets/img/avatar/avatar-05.jpg" },
  { id: "5", name: "David Chen", email: "david@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: "Feb 14, 2022", avatar: "assets/img/avatar/avatar-20.jpg" },
  { id: "6", name: "Robert Sinclair", email: "robert@example.com", role: "Admin", department: "Operations", status: "Active", joinDate: "Aug 03, 2020", avatar: "assets/img/avatar/avatar-24.jpg" },
  { id: "7", name: "Aisha Karim", email: "aisha@example.com", role: "Junior Agent", department: "Management", status: "On Leave", joinDate: "May 19, 2023", avatar: "assets/img/avatar/avatar-23.jpg" },
  { id: "8", name: "Sara Lindgren", email: "sara@example.com", role: "Manager", department: "Operations", status: "Active", joinDate: "Oct 11, 2021", avatar: "assets/img/avatar/avatar-27.jpg" },
  { id: "9", name: "James Okonkwo", email: "james@example.com", role: "Junior Agent", department: "Sales", status: "Active", joinDate: "Jan 27, 2023", avatar: "assets/img/avatar/avatar-26.jpg" },
  { id: "10", name: "Elena Petrova", email: "elena@example.com", role: "Viewer", department: "Support", status: "Inactive", joinDate: "Sep 05, 2023", avatar: "assets/img/avatar/avatar-25.jpg" },
  { id: "11", name: "Tomas Alvarez", email: "tomas@example.com", role: "Senior Agent", department: "Sales", status: "Active", joinDate: "Apr 18, 2022", avatar: "assets/img/avatar/avatar-28.jpg" },
  { id: "12", name: "Nina Kowalski", email: "nina@example.com", role: "Junior Agent", department: "Management", status: "Active", joinDate: "Jun 30, 2023", avatar: "assets/img/avatar/avatar-29.jpg" },
];

export const ROLE_COLUMNS = ["Admin", "Manager", "Senior Agent", "Agent", "Viewer"];

export const PERMISSIONS = [
  { name: "View Dashboard", allowed: [true, true, true, true, true] },
  { name: "Create Leads", allowed: [true, true, true, true, false] },
  { name: "Edit Leads", allowed: [true, true, true, true, false] },
  { name: "Delete Leads", allowed: [true, true, false, false, false] },
  { name: "Create Deals", allowed: [true, true, true, true, false] },
  { name: "View Reports", allowed: [true, true, true, false, false] },
  { name: "Export Reports", allowed: [true, true, false, false, false] },
  { name: "Manage Staff", allowed: [true, true, false, false, false] },
  { name: "Edit Roles", allowed: [true, false, false, false, false] },
  { name: "View Settings", allowed: [true, true, false, false, false] },
  { name: "Edit Settings", allowed: [true, false, false, false, false] },
  { name: "View Audit Logs", allowed: [true, true, false, false, false] },
];
