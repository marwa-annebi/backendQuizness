const mongoose = require("mongoose");
const skillSchema = mongoose.Schema({
  quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Quizmaster",
  },
  skill_name: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  requirements: {
    type: String,
  },
});

// Compile model from schema
const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
