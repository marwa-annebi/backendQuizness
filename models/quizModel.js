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
<<<<<<< HEAD
=======
    duration: {
      type: String,
    },
    quizName: {
      type: String,
    },
>>>>>>> cfca4135898952f1c41742f6aba62e36d30b917f
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
