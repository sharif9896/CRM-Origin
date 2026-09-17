const Transaction = require("../models/Transaction");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Transaction, {
  searchableFields: ["reference", "description", "account"],
});

module.exports = router;
