const express = require("express");
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  deleteMany,
} = require("../controllers/factory");
const { protect, authorize } = require("../middleware/auth");
const { permit } = require('../middleware/permissions');

/**
 * Builds a full REST router for a Mongoose model:
 *   GET    /            -> list (search, filter, sort, paginate)
 *   POST   /            -> create
 *   DELETE /            -> bulk delete ({ ids: [...] } in body)
 *   GET    /:id         -> read one
 *   PUT    /:id         -> update one
 *   DELETE /:id         -> delete one
 *
 * @param {import('mongoose').Model} Model
 * @param {object} options
 * @param {string[]} options.searchableFields - fields used for ?search= free text queries
 * @param {string|string[]} options.populate - field(s) to populate on getOne
 * @param {string[]} options.writeRoles - roles allowed to create/update/delete (default: any authenticated user)
 */
function buildCrudRouter(Model, options = {}) {
  const { searchableFields = [], populate, writeRoles, beforeCreate, afterCreate } = options;
  const router = express.Router();
  const resource = Object.entries(require('../config/resources')).find(([, model]) => model === Model)?.[0];
  if (resource) router.use(protect, (req, res, next) => permit(resource, req.method === 'GET' ? 'read' : req.method === 'POST' ? 'create' : req.method === 'DELETE' ? 'delete' : 'update')(req, res, next));

  const writeGuard = writeRoles && writeRoles.length ? [protect, authorize(...writeRoles)] : [protect];

  router
    .route("/")
    .get(protect, getAll(Model, searchableFields))
    .post(writeGuard, ...(beforeCreate ? [beforeCreate] : []), createOne(Model, afterCreate))
    .delete(writeGuard, deleteMany(Model));

  router
    .route("/:id")
    .get(protect, getOne(Model, populate))
    .put(writeGuard, updateOne(Model))
    .patch(writeGuard, updateOne(Model))
    .delete(writeGuard, deleteOne(Model));

  return router;
}

module.exports = buildCrudRouter;
