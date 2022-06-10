const mongoose = require("mongoose");
const answerCandidatSchema = mongoose.Schema({
  voucher: {
    type: mongoose.Types.ObjectId,
    ref: "Candidate",
    // required: true,
  },

  reponses: [
    {
      proposition: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Proposition",
        checked:Boolean
      }
    },
  ],
});

module.exports = AnswerCandidat = mongoose.model(
  "answerCandidat",
  answerCandidatSchema
);
