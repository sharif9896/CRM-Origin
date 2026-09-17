const mongoose = require('mongoose');
module.exports = mongoose.model('AuditLog', new mongoose.Schema({
  actor: String, action: String, resource: String, recordId: String, label: String,
}, { timestamps: true }));
