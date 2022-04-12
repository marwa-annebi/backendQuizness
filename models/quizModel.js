const mongoose = require("mongoose");
const quizSchema = mongoose.Schema({
  quiz_id: {
    type: Number,
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "QuizMaster",
  },
  validation_date: {
    type: Date,
  },
  creation_date: {
    type: Date,
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
