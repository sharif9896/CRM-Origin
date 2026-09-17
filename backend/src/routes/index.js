const express = require("express");
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureDefaultRoles } = require('../middleware/permissions');

const router = express.Router();
router.use('/workspace', require('./workspaceRoutes'));
router.use('/uploads', require('./uploadRoutes'));
router.use('/users', require('./buildCrudRouter')(require('../models/User'), { searchableFields: ['name', 'email'], writeRoles: ['admin'] }));
router.use('/roles', protect, authorize('admin'), asyncHandler(async (req, res, next) => {
  if (req.method === 'GET' && req.path === '/') await ensureDefaultRoles();
  next();
}), require('./buildCrudRouter')(require('../models/Role'), { searchableFields: ['name', 'description'], writeRoles: ['admin'] }));

router.use("/auth", require("./authRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use('/notification-deliveries', require('./notificationDeliveryRoutes'));
router.use('/chat', require('./chatRoutes'));

router.use("/leads", require("./leadRoutes"));
router.use("/properties", require("./propertyRoutes"));
router.use("/agents", require("./agentRoutes"));
router.use("/customers", require("./customerRoutes"));
router.use("/deals", require("./dealRoutes"));
router.use("/invoices", require("./invoiceRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/staff", require("./staffRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/taxonomies", require("./taxonomyRoutes"));
router.use("/tours", require("./tourRoutes"));
router.use("/transactions", require("./transactionRoutes"));
router.use("/reimbursements", require("./reimbursementRoutes"));
router.use("/reimbursement-types", require("./reimbursementTypeRoutes"));

module.exports = router;
