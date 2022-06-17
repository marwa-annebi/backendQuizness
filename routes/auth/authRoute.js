const express = require("express");
const passport = require("passport");
const {
  sendPasswordLink,
  setNewPassword,
} = require("../../controllers/auth/resetPassword");
const {
  sendPasswordLinkAdmin,
  setNewPasswordAdmin,
} = require("../../controllers/auth/resetPasswordAdmin");
const { verifTokenAdmin } = require("../../utils/verifyToken");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
  loginUser,
  updateUserProfile,
  logout,
  loginAdmin,
  updateAccount,
  getCompanySettings,
  updateAdminProfile,
} = require("../../controllers/auth/authController");
const router = express.Router();
require("../../controllers/auth/passport");
require("../../controllers/auth/quizMasterPassport");
const CLIENT_URL = "http://localhost:3000";
const QUIZMASTER_URL = "http://formalab.localhost:3000";

//register Admin

router.route("/registerAdmin").post(registerAdmin);
router.route("/updateAdminProfile").put(verifTokenAdmin,updateAdminProfile);
//update User Profile

router.route("/updateProfile").put(updateUserProfile);

//register Candidate

router.route("/registerCandidate").post(registerCandidate);

//register QuizMaster

router.route("/registerQuizMaster").post(registerQuizMaster);
//verify OTP

router.route("/verifyOTP").post(verifyOTP);

//resend verification
router.route("/updateAccount").put(updateAccount);

router.route("/resendOtpVerificarion").post(resendverification);

//forgot password

router.route("/sendpasswordlink").post(sendPasswordLink);

//set new password

router.route("/setNewPassword/:id/:resetToken/:type").post(setNewPassword);

//forgot passwordAdmin

router.route("/sendpasswordlinkAdmin").post(sendPasswordLinkAdmin);

//set new passwordAdmin

router
  .route("/setNewPasswordAdmin/:id/:resetToken/:type")
  .post(setNewPasswordAdmin);
//verify token

// router.route("/verifyToken").get(verifyToken);

//login quizmaster and candidate

router.route("/loginUser").post(loginUser);

//login admin

router.route("/loginAdmin").post(loginAdmin);

//google

router
  .route("/google/Quizmaster")
  .get(
    passport.authenticate("google-Quizmaster", { scope: ["email", "profile"] })
  );

router
  .route("/google/Candidate")
  .get(
    passport.authenticate("google-Candidate", { scope: ["email", "profile"] })
  );

router.route("/google/callbackQuizmaster").get(
  passport.authenticate("google-Quizmaster", {
    successRedirect: QUIZMASTER_URL,
    failureRedirect: "/login/failed",
  })
);

router.route("/google/callbackCandidate").get(
  passport.authenticate("google-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000/login`,
  })
);

// linkedin

router.get(
  "/linkedin/Quizmaster",
  passport.authenticate("linkedin-Quizmaster", { state: "SOME STATE" })
);

router.get(
  "/linkedin/Candidate",
  passport.authenticate("linkedin-Candidate", { state: "SOME STATE" })
);

router.route("/linkedin/callbackQuizmaster").get(
  passport.authenticate("linkedin-Quizmaster", {
    successRedirect: QUIZMASTER_URL,
    failureRedirect: `https://localhost:3000`,
  })
);

router.route("/linkedin/callbackCandidate").get(
  passport.authenticate("linkedin-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000`,
  })
);

// microsoft

router.get(
  "/microsoft/Quizmaster",
  passport.authenticate("microsoft-Quizmaster", { session: false })
);

router.route("/microsoft/callbackQuizmaster").get(
  passport.authenticate("microsoft-Quizmaster", {
    successRedirect: QUIZMASTER_URL,
    failureRedirect: `https://localhost:3000`,
  })
);

router.get(
  "/microsoft/Candidate",
  passport.authenticate("microsoft-Candidate", { session: false })
);

router.route("/microsoft/callbackCandidate").get(
  passport.authenticate("microsoft-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000`,
  })
);

//login failed

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

//logout

router.route("/logout").get(logout);
//login success

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

// GET company settings

router.route("/getCompanySettings").get(getCompanySettings);
module.exports = router;
