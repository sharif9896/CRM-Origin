const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const models = require('../config/resources');
const Settings = require('../models/WorkspaceSettings');
const Audit = require('../models/AuditLog');
const { getPermissions, defaults, available } = require('../middleware/permissions');

router.use(protect);
router.get('/access', asyncHandler(async (req, res) => res.json({ success: true, data: { role: req.user.role, permissions: await getPermissions(req.user.role), available, defaults } })));
router.get('/schema/:resource', asyncHandler(async (req, res) => {
  const model = models[req.params.resource];
  if (!model) throw new ApiError('Unknown resource', 404);
  const permissions = await getPermissions(req.user.role);
  if (!permissions.includes('*') && !permissions.some(permission => permission.startsWith(req.params.resource + ':'))) throw new ApiError('You do not have access to this module.', 403);
  const fields = [];
  model.schema.eachPath((key, path) => {
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
    if (req.params.resource === 'users' && !['name', 'email', 'phone', 'role', 'active', 'password'].includes(key)) return;
    const type = path.instance;
    fields.push({ key, type, required: !!path.isRequired, options: path.enumValues || [], ref: path.options.ref || null,
      min: typeof path.options.min === 'number' ? path.options.min : undefined,
      max: typeof path.options.max === 'number' ? path.options.max : undefined,
      default: typeof path.defaultValue === 'function' ? undefined : path.defaultValue,
      arrayOf: type === 'Array' ? path.caster?.instance || 'Object' : undefined });
  });
  if (req.params.resource === 'users') {
    if (req.user.role !== 'admin') throw new ApiError('Administrator access required.', 403);
    fields.find(f => f.key === 'role').options = [...new Set(['admin', ...Object.keys(defaults), ...(await models.roles.find().select('name')).map(r => r.name)])];
  }
  res.json({ success: true, data: fields });
}));
router.get('/settings', authorize('admin'), asyncHandler(async (req, res) => {
  const data = await Settings.findOne({ key: 'organization' });
  res.json({ success: true, data: data || new Settings() });
}));
router.get('/reports', asyncHandler(async (req, res) => {
  const permissions = await getPermissions(req.user.role);
  if (!permissions.includes('*') && !permissions.includes('reports:read')) throw new ApiError('You do not have permission to read reports.', 403);
  const year = Math.min(2100, Math.max(2000, Math.floor(Number(req.query.year) || new Date().getFullYear())));
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const [transactions, payments, invoices, settings] = await Promise.all([
    models.transactions.find({ date: { $gte: start, $lt: end }, status: 'Completed' }).select('date type amount'),
    models.payments.find({ date: { $gte: start, $lt: end }, status: 'Completed' }).select('amount'),
    models.invoices.find().select('status amount'),
    Settings.findOne({ key: 'organization' }).select('currency'),
  ]);
  const months = Array.from({ length: 12 }, (_, month) => ({ month: new Date(year, month).toLocaleString('en', { month: 'long' }), revenue: 0, expenses: 0, net: 0 }));
  for (const transaction of transactions) {
    const bucket = months[new Date(transaction.date).getUTCMonth()];
    if (transaction.type === 'Credit') bucket.revenue += transaction.amount;
    if (transaction.type === 'Debit') bucket.expenses += transaction.amount;
    bucket.net = bucket.revenue - bucket.expenses;
  }
  const invoiceStatuses = ['Paid', 'Pending', 'Overdue', 'Draft'].map(status => {
    const rows = invoices.filter(invoice => invoice.status === status);
    return { status, amount: rows.reduce((sum, invoice) => sum + invoice.amount, 0), count: rows.length };
  });
  res.json({ success: true, data: { year, currency: settings?.currency || 'USD', months, received: payments.reduce((sum, payment) => sum + payment.amount, 0), invoiceStatuses } });
}));
router.put('/settings', authorize('admin'), asyncHandler(async (req, res) => {
  const body = {};
  for (const key of ['companyName', 'timezone', 'currency', 'website', 'contactEmail', 'address']) if (req.body[key] !== undefined) body[key] = req.body[key];
  try { new Intl.DateTimeFormat('en', { timeZone: body.timezone || 'UTC' }); } catch { throw new ApiError('Enter a valid IANA timezone.', 400); }
  const data = await Settings.findOneAndUpdate({ key: 'organization' }, { $set: body }, { new: true, upsert: true, runValidators: true });
  await Audit.create({ actor: req.user.email, action: 'update', resource: 'settings', recordId: data.id, label: data.companyName });
  res.json({ success: true, data });
}));
router.get('/audit', authorize('admin'), asyncHandler(async (req, res) => {
  const data = await Audit.find().sort('-createdAt').limit(200);
  res.json({ success: true, data });
}));
module.exports = router;
