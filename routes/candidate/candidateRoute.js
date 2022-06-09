const express = require("express");
<<<<<<< HEAD
const { verifTokenCandidate } = require("../../utils/verifyToken")
const { verifTokenQuizmaster } = require("./../../utils/verifyToken");
const getQuizByIdVoucher = require("../../controllers/candidate/candidateController");
const {addAnswerController ,correctAnswerController}=require("../../controllers/candidate/answerCandidate");
const {candidatePayment }=require("../../controllers/candidate/paymentController")

const router = express.Router();
router.route("/paymentCandidate").post(verifTokenCandidate,candidatePayment);
router.route("/getQuiz").post(verifTokenCandidate,getQuizByIdVoucher);
router.route("/answerCandidate").post(verifTokenCandidate,addAnswerController);
router.route("/correctAnswer").post(verifTokenCandidate,correctAnswerController);

=======
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
>>>>>>> cfca4135898952f1c41742f6aba62e36d30b917f
module.exports = router;
