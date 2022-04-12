const express = require("express");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
 
  loginUser,
} = require("../controllers/auth/authController");
const  {sendPasswordLink,setNewPassword,confirmResetPassword} = require("../controllers/auth/resetPassword");
const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerQuizMaster").post(registerQuizMaster);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resendOtpVerificarion").post(resendverification);

router.route("/sendpasswordlink").post(sendPasswordLink);
router.route("/setNewPassword/:id/:resetToken/:type").post(setNewPassword)
router.route("/loginUser").post(loginUser)


module.exports = router;
