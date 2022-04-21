const mongoose = require("mongoose");
const quizSchema = mongoose.Schema({
  quiz_id : {
    type:Number,    
  },
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  validation_date: {
    type: Date,
  },
  creation_date: {
    type: Date,
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});
adminSchema.plugin(AutoIncrement, { id: "order_seq",inc_field: "quiz_id" });

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
