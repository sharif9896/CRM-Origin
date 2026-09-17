const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    invoice: { type: String, default: "" },
    invoiceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    client: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["Bank Transfer", "Credit Card", "PayPal", "Check"],
      default: "Bank Transfer",
    },
    amount: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

paymentSchema.index({ reference: "text", client: "text" });

module.exports = mongoose.model("Payment", paymentSchema);
