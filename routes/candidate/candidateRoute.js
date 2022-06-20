const express = require("express");

const { verifTokenCandidate } = require("../../utils/verifyToken");
const {
  getQuizByIdVoucher,
  getSkills,
  findAllQuiz,
  findQuizById,
} = require("../../controllers/candidate/candidateController");

const {
  addAnswerController,
  correctAnswerController,
} = require("../../controllers/candidate/answerCandidate");

// const {

//   getSkills,
// } = require("../../controllers/candidate/candidateController");

const { updateUserProfile } = require("../../controllers/auth/authController");

const {
  candidatePayment,
  webhook,
} = require("../../controllers/candidate/stripe");
const {
  getvoucher,
} = require("../../controllers/quizMaster/voucherController");

const router = express.Router();
router.route("/paymentCandidate").post(verifTokenCandidate, candidatePayment);
router.route("/getQuiz").post(verifTokenCandidate, getQuizByIdVoucher);
router.route("/answerCandidate").post(verifTokenCandidate, addAnswerController);
router.route("/correctAnswer").post(correctAnswerController);
router.route("/updateProfile").post(verifTokenCandidate, updateUserProfile);
router.route("/getSkills").get(verifTokenCandidate, getSkills);

router.route("/getQuizzes").get(verifTokenCandidate, findAllQuiz);
router.route("/getQuizById/:id").get(verifTokenCandidate, findQuizById);
router.route("/webhook").post(
  // verifTokenCandidate,
  express.raw({ type: "application/json" }),
  webhook
);
router.route("/getvoucher").post(verifTokenCandidate, getvoucher);

module.exports = router;
