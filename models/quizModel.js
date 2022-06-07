const mongoose = require("mongoose");
const quizSchema = mongoose.Schema(
  {
    quiz_id: {
      type: Number,
    },
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
      type: String,
    },
    quizName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
