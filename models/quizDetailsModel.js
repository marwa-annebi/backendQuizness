const mongoose = require("mongoose");
const quizDetailsSchema = mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
});
module.exports = QuizDetails = mongoose.model("QuizDetails",quizDetailsSchema)