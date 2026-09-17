const asyncHandler = require('./asyncHandler');
const ApiError = require('../utils/ApiError');
const Role = require('../models/Role');
const resources = ['properties', 'agents', 'customers', 'leads', 'deals', 'invoices', 'payments', 'transactions', 'reimbursements', 'reimbursement-types', 'appointments', 'staff', 'reviews', 'taxonomies', 'tours'];
const actions = ['read', 'create', 'update', 'delete'];
const operational = ['dashboard:read', 'reports:read', ...resources.flatMap(r => actions.map(a => r + ':' + a))];
const menuRequirements = {
  dashboard: 'dashboard:read',
  properties: 'properties:read', addProperty: 'properties:create', editProperty: 'properties:update', propertyGrid: 'properties:read', propertyList: 'properties:read', propertyMap: 'properties:read', propertyDetails: 'properties:read',
  categories: 'taxonomies:read', amenities: 'taxonomies:read', manualTour: 'tours:read',
  agents: 'agents:read', addAgent: 'agents:create', editAgent: 'agents:update', agentDetails: 'agents:read',
  customers: 'customers:read', addCustomer: 'customers:create', editCustomer: 'customers:update', customerDetails: 'customers:read',
  leads: 'leads:read', addLead: 'leads:create', editLead: 'leads:update', leadDetails: 'leads:read',
  deals: 'deals:read', dealDetails: 'deals:read', appointments: 'appointments:read', reviews: 'reviews:read',
  invoices: 'invoices:read', addInvoice: 'invoices:create', editInvoice: 'invoices:update', invoiceDetails: 'invoices:read',
  payments: 'payments:read', transactions: 'transactions:read', reports: 'reports:read',
  reimbursements: 'reimbursements:read', reimbursementAllowances: 'reimbursements:read', reimbursementExpenses: 'reimbursements:read', reimbursementTravel: 'reimbursements:read', reimbursementMeals: 'reimbursements:read', reimbursementTypes: 'reimbursement-types:read',
  staff: 'staff:read', addStaff: 'staff:create', editStaff: 'staff:update', profile: null,
};
const menuPermissions = Object.keys(menuRequirements).map(key => `menu:${key}`);
const available = [...menuPermissions, ...operational];
const noMenus = 'menu:none';
const permissionsFor = (selectedResources, selectedActions = actions) => selectedResources.flatMap(resource => selectedActions.map(action => `${resource}:${action}`));
const operationalDefaults = {
  manager: [...operational],
  'senior-agent': [
    'dashboard:read', 'reports:read',
    ...permissionsFor(['properties', 'agents', 'customers', 'leads', 'deals', 'appointments', 'reviews', 'tours'], ['read', 'create', 'update']),
    ...permissionsFor(['invoices', 'payments', 'transactions', 'reimbursements', 'reimbursement-types'], ['read']),
  ],
  agent: [
    'dashboard:read',
    ...permissionsFor(['properties', 'agents', 'reviews'], ['read']),
    ...permissionsFor(['customers', 'leads', 'deals', 'appointments', 'tours'], ['read', 'create', 'update']),
    ...permissionsFor(['invoices', 'payments'], ['read']),
  ],
  viewer: ['dashboard:read', 'reports:read', ...permissionsFor(resources.filter(resource => !['reimbursements', 'reimbursement-types'].includes(resource)), ['read']), 'appointments:create'],
  customer: [
    ...permissionsFor(['properties', 'agents'], ['read']),
    ...permissionsFor(['appointments', 'tours', 'reviews'], ['read', 'create', 'update']),
  ],
  staff: ['dashboard:read', ...permissionsFor(resources, ['read'])],
};
const menusFor = permissions => Object.entries(menuRequirements).filter(([, requirement]) => requirement === null || permissions.includes(requirement)).map(([key]) => `menu:${key}`);
const withMenus = permissions => [...new Set([...permissions, ...menusFor(permissions)])];
const defaults = Object.fromEntries(Object.entries(operationalDefaults).map(([name, permissions]) => [name, withMenus(permissions)]));
const descriptions = {
  manager: 'Operational access to every business module. Administration remains restricted to administrators.',
  'senior-agent': 'Manage the sales pipeline and customer activity, with read access to finance.',
  agent: 'Work with sales activities and view relevant property and finance records.',
  viewer: 'View business modules and reports, with permission to request property visits.',
  customer: 'View properties and manage appointment, tour, and review activity.',
  staff: 'Read-only internal workspace access.',
};
const ensureDefaultRoles = async () => {
  await Promise.all(Object.entries(defaults).map(([name, permissions]) => Role.updateOne(
    { name },
    { $setOnInsert: { name, description: descriptions[name], permissions } },
    { upsert: true },
  )));
  const roles = await Role.find();
  await Promise.all(roles.filter(role => !role.permissions.some(permission => permission.startsWith('menu:'))).map(role => Role.updateOne(
    { _id: role._id },
    { $addToSet: { permissions: { $each: menusFor(role.permissions) } } },
  )));
};
const getPermissions = async role => {
  if (role === 'admin') return ['*'];
  const record = await Role.findOne({ name: role });
  if (!record) return defaults[role] || [];
  if (record.permissions.includes(noMenus)) return record.permissions.filter(permission => permission !== noMenus);
  return record.permissions.some(permission => permission.startsWith('menu:')) ? record.permissions : withMenus(record.permissions);
};
const permit = (resource, action) => asyncHandler(async (req, res, next) => {
  const permissions = await getPermissions(req.user.role);
  if (!permissions.includes('*') && !permissions.includes(`${resource}:${action}`)) throw new ApiError(`You do not have permission to ${action} ${resource}.`, 403);
  next();
});
module.exports = { permit, getPermissions, ensureDefaultRoles, defaults, resources, actions, available, menuRequirements, noMenus };
