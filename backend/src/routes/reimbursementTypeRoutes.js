const ReimbursementType = require("../models/ReimbursementType");
const buildCrudRouter = require("./buildCrudRouter");

module.exports = buildCrudRouter(ReimbursementType, {
  searchableFields: ["name", "code", "category", "description"],
});
