const Agent = require("../models/Agent");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Agent, {
  searchableFields: ["name", "email", "phone"],
});

module.exports = router;
