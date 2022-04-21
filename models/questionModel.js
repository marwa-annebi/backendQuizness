const mongoose = require("mongoose");
const questionSchema = mongoose.Schema({
  _id_question: {
    type: Number,
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
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
  duration: {
    type: Number,
    default: 0,
    required: true,
  },
  creation_date: {
    type: Date,
  },
});
questionSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "_id_question" });

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
