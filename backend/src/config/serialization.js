const mongoose = require('mongoose');

mongoose.set('toJSON', {
  virtuals: true,
  transform: (_doc, value) => {
    if (value._id) value.id = String(value._id);
    delete value.__v;
    delete value.password;
    delete value.passwordResetToken;
    delete value.passwordResetExpires;
    delete value.emailVerifyToken;
    delete value.emailVerifyExpires;
    return value;
  },
});
