const mongoose = require("mongoose");

var autoIncrement = require("mongoose-auto-increment-prefix");

const questionSchema = mongoose.Schema({
  _id_question: {
    type: String,
    // unique: false,
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Quizmaster",
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Skill",
  },
  typeQuestion: {
    type: String,
  },
  propositions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Proposition",
    },
  ],
  tronc: {
    type: String,
    minlength: 10,
    maxlength: 100000,
    required: true,
  },
  mark: {
    type: Number,
    default: 1,
    required: true,
  },

  creation_date: {
    type: Date,
  },
});

questionSchema.pre("deleteOne", function (next) {
  const questionId = this.getQuery()["_id"];
  mongoose
    .model("Proposition")
    .deleteMany({ question: questionId }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success");
        next();
      }
    });
  mongoose
    .model("Quiz")
    .update({}, { $pull: { questions: questionId } }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success");
        next();
      }
    });
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
