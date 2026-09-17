const Payment = require("../models/Payment");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Payment, {
  searchableFields: ["reference", "client", "invoice"],
});

module.exports = router;
