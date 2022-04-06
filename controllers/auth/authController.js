// register for admin

const asyncHandler = require("express-async-handler");
const { sendVerificationEmail } = require("../../mailer/mailer");
const Admin = require("../../models/users/adminModel");
const Candidate = require("../../models/users/candidateModel");
const QuizMaster = require("../../models/users/quizMasterModel");
const UserOtpVerification = require("../../models/users/userOtpVerification");
const bcrypt = require("bcryptjs");

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    const userExists = await Admin.findOne({ email });
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields !",
      });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.json({
        status: "FAILED",
        message: "Invalid firstName entered",
      });
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.json({
        status: "FAILED",
        message: "Invalid last name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "Invalid email",
      });
    } else if (userExists) {
      res.json({
        status: "FAILED",
        message: "admin with provided email exists ",
      });
    } else {
      const admin = new Admin({
        firstName,
        lastName,
        email,
        password,
      });
      admin.save().then(() => {
        res.json({
          status: "SUCCESS",
          admin,
        });
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// register QuizMaster

const registerQuizMaster = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    const userExists = await QuizMaster.findOne({ email });
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields !",
      });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.json({
        status: "FAILED",
        message: "Invalid firstName entered",
      });
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.json({
        status: "FAILED",
        message: "Invalid last name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "Invalid email",
      });
    } else if (userExists) {
      res.json({
        status: "FAILED",
        message: "quizMaster with provided email exists ",
      });
    } else {
      const quizMaster = new QuizMaster({
        firstName,
        lastName,
        email,
        password,
      });
      quizMaster.save().then((result) => {
        sendVerificationEmail(result, res);
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// register Candidate

const registerCandidate = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    const userExists = await Candidate.findOne({ email });
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields !",
      });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.json({
        status: "FAILED",
        message: "Invalid firstName entered",
      });
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.json({
        status: "FAILED",
        message: "Invalid last name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "Invalid email",
      });
    } else if (userExists) {
      res.json({
        status: "FAILED",
        message: "Candidate with provided email exists ",
      });
    } else {
      const candidate = new Candidate({
        firstName,
        lastName,
        email,
        password,
      });
      candidate.save().then((result) => {
        sendVerificationEmail(result, res);
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// verify OTP

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const UserOtpVerificationRecords = await UserOtpVerification.find({
        userId,
      });
      if (UserOtpVerificationRecords.length <= 0) {
        //no record found
        throw new Error(
          "Account record doesn't exist or has been verified already .Please sign up or sign in"
        );
      } else {
        // user otp record exists
        const { expiresAt } = UserOtpVerificationRecords[0];
        const hashedOtp = UserOtpVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          // user otp record has expired
          await UserOtpVerification.deleteMany({ userId });
          throw new Error("Code has expired . please request again");
        } else {
          const validOTP = bcrypt.compare(otp, hashedOtp);
          if (!validOTP) {
            throw new Error("Invalid code passed . Check your inbox.");
          } else {
            //success

            await QuizMaster.updateOne({ _id: userId }, { verified: true });
            await Candidate.updateMany({ _id: userId }, { verified: true });
            await UserOtpVerification.deleteMany({ userId });
            res.json({
              status: "VERIFIED",
              message: `User email verified successfully`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// resend verification

const resendverification = asyncHandler(async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed ");
    } else {
      // delete existing records and resend
      await UserOtpVerification.deleteMany({ userId });
      sendVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

module.exports = {
  registerAdmin,
  registerQuizMaster,
  registerCandidate,
  verifyOTP,
  resendverification,
};