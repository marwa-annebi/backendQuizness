const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "QuizMaster",
  },
  category_name: {
    type: String,
    required: true,
  },
  isTrailer:{
      type:Boolean,
      //default:true
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

// Compile model from schema
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;