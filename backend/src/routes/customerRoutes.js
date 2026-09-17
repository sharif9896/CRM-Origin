const Customer = require("../models/Customer");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Customer, {
  searchableFields: ["name", "email", "phone"],
});

module.exports = router;
