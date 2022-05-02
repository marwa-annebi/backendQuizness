const express = require("express");
const getQuizByIdVoucher = require("../../controllers/candidate/candidateController");
const {addAnswerController ,correctAnswerController}=require("../../controllers/candidate/answerCandidate");
const router = express.Router();
router.route("/getQuiz").post(getQuizByIdVoucher);
router.route("/answerCandidate").post(addAnswerController);
router.route("/correctAnswer").post(correctAnswerController);
module.exports = router;
