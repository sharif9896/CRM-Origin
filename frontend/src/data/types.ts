
/** Backend documents are MongoDB records, so ids are string ObjectIds. */
export type Entity = { id: string };

export type LeadStatus = "New" | "Warm" | "Hot" | "Converted";

export type Lead = Entity & {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  budget: string;
  budgetMin?: number;
  budgetMax?: number;
  source?: string;
  propertyType?: string;
  assignedTo: string;
  avatar: string;
};

export type PropertyStatus = "For Sale" | "For Rent" | "Sold" | "Pending";

export type PropertyType = "Villa" | "Apartment" | "Penthouse" | "Office";

export type Property = Entity & {
  name: string;
  location: string;
  type: PropertyType;
  price: number;
  beds: number;
  baths: number;
  garage?: number;
  sqft: number;
  status: PropertyStatus;
  availableFrom?: string;
  amenities?: string[];
  description?: string;
  agent: string;
  agentRef?: string;
  agentAvatar: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerWhatsapp?: string;
  ownerRef?: string;
  image: string;
  images?: string[];
};

export type AgentStatus = "Active" | "Inactive" | "Away";

export type Agent = Entity & {
  name: string;
  rank: string;
  email: string;
  phone: string;
  role: string;
  status: AgentStatus;
  listings: number;
  deals: number;
  revenue: number;
  rating: number;
  avatar: string;
};

export type CustomerStatus = LeadStatus;

export type Customer = Entity & {
  name: string;
  email: string;
  phone: string;
  interestedIn: string;
  source?: string;
  status: CustomerStatus;
  joined: string;
  avatar: string;
};

export type DealStage = "New" | "Negotiation" | "Due Diligence" | "Won";

export type Deal = Entity & {
  title: string;
  value: number;
  price: string;
  stage: DealStage;
  agent: string;
  avatar: string;
  customer: string;
  closeDate: string;
};

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

export type Invoice = Entity & {
  number: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  avatar: string;
};

export type PaymentMethod = "Bank Transfer" | "Credit Card" | "PayPal" | "Check";
export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Refunded";

export type Payment = Entity & {
  reference: string;
  invoice: string;
  client: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  avatar: string;
};

export type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export type Appointment = Entity & {
  title: string;
  location: string;
  when: string;
  duration: string;
  client: string;
  avatar: string;
  status: AppointmentStatus;
  icon: string;
  agentRef?: string;
  propertyRef?: string;
  requesterRef?: string;
  requesterEmail?: string;
  requesterWhatsapp?: string;
  notificationStatus?: "queued" | "sent" | "partial" | "failed" | "skipped";
  notes?: string;
};

export type StaffStatus = "Active" | "Inactive" | "On Leave" | "Pending";

export type Staff = Entity & {
  name: string;
  email: string;
  role: string;
  department: string;
  status: StaffStatus;
  joinDate: string;
  avatar: string;
};

export type Review = Entity & {
  author: string;
  avatar: string;
  property: string;
  rating: number;
  comment: string;
  date: string;
  replied: boolean;
  reply?: string;
};

export type Taxonomy = Entity & {
  name: string;
  icon: string;
  badge?: string;
  usedIn: number;
  status: "Active" | "Inactive";
};

export type Tour = Entity & {
  property: string;
  location: string;
  image: string;
  duration: string;
  views: number;
  status: "Published" | "Draft";
};

export type TransactionType = "Credit" | "Debit";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export type Transaction = Entity & {
  reference: string;
  type: TransactionType;
  description: string;
  date: string;
  account: string;
  amount: number;
  status: TransactionStatus;
};

export type ReimbursementKind = "Allowance" | "Expense";
export type ReimbursementStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Paid" | "Cancelled";

export type Reimbursement = Entity & {
  claimNumber: string;
  employeeName: string;
  employeeEmail: string;
  kind: ReimbursementKind;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  submittedDate: string;
  status: ReimbursementStatus;
  paymentMethod: string;
  receiptNumber?: string;
  receiptUrl?: string;
  approvedBy?: string;
  paymentReference?: string;
  taxable: boolean;
  recurring: boolean;
  notes?: string;
};

export type ReimbursementType = Entity & {
  name: string;
  code: string;
  kind: ReimbursementKind;
  category: string;
  description?: string;
  defaultLimit: number;
  receiptRequired: boolean;
  taxable: boolean;
  active: boolean;
};
