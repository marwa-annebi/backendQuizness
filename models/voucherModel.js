const mongoose = require("mongoose");
const voucherSchema = mongoose.Schema({
  _id_voucher: {
    type: String,
    required: true,
  },
  candidat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Candidate",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Quiz",
  },
  score: {
    type: Number,
  },
  creation_date: {
    type: Date,
    required: true,
  },
  validation_date: {
    type: Date,
    required: true,
  },

  remark: {
    type: String,
  },
});

module.exports = Voucher = mongoose.model("Voucher", voucherSchema);
