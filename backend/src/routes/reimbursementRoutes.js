const express = require("express");
const Reimbursement = require("../models/Reimbursement");
const buildCrudRouter = require("./buildCrudRouter");
const { protect } = require("../middleware/auth");
const { permit } = require("../middleware/permissions");
const { getSummary } = require("../controllers/reimbursementController");

const router = express.Router();

router.get("/summary", protect, permit("reimbursements", "read"), getSummary);
router.use(buildCrudRouter(Reimbursement, {
  searchableFields: ["claimNumber", "employeeName", "employeeEmail", "description", "receiptNumber", "paymentReference"],
}));

module.exports = router;
