const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, default: "" },
    department: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Pending"],
      default: "Active",
    },
    joinDate: { type: Date, default: Date.now },
    avatar: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

staffSchema.index({ name: "text", email: "text", department: "text" });

module.exports = mongoose.model("Staff", staffSchema);
