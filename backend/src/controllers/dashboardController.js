const asyncHandler = require("../middleware/asyncHandler");
const Lead = require("../models/Lead");
const Property = require("../models/Property");
const Agent = require("../models/Agent");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const WorkspaceSettings = require("../models/WorkspaceSettings");

const dashboardYear = (value) => {
  const requested = Number(value);
  return Number.isInteger(requested) && requested >= 2000 && requested <= 2100
    ? requested
    : new Date().getFullYear();
};

// GET /api/v1/dashboard/summary
// High-level counters + KPI cards for the dashboard header
exports.getSummary = asyncHandler(async (req, res) => {
  const [
    totalLeads,
    totalProperties,
    totalAgents,
    totalCustomers,
    totalDeals,
    wonDeals,
    revenueAgg,
    paidInvoicesAgg,
    upcomingAppointments,
    avgRatingAgg,
    activeAgents,
    hotLeads,
    openDeals,
    portfolioValueAgg,
    outstandingRevenueAgg,
    settings,
  ] = await Promise.all([
    Lead.countDocuments(),
    Property.countDocuments(),
    Agent.countDocuments(),
    Customer.countDocuments(),
    Deal.countDocuments(),
    Deal.countDocuments({ stage: "Won" }),
    Deal.aggregate([{ $match: { stage: "Won" } }, { $group: { _id: null, total: { $sum: "$value" } } }]),
    Invoice.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Appointment.countDocuments({ when: { $gte: new Date() }, status: { $in: ["Confirmed", "Pending"] } }),
    Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    Agent.countDocuments({ status: "Active" }),
    Lead.countDocuments({ status: "Hot" }),
    Deal.countDocuments({ stage: { $ne: "Won" } }),
    Property.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
    Invoice.aggregate([
      { $match: { status: { $in: ["Pending", "Overdue"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    WorkspaceSettings.findOne({ key: "organization" }).select("currency"),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalLeads,
      totalProperties,
      totalAgents,
      totalCustomers,
      totalDeals,
      wonDeals,
      wonRevenue: revenueAgg[0]?.total || 0,
      paidInvoiceRevenue: paidInvoicesAgg[0]?.total || 0,
      upcomingAppointments,
      averageRating: Number((avgRatingAgg[0]?.avg || 0).toFixed(2)),
      activeAgents,
      hotLeads,
      openDeals,
      portfolioValue: portfolioValueAgg[0]?.total || 0,
      outstandingRevenue: outstandingRevenueAgg[0]?.total || 0,
      conversionRate: totalDeals ? Number(((wonDeals / totalDeals) * 100).toFixed(1)) : 0,
      currency: settings?.currency || "USD",
    },
  });
});

// GET /api/v1/dashboard/revenue-overview?year=2026
// Monthly rentals vs sales revenue, derived from Deals grouped by month
exports.getRevenueOverview = asyncHandler(async (req, res) => {
  const year = dashboardYear(req.query.year);
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  const results = await Deal.aggregate([
    { $match: { closeDate: { $gte: start, $lt: end }, stage: "Won" } },
    {
      $group: {
        _id: { month: { $month: "$closeDate" } },
        total: { $sum: "$value" },
      },
    },
  ]);

  const monthly = Array(12).fill(0);
  results.forEach((r) => {
    monthly[r._id.month - 1] = r.total;
  });

  res.status(200).json({ success: true, data: { year, revenue: monthly } });
});

// GET /api/v1/dashboard/activity-overview?year=2026
// New leads and scheduled property visits by month for the operating trend chart
exports.getActivityOverview = asyncHandler(async (req, res) => {
  const year = dashboardYear(req.query.year);
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  const [leadResults, appointmentResults] = await Promise.all([
    Lead.aggregate([
      { $match: { createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    Appointment.aggregate([
      { $match: { when: { $gte: start, $lt: end } } },
      { $group: { _id: { month: { $month: "$when" } }, count: { $sum: 1 } } },
    ]),
  ]);

  const leads = Array(12).fill(0);
  const appointments = Array(12).fill(0);
  leadResults.forEach((result) => {
    leads[result._id.month - 1] = result.count;
  });
  appointmentResults.forEach((result) => {
    appointments[result._id.month - 1] = result.count;
  });

  res.status(200).json({ success: true, data: { year, leads, appointments } });
});

// GET /api/v1/dashboard/property-status
// Distribution of properties by status, for the donut/pie chart
exports.getPropertyStatusChart = asyncHandler(async (req, res) => {
  const results = await Property.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  res.status(200).json({ success: true, data: results });
});

// GET /api/v1/dashboard/property-categories
// Property counts grouped by type, for the bar chart
exports.getPropertyCategoriesChart = asyncHandler(async (req, res) => {
  const results = await Property.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);
  res.status(200).json({ success: true, data: results });
});

// GET /api/v1/dashboard/sales-pipeline
// Deal counts + total value grouped by stage
exports.getSalesPipeline = asyncHandler(async (req, res) => {
  const results = await Deal.aggregate([
    { $group: { _id: "$stage", count: { $sum: 1 }, amount: { $sum: "$value" } } },
  ]);
  res.status(200).json({ success: true, data: results });
});

// GET /api/v1/dashboard/featured-listings?limit=5
// Most recently added properties for the "featured listings" widget
exports.getFeaturedListings = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20);
  const listings = await Property.find().sort("-createdAt").limit(limit);
  res.status(200).json({ success: true, data: listings });
});

// GET /api/v1/dashboard/recent-activity?limit=10
// A merged, time-sorted feed of the most recent leads, deals and appointments
exports.getRecentActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const [leads, deals, appointments] = await Promise.all([
    Lead.find().sort("-createdAt").limit(limit).select("name status createdAt"),
    Deal.find().sort("-createdAt").limit(limit).select("title stage createdAt"),
    Appointment.find().sort("-createdAt").limit(limit).select("title status when createdAt"),
  ]);

  const activity = [
    ...leads.map((l) => ({ type: "lead", label: `New lead: ${l.name}`, status: l.status, at: l.createdAt })),
    ...deals.map((d) => ({ type: "deal", label: `Deal: ${d.title}`, status: d.stage, at: d.createdAt })),
    ...appointments.map((a) => ({
      type: "appointment",
      label: `Appointment: ${a.title}`,
      status: a.status,
      at: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit);

  res.status(200).json({ success: true, data: activity });
});
