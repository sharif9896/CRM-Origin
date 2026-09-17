const Taxonomy = require("../models/Taxonomy");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Taxonomy, {
  searchableFields: ["name"],
});

module.exports = router;
