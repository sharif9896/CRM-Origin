const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Audit = require("../models/AuditLog");
const RESERVED = ["page", "limit", "sort", "search", "fields"];
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cleanBody = (Model, input) => {
  const body = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ApiError('A record object is required.', 400);
  for (const [key, value] of Object.entries(input)) {
    if (['_id', 'id', '__v', 'createdAt', 'updatedAt'].includes(key)) continue;
    if (key.startsWith('$') || key.includes('.') || !Model.schema.path(key)) throw new ApiError('Unknown field: ' + key, 400);
  if (Model.modelName === 'User' && !['name', 'email', 'phone', 'role', 'active', 'password'].includes(key)) throw new ApiError('Field cannot be changed.', 400);
    if (Model.modelName === 'User' && key === 'password' && !value) continue;
    body[key] = value;
  }
  return body;
};
const audit = (req, Model, action, record) => Audit.create({ actor: req.user.email, resource: Model.modelName, action, recordId: String(record._id), label: record.name || record.title || record.reference || record.number || '' });
const validateRole = async (Model, body, existing) => {
  if (Model.modelName === 'User' && body.role) {
    const { defaults } = require('../middleware/permissions');
    if (!['admin', ...Object.keys(defaults)].includes(body.role) && !await require('../models/Role').exists({ name: body.role })) throw new ApiError('Unknown role.', 400);
  }
  for (const [key, path] of Object.entries(Model.schema.paths)) {
    if (path.options.ref && body[key] && !await require('mongoose').model(path.options.ref).exists({ _id: body[key] })) throw new ApiError('Selected ' + key + ' no longer exists.', 400);
  }
  if (Model.modelName !== 'Role') return;
  if (body.name === 'admin') throw new ApiError('The administrator role is built in and cannot be changed.', 400);
  const systemRoles = Object.keys(require('../middleware/permissions').defaults);
  if (existing && systemRoles.includes(existing.name) && body.name && body.name !== existing.name) throw new ApiError('Built-in roles cannot be renamed.', 409);
  if (existing && body.name && body.name !== existing.name && await require('../models/User').exists({ role: existing.name })) throw new ApiError('This role is assigned to users and cannot be renamed.', 409);
  const { available, noMenus } = require('../middleware/permissions');
  const valid = new Set([...available, noMenus]);
  if (body.permissions && body.permissions.some(p => !valid.has(p))) throw new ApiError('Unknown permission.', 400);
  if (body.permissions) {
    const hasMenu = body.permissions.some(permission => permission.startsWith('menu:') && permission !== noMenus);
    body.permissions = hasMenu ? body.permissions.filter(permission => permission !== noMenus) : [...new Set([...body.permissions, noMenus])];
  }
};
exports.getAll = (Model, searchableFields = []) => asyncHandler(async (req, res) => {
  const query = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (!RESERVED.includes(key) && value !== '') {
      if (!Model.schema.path(key) || typeof value !== 'string') throw new ApiError('Invalid filter: ' + key, 400);
      query[key] = value;
    }
  }
  if (req.query.search && searchableFields.length) {
    if (typeof req.query.search !== 'string' || req.query.search.length > 200) throw new ApiError('Search must be under 200 characters.', 400);
    query.$or = searchableFields.map(field => ({ [field]: { $regex: escapeRegex(req.query.search), $options: 'i' } }));
  }
  const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(Number(req.query.limit) || 20)));
  const sort = String(req.query.sort || '-createdAt').replace(/,/g, ' ');
  if (sort.split(/\s+/).some(key => !Model.schema.path(key.replace(/^-/, '')))) throw new ApiError('Invalid sort field.', 400);
  let find = Model.find(query).sort(sort).skip((page - 1) * limit).limit(limit);
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',');
    if (fields.some(key => !Model.schema.path(key) || Model.schema.path(key).options.select === false)) throw new ApiError('Invalid field selection.', 400);
    find = find.select(fields.join(' '));
  }
  const [data, total] = await Promise.all([find, Model.countDocuments(query)]);
  res.json({ success: true, count: data.length, total, page, pages: Math.max(1, Math.ceil(total / limit)), data });
});
exports.getOne = (Model, populate) => asyncHandler(async (req, res) => {
  let query = Model.findById(req.params.id); if (populate) query = query.populate(populate);
  const data = await query; if (!data) throw new ApiError('Record not found.', 404);
  res.json({ success: true, data });
});
exports.createOne = (Model, afterCreate) => asyncHandler(async (req, res) => {
  const body = cleanBody(Model, req.body); await validateRole(Model, body);
  const data = await Model.create(body); await audit(req, Model, 'create', data);
  if (afterCreate) await afterCreate(data, req);
  res.status(201).json({ success: true, data });
});
exports.updateOne = Model => asyncHandler(async (req, res) => {
  const data = await Model.findById(req.params.id); if (!data) throw new ApiError('Record not found.', 404);
  const body = cleanBody(Model, req.body); await validateRole(Model, body, data);
  if (Model.modelName === 'User' && data.id === req.user.id && (body.active === false || (body.role && body.role !== 'admin'))) throw new ApiError('You cannot remove your own administrator access.', 409);
  data.set(body); await data.save(); await audit(req, Model, 'update', data);
  res.json({ success: true, data });
});
async function deleteRecord(Model, id, req) {
  const data = await Model.findById(id); if (!data) throw new ApiError('Record not found.', 404);
  if (Model.modelName === 'User' && (data.id === req.user.id || data.role === 'admin')) throw new ApiError('Administrator accounts cannot be deleted here.', 409);
  if (Model.modelName === 'Role' && Object.keys(require('../middleware/permissions').defaults).includes(data.name)) throw new ApiError('Built-in roles can be edited but cannot be deleted.', 409);
  if (Model.modelName === 'Role' && await require('../models/User').exists({ role: data.name })) throw new ApiError('Reassign users before deleting this role.', 409);
  const models = require('../config/resources');
  for (const Other of Object.values(models)) {
    const refs = Object.entries(Other.schema.paths).filter(([, path]) => path.options.ref === Model.modelName).map(([key]) => ({ [key]: data._id }));
    if (refs.length && await Other.exists({ $or: refs })) throw new ApiError('This record is linked to ' + Other.modelName + ' records. Remove those links first.', 409);
  }
  await data.deleteOne(); await audit(req, Model, 'delete', data);
}
exports.deleteOne = Model => asyncHandler(async (req, res) => {
  await deleteRecord(Model, req.params.id, req); res.json({ success: true, data: {} });
});
exports.deleteMany = Model => asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.ids) || !req.body.ids.length || req.body.ids.length > 100) throw new ApiError('Provide 1 to 100 record IDs.', 400);
  const deleted = []; const failed = [];
  for (const id of req.body.ids) { try { await deleteRecord(Model, id, req); deleted.push(id); } catch (e) { failed.push({ id, message: e.message }); } }
  res.json({ success: true, deletedCount: deleted.length, deleted, failed });
});

