const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  channel: { type: String, enum: ['internal', 'assistant'], required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  assistant: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });

chatMessageSchema.index({ channel: 1, sender: 1, recipient: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
