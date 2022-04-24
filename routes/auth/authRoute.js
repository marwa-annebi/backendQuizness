const express = require("express");
const { sendPasswordLink, setNewPassword } = require("../../controllers/auth/resetPassword");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
  loginUser,
  logout,
  loginAdmin,
 
} = require("../../controllers/auth/authController");
const verifyToken = require("../../utils/verifyToken")
const router =express.Router()
router.route("/registerAdmin").post(registerAdmin);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerQuizMaster").post(registerQuizMaster);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resendOtpVerificarion").post(resendverification);

 router.route("/sendpasswordlink").post(sendPasswordLink);
 router.route("/setNewPassword/:id/:resetToken/:type").post(setNewPassword)
router.route("/verifyToken").get(verifyToken)
router.route('/logout').get(logout)
router.route('/loginUser').post(loginUser)
router.route("/loginAdmin").post(loginAdmin)


module.exports = router;


