const Property = require("../models/Property");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Property, {
  searchableFields: ["name", "location", "agent"],
});

module.exports = router;
