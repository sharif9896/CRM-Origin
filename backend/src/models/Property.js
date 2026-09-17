const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    beds: { type: Number, min: 0, default: 0 },
    baths: { type: Number, min: 0, default: 0 },
    garage: { type: Number, min: 0, default: 0 },
    sqft: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["For Sale", "For Rent", "Sold", "Pending"],
      default: "For Sale",
    },
    availableFrom: { type: Date },
    amenities: [{ type: String }],
    agent: { type: String, default: "" },
    agentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    agentAvatar: { type: String, default: "" },
    ownerName: { type: String, trim: true, default: "" },
    ownerEmail: { type: String, trim: true, lowercase: true, default: "" },
    ownerWhatsapp: { type: String, trim: true, default: "" },
    ownerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

propertySchema.index({ name: "text", location: "text" });

module.exports = mongoose.model("Property", propertySchema);
