const mongoose = require('mongoose');
module.exports = mongoose.model('WorkspaceSettings', new mongoose.Schema({
  key: { type: String, default: 'organization', unique: true },
  companyName: { type: String, required: true, trim: true, default: 'Realestate CRM' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  currency: { type: String, enum: ['USD', 'INR', 'EUR', 'GBP', 'CAD'], default: 'USD' },
  website: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true }));
