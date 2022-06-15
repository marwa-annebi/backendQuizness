const express = require("express");

const { verifTokenCandidate } = require("../../utils/verifyToken");
const { verifTokenQuizmaster } = require("./../../utils/verifyToken");

const {
  addAnswerController,
  correctAnswerController,
} = require("../../controllers/candidate/answerCandidate");
const {
  candidatePayment,
} = require("../../controllers/candidate/paymentController");
const router = express.Router();

const {
  getQuizByIdVoucher,
  getSkills,
} = require("../../controllers/candidate/candidateController");

const { updateUserProfile } = require("../../controllers/auth/authController");
// const { verifTokenCandidate } = require("../../utils/verifyToken");
router.route("/paymentCandidate").post(candidatePayment);
router.route("/getQuiz").post(getQuizByIdVoucher);
router.route("/answerCandidate").post(addAnswerController);
router.route("/correctAnswer").post(correctAnswerController);
router.route("/updateProfile").post(verifTokenCandidate, updateUserProfile);
router.route("/getSkills").get(verifTokenCandidate, getSkills);

module.exports = router;
