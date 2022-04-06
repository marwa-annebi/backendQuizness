const express = require("express");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
} = require("../controllers/auth/authController");
const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerQuizMaster").post(registerQuizMaster);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resendOtpVerificarion").post(resendverification);

module.exports = router;
