const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Notification = require("../models/Notification");

// GET /api/v1/notifications  (current user's notifications, newest first)
exports.getMyNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const query = { user: req.user.id };
  if (unreadOnly === "true") query.read = false;

  const [items, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort("-createdAt")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Notification.countDocuments(query),
    Notification.countDocuments({ user: req.user.id, read: false }),
  ]);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    unreadCount,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    data: items,
  });
});

// POST /api/v1/notifications  (create a notification, e.g. from another service/admin)
exports.createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json({ success: true, data: notification });
});

// PUT /api/v1/notifications/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );
  if (!notification) throw new ApiError("Notification not found", 404);
  res.status(200).json({ success: true, data: notification });
});

// PUT /api/v1/notifications/read-all
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});

// DELETE /api/v1/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!notification) throw new ApiError("Notification not found", 404);
  res.status(200).json({ success: true, data: {} });
});
