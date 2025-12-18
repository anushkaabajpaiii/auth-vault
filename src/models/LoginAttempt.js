const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    ip: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt = time of attempt
  }
);

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
