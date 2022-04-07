const express = require("express");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
  loginUser,
  logout,
} = require("../controllers/auth/authController");
const  {sendPasswordLink,setNewPassword} = require("../controllers/auth/resetPassword");
const router = express.Router();
const verifyToken = require("../utils/verifyToken")
router.route("/registerAdmin").post(registerAdmin);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerQuizMaster").post(registerQuizMaster);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resendOtpVerificarion").post(resendverification);

router.route("/sendpasswordlink/:typeUser").post(sendPasswordLink);
router.route("/:id/:token").post(setNewPassword);

router.route("/login/:typeUser").post(loginUser);
router.route("/verifyToken/:id").post(verifyToken)
router.route('/logout').get(logout)


module.exports = router;
