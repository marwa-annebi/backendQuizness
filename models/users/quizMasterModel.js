const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto =require ("crypto");
const quizMasterSchema = mongoose.Schema(
  {
    linkedinId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    microsoftId: {
      type: String,
    },
    unitNo: {
      type: Number,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {type:String},
    resetPasswordExpire: {type:Date},
  },
  {
    timestamps: true,
  }
);
quizMasterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
quizMasterSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};
quizMasterSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};
// Compile model from schema
const QuizMaster = mongoose.model("QuizMaster", quizMasterSchema);
module.exports = QuizMaster;
