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

skillSchema.pre("deleteOne", function (next) {
  const skillId = this.getQuery()["_id"];
  mongoose
    .model("Question")
    .deleteMany({ skill: skillId }, function (err, result) {
      if (err) {
        console.log(`[error] ${err}`);
        next(err);
      } else {
        console.log("success");
        next();
      }
    });
});
// Compile model from schema
const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
