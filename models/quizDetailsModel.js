const mongoose = require("mongoose");
const quizDetailsSchema = mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
});
module.exports = QuizDetails = mongoose.model("QuizDetails",quizDetailsSchema)