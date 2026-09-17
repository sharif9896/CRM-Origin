const Tour = require("../models/Tour");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Tour, {
  searchableFields: ["property", "location"],
});

module.exports = router;
