const mongoose = require("mongoose");
const answerCandidatSchema = mongoose.Schema({
  voucher: {
    type: mongoose.Types.ObjectId,
    ref: "Voucher",
    required: true,
  },
  proposition: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Proposition",
  },
  response: {
    type: Boolean,
    required: true,
  },
});

module.exports = AnswerCandidat = mongoose.model(
  "answerCandidat",
  answerCandidatSchema
);
