const mongoose = require("mongoose");
const answerCandidatSchema = mongoose.Schema({
  voucher: {
    type: mongoose.Types.ObjectId,
    ref: "Voucher",
    // required: true,
  },

  answers: [
    {
      _id_proposition: {
        type: mongoose.Types.ObjectId,
        ref: "Proposition",
      },
      response: {
        type: Boolean,
      },
    },
  ],
});

module.exports = AnswerCandidat = mongoose.model(
  "answerCandidat",
  answerCandidatSchema
);
