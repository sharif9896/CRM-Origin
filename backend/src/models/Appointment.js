const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    when: { type: Date, required: true },
    duration: { type: String, default: "" },
    client: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    icon: { type: String, default: "" },
    agentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    requesterRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requesterEmail: { type: String, trim: true, lowercase: true, default: "" },
    requesterWhatsapp: { type: String, trim: true, default: "" },
    notificationStatus: {
      type: String,
      enum: ["queued", "sent", "partial", "failed", "skipped"],
      default: "skipped",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

appointmentSchema.index({ title: "text", client: "text" });

module.exports = mongoose.model("Appointment", appointmentSchema);
