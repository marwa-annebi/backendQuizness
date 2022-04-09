// register for admin

const asyncHandler = require("express-async-handler");
const { sendVerificationEmail } = require("../../mailer/mailer");
const Admin = require("../../models/users/adminModel");
const Candidate = require("../../models/users/candidateModel");
const QuizMaster = require("../../models/users/quizMasterModel");
const UserOtpVerification = require("../../models/users/userOtpVerification");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const myEnum = require("./enumUser");
const  generateToken = require("../../utils/generateToken");
const crypto =require ("crypto");
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

//login user

const loginUser = asyncHandler(async (req, res) => {
  try {
   
    const {email,password,type} = req.body;
    switch (type) {
      case myEnum.ADMIN.value:
        user = await Admin.findOne({
          email,
        });
        // console.log(user);
        if (!user) {
          res.json({
            message: "user doesn't exist",
          });
        }
        // console.log(user);
        else if (user) {
          if (await user.matchPassword(req.body.password)) {
            return  res.json({
              email,
              password,
            });
          } else {
           return   res.json({
              message: "Invalid email or password",
            });
          }
        }
        break;
      case myEnum.CANDIDATE.value:
        user = await Candidate.findOne({
          email,
        });
        break;
      case myEnum.QUIZMASTER.value:
        user = await QuizMaster.findOne({
          email: req.body.email,
        });
        // console.log(user);
        break;
      default:
        throw console.error("user doesn't exist");
       
    }
     if (!user) {
     return   res.status(404).json({
        message: "user doesn't exist",
      });
      
    }

    //console.log(user);
     else if (user) {
     console.log(user);
      if (!user.verified) {
        return  res.status(400).json({
          message: "Please verify your account",
        });
      } else if (await user.matchPassword(req.body.password)) {
        console.log(req.body.type);
       var token=generateToken(user._id,req.body.type,user.email);
       console.log(token);
      res.status(200).send({ auth: true, token: token });
      } else {
        return  res.status(400).json({
          message: "Invalid email or password",
        });
      }
    }
  } catch (error) {
    console.log(error);
     return res.status(400).json({
      status: "FAILED",
      message: error.message,
    });
  }
});

//logout 

const logout = asyncHandler(async (req, res) => {
  res.status(200).send({ auth: false, token: null });

})

module.exports = {
  registerAdmin,
  registerQuizMaster,
  registerCandidate,
  verifyOTP,
  resendverification,
  loginUser,
  logout
};
