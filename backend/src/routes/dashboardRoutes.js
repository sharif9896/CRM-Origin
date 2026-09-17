const express = require("express");
const {
  getSummary,
  getRevenueOverview,
  getActivityOverview,
  getPropertyStatusChart,
  getPropertyCategoriesChart,
  getSalesPipeline,
  getFeaturedListings,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect, require('../middleware/permissions').permit('dashboard', 'read'));

router.get("/summary", getSummary);
router.get("/revenue-overview", getRevenueOverview);
router.get("/activity-overview", getActivityOverview);
router.get("/property-status", getPropertyStatusChart);
router.get("/property-categories", getPropertyCategoriesChart);
router.get("/sales-pipeline", getSalesPipeline);
router.get("/featured-listings", getFeaturedListings);
router.get("/recent-activity", getRecentActivity);

module.exports = router;
