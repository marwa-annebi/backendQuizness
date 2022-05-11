const mongoose = require("mongoose");

var autoIncrement = require("mongoose-auto-increment-prefix");


const questionSchema = mongoose.Schema({
  _id_question: {
    type: Number,
    // default:0
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  typeQuestion: {
    type: String,
  },
  propositions: [
    {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
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
autoIncrement.initialize(mongoose.connection);
questionSchema.plugin(autoIncrement.plugin, {
  model: "Question",
  field: "_id_question",
  startAt: 1,
  incrementBy: 1,
  prefix: "Q",
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
