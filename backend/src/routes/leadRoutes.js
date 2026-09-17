const Lead = require("../models/Lead");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Lead, {
  searchableFields: ["name", "email", "phone", "assignedTo"],
});

module.exports = router;
