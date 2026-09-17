const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Warm", "Hot", "Converted"],
      default: "New",
    },
    budget: { type: String, default: "" },
    budgetMin: { type: Number, min: 0 },
    budgetMax: { type: Number, min: 0 },
    source: { type: String, default: "Website" },
    propertyType: { type: String, default: "" },
    assignedTo: { type: String, default: "" },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    avatar: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text", phone: "text" });

module.exports = mongoose.model("Lead", leadSchema);
