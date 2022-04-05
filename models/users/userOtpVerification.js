const mongoose = require("mongoose");

const userOtpSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
});
const UserOtpVerification = mongoose.model(
  "UserOtpVerification",
  userOtpSchema
);
module.exports = UserOtpVerification;
