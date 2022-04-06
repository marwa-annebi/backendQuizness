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
if (mongoose.models.userOtpVerification) {
  userOtpVerification = mongoose.model("userOtpVerification");
} else {
  userOtpVerification = mongoose.model("userOtpVerification", userOtpSchema);
}
module.exports = userOtpVerification;
