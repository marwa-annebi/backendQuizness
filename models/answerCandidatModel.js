const mongoose = require("mongoose");
const answerCandidatSchema = mongoose.Schema({
  voucher: {
    type: mongoose.Types.ObjectId,
    ref: "Voucher",
    // required: true,
  },

  array: [
    {
      _id_Question: {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
      answers: [
        {
          _id_proposition: {
            type: mongoose.Types.ObjectId,
            ref: "Proposition",
          },
          response: false,
        },
      ],
    },
  ],
});

module.exports = AnswerCandidat = mongoose.model(
  "answerCandidat",
  answerCandidatSchema
);
