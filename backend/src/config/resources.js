const names = {
  properties: 'Property', agents: 'Agent', customers: 'Customer', leads: 'Lead',
  deals: 'Deal', invoices: 'Invoice', payments: 'Payment', transactions: 'Transaction',
  reimbursements: 'Reimbursement', 'reimbursement-types': 'ReimbursementType',
  appointments: 'Appointment', staff: 'Staff', reviews: 'Review', taxonomies: 'Taxonomy', tours: 'Tour', roles: 'Role', users: 'User',
};
module.exports = Object.fromEntries(Object.entries(names).map(([key, name]) => [key, require(`../models/${name}`)]));
