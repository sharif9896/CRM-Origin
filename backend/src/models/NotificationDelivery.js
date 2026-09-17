const mongoose = require('mongoose');

const notificationDeliverySchema = new mongoose.Schema({
  event: { type: String, enum: ['visit-booked'], required: true, default: 'visit-booked' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipientType: { type: String, enum: ['owner', 'agent'], required: true },
  recipientName: { type: String, default: '' },
  channel: { type: String, enum: ['email', 'whatsapp'], required: true, index: true },
  destination: { type: String, default: '' },
  subject: { type: String, default: '' },
  body: { type: String, required: true },
  status: { type: String, enum: ['queued', 'sent', 'failed', 'skipped'], default: 'queued', index: true },
  attempts: { type: Number, default: 0 },
  providerMessageId: { type: String, default: '' },
  error: { type: String, default: '' },
  lastAttemptAt: { type: Date, default: null },
}, { timestamps: true });

notificationDeliverySchema.index({ createdAt: -1, status: 1 });

module.exports = mongoose.model('NotificationDelivery', notificationDeliverySchema);
