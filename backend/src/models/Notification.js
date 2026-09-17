const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    avatar: { type: String, default: "" },
    initials: { type: String, default: "" },
    icon: { type: String, default: "" },
    badgeClass: { type: String, default: "" },
    online: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
