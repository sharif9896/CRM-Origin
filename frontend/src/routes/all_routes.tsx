export const all_routes = {
  
  dashboard: "/index",

  
  properties: "/properties",
  addProperty: "/properties/add-property",
  editProperty: "/properties/edit-property",
  propertyGrid: "/properties/property-grid",
  propertyList: "/properties/property-list",
  propertyMap: "/properties/property-map",
  propertyDetails: "/properties/property-details",
  categories: "/categories",
  amenities: "/amenities",
  manualTour: "/manual-tour",


  agents: "/agents",
  addAgent: "/agents/add-agent",
  editAgent: "/agents/edit-agent",
  agentDetails: "/agents/agent-details",
  customers: "/customers",
  addCustomer: "/customers/add-customer",
  editCustomer: "/customers/edit-customer",
  customerDetails: "/customers/customer-details",
  leads: "/leads",
  addLead: "/leads/add-lead",
  editLead: "/leads/edit-lead",
  leadDetails: "/leads/lead-details",
  deals: "/deals",
  dealDetails: "/deals/deal-details",
  appointments: "/appointments",
  reviews: "/reviews",


  invoices: "/invoices",
  addInvoice: "/invoices/add-invoice",
  editInvoice: "/invoices/edit-invoice",
  invoiceDetails: "/invoices/invoice-details",
  payments: "/payments",
  transactions: "/transactions",
  reimbursements: "/reimbursements",
  reimbursementAllowances: "/reimbursements/allowances",
  reimbursementExpenses: "/reimbursements/expenses",
  reimbursementTravel: "/reimbursements/travel",
  reimbursementMeals: "/reimbursements/meals",
  reimbursementTypes: "/reimbursement-types",
  reports: "/reports",


  staff: "/staff",
  addStaff: "/staff/add-staff",
  editStaff: "/staff/edit-staff",
  roles: "/roles",
  users: "/users",
  notificationStatus: "/notification-status",
  settings: "/settings",
  profile: "/profile",

  
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  resetSuccess: "/reset-success",
  verifyEmail: "/verify-email",
  verifySuccess: "/verify-success",

  
  error404: "/error-404",
} as const;

export type RouteKey = keyof typeof all_routes;
