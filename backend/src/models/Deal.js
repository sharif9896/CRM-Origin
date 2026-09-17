const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0, default: 0 },
    price: { type: String, default: "" },
    stage: {
      type: String,
      enum: ["New", "Negotiation", "Due Diligence", "Won"],
      default: "New",
    },
    agent: { type: String, default: "" },
    avatar: { type: String, default: "" },
    customer: { type: String, default: "" },
    customerRef: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    closeDate: { type: Date },
  },
  { timestamps: true }
);

dealSchema.index({ title: "text", customer: "text" });

module.exports = mongoose.model("Deal", dealSchema);
