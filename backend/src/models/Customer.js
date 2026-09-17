const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    interestedIn: { type: String, default: "" },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["New", "Warm", "Hot", "Converted"],
      default: "New",
    },
    joined: { type: Date, default: Date.now },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

customerSchema.index({ name: "text", email: "text", phone: "text" });

module.exports = mongoose.model("Customer", customerSchema);
