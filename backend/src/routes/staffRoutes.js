const Staff = require("../models/Staff");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Staff, {
  searchableFields: ["name", "email", "department"],
});

module.exports = router;
