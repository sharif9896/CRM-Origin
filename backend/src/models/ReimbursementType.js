const mongoose = require("mongoose");
const { categories } = require("./Reimbursement");

const reimbursementTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    kind: { type: String, enum: ["Allowance", "Expense"], required: true },
    category: { type: String, enum: categories, required: true },
    description: { type: String, default: "" },
    defaultLimit: { type: Number, min: 0, default: 0 },
    receiptRequired: { type: Boolean, default: true },
    taxable: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

reimbursementTypeSchema.index({ name: "text", code: "text", category: "text" });

module.exports = mongoose.model("ReimbursementType", reimbursementTypeSchema);
