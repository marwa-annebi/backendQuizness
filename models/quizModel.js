const mongoose = require("mongoose");
const quizSchema = mongoose.Schema(
  {
    quizmaster: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quizmaster",
    },
    validation_date: {
      type: Date,
    },
    creation_date: {
      type: Date,
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    nbQuestion: Number,
    duration: {
      type: Number,
    },
    quizName: {
      type: String,
    },
    typeQuiz: {
      type: String,
    },
    Tauxscore: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
