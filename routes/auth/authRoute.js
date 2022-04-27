const express = require("express");
const passport = require("passport");
const myEnum = require("./../../controllers/auth/enumUser");
const {
  sendPasswordLink,
  setNewPassword,
} = require("../../controllers/auth/resetPassword");
const {
  registerAdmin,
  registerCandidate,
  registerQuizMaster,
  verifyOTP,
  resendverification,
  loginUser,
  //logout,
  loginAdmin,
} = require("../../controllers/auth/authController");
require("../../controllers/auth/passport");
const verifyToken = require("../../utils/verifyToken");
const generateToken = require("../../utils/generateToken");
const router = express.Router();
router.route("/registerAdmin").post(registerAdmin);
router.route("/registerCandidate").post(registerCandidate);
router.route("/registerQuizMaster").post(registerQuizMaster);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resendOtpVerificarion").post(resendverification);

router.route("/sendpasswordlink").post(sendPasswordLink);
router.route("/setNewPassword/:id/:resetToken/:type").post(setNewPassword);
router.route("/verifyToken").get(verifyToken);
//
router.route("/loginUser").post(loginUser);
router.route("/loginAdmin").post(loginAdmin);
const CLIENT_URL = "http://localhost:3000";
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
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
router.route("/google/callbackCandidate").get(
  passport.authenticate("google-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
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
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000/login`,
  })
);
router.route("/linkedin/callbackCandidate").get(
  passport.authenticate("linkedin-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000/login`,
  })
);
// microsoft 
router.get(
  "/microsoft/Quizmaster",
  passport.authenticate("microsoft-Quizmaster", { session: false })
);

router.route("/microsoft/callbackQuizmaster").get(
  passport.authenticate("microsoft-Quizmaster", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000/login`,
  })
);
router.get(
  "/microsoft/Candidate",
  passport.authenticate("microsoft-Candidate", { session: false })
);


router.route("/microsoft/callbackCandidate").get(
  passport.authenticate("microsoft-Candidate", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://localhost:3000/login`,
  })
);
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});
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

module.exports = router;
