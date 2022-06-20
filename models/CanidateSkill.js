const mongoose = require("mongoose");
const candidateSkillSchema = mongoose.Schema({
  _id_skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Candidate",
  },
  payment_status: { type: String },
  customerId: { type: String },
  _id_quizmaster: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Quizmaster",
  },
});

const CandidateSkill = mongoose.model("CandidateSkill", candidateSkillSchema);
module.exports = CandidateSkill;
