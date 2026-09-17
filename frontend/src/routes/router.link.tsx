import { all_routes } from "./all_routes";
import { lazyRoute } from "./lazyRoute";
import AuthSkeleton from "../components/skeletons/authSkeleton";
import CardGridSkeleton from "../components/skeletons/cardGridSkeleton";
import ChartsSkeleton from "../components/skeletons/chartsSkeleton";
import DashboardSkeleton from "../components/skeletons/dashboardSkeleton";
import DetailSkeleton from "../components/skeletons/detailSkeleton";
import FormSkeleton from "../components/skeletons/formSkeleton";
import KanbanSkeleton from "../components/skeletons/kanbanSkeleton";
import ListSkeleton from "../components/skeletons/listSkeleton";
import TableSkeleton from "../components/skeletons/tableSkeleton";
import TabsSkeleton from "../components/skeletons/tabsSkeleton";

const route = all_routes;

export type AppRoute = {
  path: string;
  element: React.ReactNode;
  meta_title: string;
};

export const publicRoutes: AppRoute[] = [
  { path: route.users, element: lazyRoute(() => import("../views/staff/users"), <TableSkeleton />), meta_title: "User Accounts" },
  { path: route.notificationStatus, element: lazyRoute(() => import("../views/settings/notificationStatus"), <TableSkeleton cols={7} rows={8} />), meta_title: "Notification Status" },

  {
    path: route.dashboard,
    element: lazyRoute(() => import("../views/dashboard/dashboard"), <DashboardSkeleton />),
    meta_title: "Realestate Dashboard",
  },


  {
    path: route.properties,
    element: lazyRoute(
      () => import("../views/properties/allProperties"),
      <TableSkeleton cols={6} rows={8} />,
    ),
    meta_title: "All Properties",
  },
  {
    path: route.addProperty,
    element: lazyRoute(
      () => import("../views/properties/addProperty"),
      <FormSkeleton groups={[6, 6, 4]} />,
    ),
    meta_title: "Add Property",
  },
  {
    path: `${route.editProperty}/:id`,
    element: lazyRoute(
      () => import("../views/properties/editProperty"),
      <FormSkeleton groups={[6, 6, 4]} />,
    ),
    meta_title: "Edit Property",
  },
  {
    path: route.propertyGrid,
    element: lazyRoute(
      () => import("../views/properties/propertyGrid"),
      <CardGridSkeleton cards={6} statCards={0} variant="media" />,
    ),
    meta_title: "Property Grid",
  },
  {
    path: route.propertyList,
    element: lazyRoute(
      () => import("../views/properties/propertyList"),
      <TableSkeleton cols={6} rows={8} statCards={0} />,
    ),
    meta_title: "Property List",
  },
  {
    path: route.propertyMap,
    element: lazyRoute(
      () => import("../views/properties/propertyMap"),
      <CardGridSkeleton cards={4} statCards={0} variant="media" colSpan="col-span-12 md:col-span-6" />,
    ),
    meta_title: "Property Map",
  },
  {
    path: `${route.propertyDetails}/:id`,
    element: lazyRoute(
      () => import("../views/properties/propertyDetails"),
      <DetailSkeleton gallery mainCards={4} sideCards={2} />,
    ),
    meta_title: "Property Details",
  },
  {
    path: route.categories,
    element: lazyRoute(
      () => import("../views/taxonomy/categories"),
      <TableSkeleton cols={4} rows={8} avatarColumn={false} />,
    ),
    meta_title: "Categories",
  },
  {
    path: route.amenities,
    element: lazyRoute(
      () => import("../views/taxonomy/amenities"),
      <TableSkeleton cols={4} rows={8} statCards={0} avatarColumn={false} />,
    ),
    meta_title: "Amenities",
  },
  {
    path: route.manualTour,
    element: lazyRoute(
      () => import("../views/tours/manualTour"),
      <TableSkeleton cols={5} rows={6} statCards={0} />,
    ),
    meta_title: "Manual Tour",
  },


  {
    path: route.agents,
    element: lazyRoute(() => import("../views/agents/agents"), <CardGridSkeleton cards={6} />),
    meta_title: "Agents",
  },
  {
    path: route.addAgent,
    element: lazyRoute(() => import("../views/agents/addAgent"), <FormSkeleton groups={[5, 4, 2]} />),
    meta_title: "Add Agent",
  },
  {
    path: `${route.editAgent}/:id`,
    element: lazyRoute(() => import("../views/agents/editAgent"), <FormSkeleton groups={[5, 4, 2]} />),
    meta_title: "Edit Agent",
  },
  {
    path: `${route.agentDetails}/:id`,
    element: lazyRoute(() => import("../views/agents/agentDetails"), <DetailSkeleton />),
    meta_title: "Agent Details",
  },
  {
    path: route.customers,
    element: lazyRoute(() => import("../views/customers/customers"), <TableSkeleton cols={5} rows={8} />),
    meta_title: "Customers",
  },
  {
    path: route.addCustomer,
    element: lazyRoute(
      () => import("../views/customers/addCustomer"),
      <FormSkeleton groups={[4, 4, 2]} />,
    ),
    meta_title: "Add Customer",
  },
  {
    path: `${route.editCustomer}/:id`,
    element: lazyRoute(
      () => import("../views/customers/editCustomer"),
      <FormSkeleton groups={[4, 4, 2]} />,
    ),
    meta_title: "Edit Customer",
  },
  {
    path: `${route.customerDetails}/:id`,
    element: lazyRoute(() => import("../views/customers/customerDetails"), <DetailSkeleton />),
    meta_title: "Customer Details",
  },
  {
    path: route.leads,
    element: lazyRoute(() => import("../views/leads/leads"), <TableSkeleton cols={6} rows={8} />),
    meta_title: "Leads",
  },
  {
    path: route.addLead,
    element: lazyRoute(() => import("../views/leads/addLead"), <FormSkeleton groups={[4, 4, 2]} />),
    meta_title: "Add Lead",
  },
  {
    path: `${route.editLead}/:id`,
    element: lazyRoute(() => import("../views/leads/editLead"), <FormSkeleton groups={[4, 4, 2]} />),
    meta_title: "Edit Lead",
  },
  {
    path: `${route.leadDetails}/:id`,
    element: lazyRoute(() => import("../views/leads/leadDetails"), <DetailSkeleton />),
    meta_title: "Lead Details",
  },
  {
    path: route.deals,
    element: lazyRoute(() => import("../views/deals/deals"), <KanbanSkeleton />),
    meta_title: "Deals",
  },
  {
    path: `${route.dealDetails}/:id`,
    element: lazyRoute(() => import("../views/deals/dealDetails"), <DetailSkeleton />),
    meta_title: "Deal Details",
  },
  {
    path: route.appointments,
    element: lazyRoute(() => import("../views/appointments/appointments"), <ListSkeleton rows={6} />),
    meta_title: "Appointments",
  },
  {
    path: route.reviews,
    element: lazyRoute(
      () => import("../views/reviews/reviews"),
      <ListSkeleton rows={6} />,
    ),
    meta_title: "Reviews",
  },


  {
    path: route.invoices,
    element: lazyRoute(() => import("../views/invoices/invoices"), <TableSkeleton cols={6} rows={8} />),
    meta_title: "Invoices",
  },
  {
    path: route.addInvoice,
    element: lazyRoute(
      () => import("../views/invoices/addInvoice"),
      <FormSkeleton groups={[4, 4, 2]} upload={false} />,
    ),
    meta_title: "Add Invoice",
  },
  {
    path: `${route.editInvoice}/:id`,
    element: lazyRoute(
      () => import("../views/invoices/editInvoice"),
      <FormSkeleton groups={[4, 4, 2]} upload={false} />,
    ),
    meta_title: "Edit Invoice",
  },
  {
    path: `${route.invoiceDetails}/:id`,
    element: lazyRoute(
      () => import("../views/invoices/invoiceDetails"),
      <DetailSkeleton breakpoint="lg" tiles={0} mainCards={4} />,
    ),
    meta_title: "Invoice Details",
  },
  {
    path: route.payments,
    element: lazyRoute(() => import("../views/finance/payments"), <TableSkeleton cols={6} rows={8} />),
    meta_title: "Payments",
  },
  {
    path: route.transactions,
    element: lazyRoute(
      () => import("../views/finance/transactions"),
      <TableSkeleton cols={6} rows={8} />,
    ),
    meta_title: "Transactions",
  },
  {
    path: route.reimbursements,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements"), <TableSkeleton cols={7} rows={8} />),
    meta_title: "Reimbursement Claims",
  },
  {
    path: route.reimbursementAllowances,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements").then(module => ({ default: module.ReimbursementAllowances })), <TableSkeleton cols={7} rows={8} />),
    meta_title: "Allowances",
  },
  {
    path: route.reimbursementExpenses,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements").then(module => ({ default: module.ReimbursementExpenses })), <TableSkeleton cols={7} rows={8} />),
    meta_title: "Expense Claims",
  },
  {
    path: route.reimbursementTravel,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements").then(module => ({ default: module.ReimbursementTravel })), <TableSkeleton cols={7} rows={8} />),
    meta_title: "Travel Expense Reimbursements",
  },
  {
    path: route.reimbursementMeals,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements").then(module => ({ default: module.ReimbursementMeals })), <TableSkeleton cols={7} rows={8} />),
    meta_title: "Food & Meal Reimbursements",
  },
  {
    path: route.reimbursementTypes,
    element: lazyRoute(() => import("../views/reimbursements/reimbursements").then(module => ({ default: module.ReimbursementTypes })), <TableSkeleton cols={6} rows={8} />),
    meta_title: "Reimbursement Types & Policies",
  },
  {
    path: route.reports,
    element: lazyRoute(() => import("../views/finance/reports"), <ChartsSkeleton />),
    meta_title: "Reports",
  },


  {
    path: route.staff,
    element: lazyRoute(() => import("../views/staff/staff"), <TableSkeleton cols={5} rows={8} />),
    meta_title: "Staff",
  },
  {
    path: route.addStaff,
    element: lazyRoute(() => import("../views/staff/addStaff"), <FormSkeleton groups={[5, 4, 2]} />),
    meta_title: "Add Staff",
  },
  {
    path: `${route.editStaff}/:id`,
    element: lazyRoute(() => import("../views/staff/editStaff"), <FormSkeleton groups={[5, 4, 2]} />),
    meta_title: "Edit Staff",
  },
  {
    path: route.roles,
    element: lazyRoute(
      () => import("../views/staff/roles"),
      <TableSkeleton cols={5} rows={8} avatarColumn={false} />,
    ),
    meta_title: "Roles & Permissions",
  },
  {
    path: route.settings,
    element: lazyRoute(() => import("../views/settings/settings"), <TabsSkeleton />),
    meta_title: "Settings",
  },
  {
    path: route.profile,
    element: lazyRoute(() => import("../views/profile/profile"), <DetailSkeleton actions={1} tiles={3} />),
    meta_title: "My Profile",
  },
];

export const authRoutes: AppRoute[] = [
  {
    path: route.login,
    element: lazyRoute(() => import("../views/auth/login"), <AuthSkeleton fields={2} />),
    meta_title: "Login",
  },
  {
    path: route.register,
    element: lazyRoute(() => import("../views/auth/register"), <AuthSkeleton fields={4} />),
    meta_title: "Register",
  },
  {
    path: route.forgotPassword,
    element: lazyRoute(
      () => import("../views/auth/forgotPassword"),
      <AuthSkeleton fields={1} social={false} />,
    ),
    meta_title: "Forgot Password",
  },
  {
    path: `${route.resetPassword}/:token`,
    element: lazyRoute(
      () => import("../views/auth/resetPassword"),
      <AuthSkeleton fields={2} social={false} />,
    ),
    meta_title: "Reset Password",
  },
  {
    path: route.resetSuccess,
    element: lazyRoute(
      () => import("../views/auth/resetSuccess"),
      <AuthSkeleton fields={0} social={false} />,
    ),
    meta_title: "Reset Success",
  },
  {
    path: `${route.verifyEmail}/:token`,
    element: lazyRoute(
      () => import("../views/auth/verifyEmail"),
      <AuthSkeleton fields={1} social={false} />,
    ),
    meta_title: "Verify Email",
  },
  {
    path: route.verifySuccess,
    element: lazyRoute(
      () => import("../views/auth/verifySuccess"),
      <AuthSkeleton fields={0} social={false} />,
    ),
    meta_title: "Verification Success",
  },
  {
    path: route.error404,
    element: lazyRoute(
      () => import("../views/auth/error404"),
      <AuthSkeleton fields={0} social={false} />,
    ),
    meta_title: "404 Not Found",
  },
];
