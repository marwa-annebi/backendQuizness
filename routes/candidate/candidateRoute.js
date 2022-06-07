const express = require("express");
const {
  getQuizByIdVoucher,
  getSkills,
} = require("../../controllers/candidate/candidateController");
const {
  addAnswerController,
  correctAnswerController,
} = require("../../controllers/candidate/answerCandidate");
const {
  candidatePayment,
} = require("../../controllers/candidate/paymentController");
const { updateUserProfile } = require("../../controllers/auth/authController");
const { verifTokenCandidate } = require("../../utils/verifyToken");

const router = express.Router();
router.route("/paymentCandidate").post(candidatePayment);
router.route("/getQuiz").post(getQuizByIdVoucher);
router.route("/answerCandidate").post(addAnswerController);
router.route("/correctAnswer").post(correctAnswerController);
router.route("/updateProfile").post(verifTokenCandidate, updateUserProfile);
router.route("/getSkills").get(verifTokenCandidate, getSkills);
module.exports = router;
