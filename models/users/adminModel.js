const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const adminSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);
adminSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "unitNo" });
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
adminSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

// Compile model from schema
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
