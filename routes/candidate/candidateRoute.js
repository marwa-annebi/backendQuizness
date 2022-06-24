const express = require("express");
const { verifTokenCandidate } = require("../../utils/verifyToken");
const {
  getQuizByIdVoucher,
  getSkills,
  findAllQuiz,
  findQuizById,
} = require("../../controllers/candidate/candidateController");
const {
  correctAnswerController,
} = require("../../controllers/candidate/answerCandidate");
const { updateUserProfile } = require("../../controllers/auth/authController");
const {
  candidatePayment,
  webhook,
} = require("../../controllers/candidate/stripe");
const {
  getvoucher,
} = require("../../controllers/quizMaster/voucherController");
const getCertificate = require("../../controllers/candidate/certificate");
const router = express.Router();

router.route("/paymentCandidate").post(verifTokenCandidate, candidatePayment);
router.route("/getQuiz").post(verifTokenCandidate, getQuizByIdVoucher);
router.route("/correctAnswer").post(correctAnswerController);
router.route("/updateProfile").post(verifTokenCandidate, updateUserProfile);
router.route("/getSkills").get(verifTokenCandidate, getSkills);
router.route("/getQuizzes").get(verifTokenCandidate, findAllQuiz);
router
  .route("/getQuizById/:_id_voucher/:id")
  .get(verifTokenCandidate, findQuizById);
router.route("/webhook").post(
  // verifTokenCandidate,
  express.raw({ type: "application/json" }),
  webhook
);
router.route("/getvoucher").post(verifTokenCandidate, getvoucher);

// router.route("/getCertif").get(verifTokenCandidate, getCertificate);
module.exports = router;
