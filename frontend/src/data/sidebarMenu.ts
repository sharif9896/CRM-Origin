import type { RouteKey } from "../routes/all_routes";

export type MenuItem = {
  label: string;
  icon?: string;
  routeKey?: RouteKey;
  children?: MenuItem[];
};

export type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export const sidebarMenu: MenuGroup[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: "icon-layout-panel-left", routeKey: "dashboard" },
    ],
  },
  {
    title: "Real Estate",
    items: [
      {
        label: "Properties",
        icon: "icon-hotel",
        children: [
          { label: "All Properties", routeKey: "properties" },
          { label: "Add Property", routeKey: "addProperty" },
          { label: "Edit Property", routeKey: "editProperty" },
          { label: "Property Grid", routeKey: "propertyGrid" },
          { label: "Property List", routeKey: "propertyList" },
          { label: "Property Map", routeKey: "propertyMap" },
          { label: "Property Details", routeKey: "propertyDetails" },
        ],
      },
      { label: "Categories", icon: "icon-folder-tree", routeKey: "categories" },
      { label: "Amenities", icon: "icon-sparkles", routeKey: "amenities" },
      { label: "Manual Tour", icon: "icon-video", routeKey: "manualTour" },
    ],
  },
  {
    title: "CRM & Sales",
    items: [
      {
        label: "Agents",
        icon: "icon-users",
        children: [
          { label: "All Agents", routeKey: "agents" },
          { label: "Add Agent", routeKey: "addAgent" },
          { label: "Edit Agent", routeKey: "editAgent" },
          { label: "Agent Details", routeKey: "agentDetails" },
        ],
      },
      {
        label: "Customers",
        icon: "icon-circle-user-round",
        children: [
          { label: "All Customers", routeKey: "customers" },
          { label: "Add Customer", routeKey: "addCustomer" },
          { label: "Edit Customer", routeKey: "editCustomer" },
          { label: "Customer Details", routeKey: "customerDetails" },
        ],
      },
      {
        label: "Leads",
        icon: "icon-user-plus",
        children: [
          { label: "All Leads", routeKey: "leads" },
          { label: "Add Lead", routeKey: "addLead" },
          { label: "Edit Lead", routeKey: "editLead" },
          { label: "Lead Details", routeKey: "leadDetails" },
        ],
      },
      {
        label: "Deals",
        icon: "icon-handshake",
        children: [
          { label: "Deals", routeKey: "deals" },
          { label: "Deal Details", routeKey: "dealDetails" },
        ],
      },
      { label: "Appointments", icon: "icon-calendar-check-2", routeKey: "appointments" },
      { label: "Reviews", icon: "icon-star", routeKey: "reviews" },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Invoices",
        icon: "icon-file-text",
        children: [
          { label: "All Invoices", routeKey: "invoices" },
          { label: "Add Invoice", routeKey: "addInvoice" },
          { label: "Edit Invoice", routeKey: "editInvoice" },
          { label: "Invoice Details", routeKey: "invoiceDetails" },
        ],
      },
      { label: "Payments", icon: "icon-credit-card", routeKey: "payments" },
      { label: "Transactions", icon: "icon-arrow-left-right", routeKey: "transactions" },
      {
        label: "Reimbursements",
        icon: "icon-receipt-text",
        children: [
          { label: "All Claims", routeKey: "reimbursements" },
          { label: "Allowances", routeKey: "reimbursementAllowances" },
          { label: "All Expenses", routeKey: "reimbursementExpenses" },
          { label: "Travel Expenses", routeKey: "reimbursementTravel" },
          { label: "Food & Meals", routeKey: "reimbursementMeals" },
          { label: "Types & Policies", routeKey: "reimbursementTypes" },
        ],
      },
      { label: "Reports", icon: "icon-chart-column", routeKey: "reports" },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Staff",
        icon: "icon-users",
        children: [
          { label: "All Staff", routeKey: "staff" },
          { label: "User Accounts", routeKey: "users" },
          { label: "Add Staff", routeKey: "addStaff" },
          { label: "Edit Staff", routeKey: "editStaff" },
        ],
      },
      { label: "Roles & Permissions", icon: "icon-shield-check", routeKey: "roles" },
      { label: "Notification Status", icon: "icon-send", routeKey: "notificationStatus" },
      {
        label: "Settings",
        icon: "icon-settings",
        children: [
          { label: "General Settings", routeKey: "settings" },
          { label: "Profile", routeKey: "profile" },
        ],
      },
    ],
  },
];
