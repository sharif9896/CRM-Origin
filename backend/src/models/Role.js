const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[a-z][a-z0-9-]*$/ },
  description: { type: String, default: '' },
  permissions: [{ type: String }],
}, { timestamps: true });
module.exports = mongoose.model('Role', schema);
