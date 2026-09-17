const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    property: { type: String, default: "" },
    propertyRef: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    replied: { type: Boolean, default: false },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ author: "text", property: "text", comment: "text" });

module.exports = mongoose.model("Review", reviewSchema);
