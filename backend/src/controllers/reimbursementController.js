const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Reimbursement = require("../models/Reimbursement");
const WorkspaceSettings = require("../models/WorkspaceSettings");

exports.getSummary = asyncHandler(async (req, res) => {
  const filter = {};
  for (const key of ["kind", "category"]) {
    if (!req.query[key]) continue;
    const allowed = Reimbursement.schema.path(key).enumValues;
    if (!allowed.includes(req.query[key])) throw new ApiError(`Invalid reimbursement ${key}.`, 400);
    filter[key] = req.query[key];
  }

  const [statusRows, amountRows, settings] = await Promise.all([
    Reimbursement.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 }, amount: { $sum: "$amount" } } },
    ]),
    Reimbursement.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    WorkspaceSettings.findOne({ key: "organization" }).select("currency"),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((row) => [row._id, { count: row.count, amount: row.amount }]));
  const pendingStatuses = ["Submitted", "Under Review"];
  const pending = pendingStatuses.reduce((result, status) => ({
    count: result.count + (byStatus[status]?.count || 0),
    amount: result.amount + (byStatus[status]?.amount || 0),
  }), { count: 0, amount: 0 });

  res.json({
    success: true,
    data: {
      total: amountRows[0]?.count || 0,
      totalAmount: amountRows[0]?.total || 0,
      pending,
      approved: byStatus.Approved || { count: 0, amount: 0 },
      paid: byStatus.Paid || { count: 0, amount: 0 },
      rejected: byStatus.Rejected || { count: 0, amount: 0 },
      currency: settings?.currency || "USD",
    },
  });
});
