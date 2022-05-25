const express = require("express");
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

module.exports = router;
