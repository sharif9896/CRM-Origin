const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const NotificationDelivery = require('../models/NotificationDelivery');
const { deliver } = require('../services/bookingNotificationService');

exports.list = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) {
    if (!['queued', 'sent', 'failed', 'skipped'].includes(req.query.status)) throw new ApiError('Invalid delivery status.', 400);
    query.status = req.query.status;
  }
  if (req.query.channel) {
    if (!['email', 'whatsapp'].includes(req.query.channel)) throw new ApiError('Invalid delivery channel.', 400);
    query.channel = req.query.channel;
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const [data, total, summaryRows] = await Promise.all([
    NotificationDelivery.find(query).sort('-createdAt').skip((page - 1) * limit).limit(limit).populate('appointment', 'title when client notificationStatus').populate('property', 'name location').populate('requestedBy', 'name email phone role'),
    NotificationDelivery.countDocuments(query),
    NotificationDelivery.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);
  const summary = Object.fromEntries(['queued', 'sent', 'failed', 'skipped'].map(status => [status, summaryRows.find(row => row._id === status)?.count || 0]));
  res.json({ success: true, data, total, page, pages: Math.max(1, Math.ceil(total / limit)), summary });
});

exports.retry = asyncHandler(async (req, res) => {
  const delivery = await NotificationDelivery.findById(req.params.id);
  if (!delivery) throw new ApiError('Notification delivery not found.', 404);
  delivery.status = 'queued';
  await delivery.save();
  await deliver(delivery);
  await delivery.populate('appointment', 'title when client notificationStatus');
  res.json({ success: true, data: delivery });
});
