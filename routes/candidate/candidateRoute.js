const express = require("express");
const getQuizByIdVoucher = require("../../controllers/candidate/candidateController");
const router = express.Router();
router.route("/getQuiz").post(getQuizByIdVoucher);
module.exports = router;
