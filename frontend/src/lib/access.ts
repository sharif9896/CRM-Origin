import { all_routes, type RouteKey } from '../routes/all_routes';

const administrationRoutes = new Set<RouteKey>(['roles', 'users', 'settings', 'notificationStatus']);
const menuRoutes = new Set<RouteKey>([
  'dashboard',
  'properties', 'addProperty', 'editProperty', 'propertyGrid', 'propertyList', 'propertyMap', 'propertyDetails',
  'categories', 'amenities', 'manualTour',
  'agents', 'addAgent', 'editAgent', 'agentDetails',
  'customers', 'addCustomer', 'editCustomer', 'customerDetails',
  'leads', 'addLead', 'editLead', 'leadDetails',
  'deals', 'dealDetails', 'appointments', 'reviews',
  'invoices', 'addInvoice', 'editInvoice', 'invoiceDetails',
  'payments', 'transactions', 'reports',
  'reimbursements', 'reimbursementAllowances', 'reimbursementExpenses', 'reimbursementTravel', 'reimbursementMeals', 'reimbursementTypes',
  'staff', 'addStaff', 'editStaff', 'profile',
]);

const routeEntries = (Object.entries(all_routes) as [RouteKey, string][])
  .filter(([key]) => menuRoutes.has(key) || administrationRoutes.has(key))
  .sort((left, right) => right[1].length - left[1].length);

export const routeKeyForPath = (pathname: string): RouteKey | null => {
  const match = routeEntries.find(([, route]) => pathname === route || pathname.startsWith(`${route}/`));
  return match?.[0] || null;
};

export const menuPermissionForRoute = (routeKey: RouteKey): string | null =>
  menuRoutes.has(routeKey) ? `menu:${routeKey}` : null;

export const menuPermissionForPath = (pathname: string): string | null => {
  const routeKey = routeKeyForPath(pathname);
  return routeKey ? menuPermissionForRoute(routeKey) : null;
};

export const resourceForPath = (pathname: string): string | null => {
  let resource = pathname.split('/').filter(Boolean)[0] || '';
  if (resource === 'categories' || resource === 'amenities') resource = 'taxonomies';
  if (resource === 'manual-tour') resource = 'tours';
  const known = new Set(['properties', 'agents', 'customers', 'leads', 'deals', 'invoices', 'payments', 'transactions', 'reimbursements', 'reimbursement-types', 'appointments', 'staff', 'reviews', 'taxonomies', 'tours']);
  return known.has(resource) ? resource : null;
};

export const permissionForPath = (pathname: string): string | null => {
  if ([all_routes.roles, all_routes.users, all_routes.settings, all_routes.notificationStatus].some(path => pathname === path || pathname.startsWith(path + '/'))) return 'admin';
  if (pathname === all_routes.profile || pathname.startsWith(all_routes.profile + '/')) return null;
  if (pathname === all_routes.dashboard) return 'dashboard:read';
  if (pathname === all_routes.reports) return 'reports:read';

  const resource = resourceForPath(pathname);
  if (!resource) return null;
  const action = pathname.includes('/add-') ? 'create' : pathname.includes('/edit-') ? 'update' : 'read';
  return `${resource}:${action}`;
};

export const permissionForRoute = (routeKey: RouteKey) => permissionForPath(all_routes[routeKey]);
