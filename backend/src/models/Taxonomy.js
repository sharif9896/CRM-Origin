const mongoose = require("mongoose");

const taxonomySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "" },
    badge: { type: String, default: "" },
    usedIn: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    // Distinguishes the two lists the frontend renders from this one
    // collection: Property Categories vs Amenities.
    kind: {
      type: String,
      enum: ["category", "amenity"],
      default: "category",
    },
  },
  { timestamps: true }
);

taxonomySchema.index({ name: "text" });

module.exports = mongoose.model("Taxonomy", taxonomySchema);
