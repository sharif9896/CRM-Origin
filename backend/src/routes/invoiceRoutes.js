const Invoice = require("../models/Invoice");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Invoice, {
  searchableFields: ["number", "client"],
});

module.exports = router;
