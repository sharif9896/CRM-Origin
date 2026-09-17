const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rank: { type: String, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, default: "Agent" },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Away"],
      default: "Active",
    },
    listings: { type: Number, min: 0, default: 0 },
    deals: { type: Number, min: 0, default: 0 },
    revenue: { type: Number, min: 0, default: 0 },
    rating: { type: Number, min: 0, default: 0, min: 0, max: 5 },
    avatar: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

agentSchema.index({ name: "text", email: "text" });

module.exports = mongoose.model("Agent", agentSchema);
