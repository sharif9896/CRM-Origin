const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    account: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ reference: "text", description: "text", account: "text" });

module.exports = mongoose.model("Transaction", transactionSchema);
