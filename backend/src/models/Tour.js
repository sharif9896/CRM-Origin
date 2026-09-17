const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    property: { type: String, required: true, trim: true },
    propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    location: { type: String, default: "" },
    image: { type: String, default: "" },
    duration: { type: String, default: "" },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

tourSchema.index({ property: "text", location: "text" });

module.exports = mongoose.model("Tour", tourSchema);
