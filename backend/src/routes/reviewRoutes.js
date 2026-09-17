const Review = require("../models/Review");
const buildCrudRouter = require("./buildCrudRouter");

// Full CRUD (list/search/paginate, get one, create, update, delete, bulk-delete)
const router = buildCrudRouter(Review, {
  searchableFields: ["author", "property", "comment"],
});

module.exports = router;
