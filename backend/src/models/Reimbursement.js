const mongoose = require("mongoose");

const reimbursementCategories = [
  "Daily Allowance",
  "Travel",
  "Mileage",
  "Food & Meals",
  "Accommodation",
  "Fuel",
  "Communication",
  "Medical",
  "Office Supplies",
  "Client Entertainment",
  "Training",
  "Housing",
  "Relocation",
  "Other",
];

const reimbursementSchema = new mongoose.Schema(
  {
    claimNumber: { type: String, unique: true, trim: true },
    employeeName: { type: String, required: true, trim: true },
    employeeEmail: { type: String, trim: true, lowercase: true, default: "" },
    kind: { type: String, enum: ["Allowance", "Expense"], required: true },
    category: { type: String, enum: reimbursementCategories, required: true },
    typeRef: { type: mongoose.Schema.Types.ObjectId, ref: "ReimbursementType" },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    expenseDate: { type: Date, required: true },
    submittedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Paid", "Cancelled"],
      default: "Draft",
    },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Payroll", "Cash", "Company Card", "Not Assigned"],
      default: "Not Assigned",
    },
    receiptNumber: { type: String, trim: true, default: "" },
    receiptUrl: { type: String, trim: true, default: "" },
    approvedBy: { type: String, trim: true, default: "" },
    paymentReference: { type: String, trim: true, default: "" },
    taxable: { type: Boolean, default: false },
    recurring: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

reimbursementSchema.pre("validate", function setClaimNumber(next) {
  if (!this.claimNumber) {
    const date = new Date();
    const stamp = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    this.claimNumber = `RMB-${stamp}-${new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase()}`;
  }
  next();
});

reimbursementSchema.index({ claimNumber: "text", employeeName: "text", employeeEmail: "text", description: "text", receiptNumber: "text" });
reimbursementSchema.index({ kind: 1, category: 1, status: 1, expenseDate: -1 });

module.exports = mongoose.model("Reimbursement", reimbursementSchema);
module.exports.categories = reimbursementCategories;
