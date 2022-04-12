const mongoose = require("mongoose");
const voucherSchema = mongoose.Schema({
  _id_voucher: {
    type: Number,
  },
  candidat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Candidat",
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
  },
  validation_date: {
    type: Date,
  },
  remark: {
    type: String,
  },
});

module.exports = Voucher = mongoose.model("Voucher", voucherSchema);
