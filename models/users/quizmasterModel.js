const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Proposition = require("../propositionModel");
const Question = require("../questionModel");
const deleteProposition = require("../../controllers/quizMaster/propositionController");
const propositionModel = require("../propositionModel");
const { string, array } = require("joi");
const quizmasterSchema = mongoose.Schema(
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
    firstName: {
      type: String,
      //required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
      //  unique: true,
    },
    password: {
      type: String,
      //required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isTrialer: {
      type: Boolean,
      default: true,
    },
    account: {
      domain_name: String,
      logo: {
        type: String,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
      lightColor: String,
      darkColor: String,
      businessName: String,
    },
    stripeCustomerId: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    notifications: {
      type: Array,
      default: [],
    },
  },

  {
    timestamps: true,
  }
);
quizmasterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
quizmasterSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};
quizmasterSchema.methods.getResetPasswordToken = function () {
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

quizmasterSchema.pre("deleteOne", function (next) {
  const quizmasterId = this.getQuery()["_id"];
  // const questionId = this.getQuery()["_id"];

  mongoose
    .model("Quiz")
    .deleteMany({ quizmaster: quizmasterId }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success");
        next();
      }
    });
  mongoose
    .model("Skill")
    .deleteMany({ quizmaster: quizmasterId }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success");
        next();
      }
    });
  mongoose
    .model("Candidate")
    .update(
      {},
      { $pull: { quizmaster: quizmasterId } },
      function (err, result) {
        if (err) {
          console.log(`[error] ${err}`);
          next(err);
        } else {
          console.log("success");
          next();
        }
      }
    );
});

// Compile model from schema
const Quizmaster = mongoose.model("Quizmaster", quizmasterSchema);
module.exports = Quizmaster;
