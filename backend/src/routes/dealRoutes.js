const Deal = require("../models/Deal");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Deal, {
  searchableFields: ["title", "customer", "agent"],
});

module.exports = router;
