const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const questionSchema = mongoose.Schema({
  _id_question: {
    type: Number,
    // default:0
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "QuizMaster",
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

questionSchema.plugin(AutoIncrement, {
  id: "order_seq",
  inc_field: "_id_question",
});
questionSchema.pre('deleteOne', function (next) {
  const questionId = this.getQuery()["_id"];
  mongoose.model("Proposition").deleteMany({'question': questionId}, function (err, result) {
    if (err) {
      console.log(`[error] ${err}`);
      next(err);
    } else {
      console.log('success');
      next();
    }
  });
});

questionSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "_id_question" });
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
// questionSchema.plugin(autoIncrement.plugin,{model : "Question", field: '_id_question' ,startAt: 001,
// incrementBy: 001});
