// register for admin
const moment = require("moment");
const asyncHandler = require("express-async-handler");
const { sendVerificationEmail } = require("../../mailer/mailer");
const Admin = require("../../models/users/adminModel");
const UserOtpVerification = require("../../models/users/userOtpVerification");
const bcrypt = require("bcryptjs");
const myEnum = require("./enumUser");
const generateToken = require("../../utils/generateToken");
const { registerValidation } = require("./../../validation/userValidation");
const Quizmaster = require("../../models/users/quizmasterModel");
const Candidate = require("./../../models/users/candidateModel");
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await Quizmaster.findById(req.user._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.logo = req.body.logo || user.logo;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const update = await user.save();
    res.json({
      _id: update._id,
      firstName: update.firstName,
      lastName: update.lastName,
      email: update.email,
      logo: update.logo,
      // token: generateToken(update._id),
    });
  } else {
    res.status(404);
    throw new Error("Quiz Master Not Found");
  }
});

// register QuizMaster

const registerQuizMaster = asyncHandler(async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  const userExists = await Quizmaster.findOne({ email });
  // if (!firstName || !lastName || !email || !email) {
  //   res.status(400).send({ message: "empty fields" });
  // }
  const { error } = registerValidation({
    firstName,
    lastName,
    email,
    password,
  });
  if (error) return res.status(400).send({ message: error.message });
  if (userExists) {
    res.status(400).send({
      message: "quizMaster with provided email exists ",
    });
  }
  try {
    const quizMaster = new Quizmaster({
      firstName,
      lastName,
      email,
      password,
    });
    quizMaster.save().then((result) => {
      sendVerificationEmail(result, res);
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

// register Candidate

const registerCandidate = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password, password_confirmation } =
      req.body;
    const userExists = await Candidate.findOne({ email });
    const { error } = registerValidation({
      firstName,
      lastName,
      email,
      password,
      password_confirmation,
    });
    if (error) return res.status(400).send({ msg: "error" });
    if (userExists) {
      res.status(400).send({
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
        res.status(201).send(result);
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// verify OTP

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    let { otp, userId } = req.body;
    if (!otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const UserOtpVerificationRecords = await UserOtpVerification.find({
        userId,
      });
      if (UserOtpVerificationRecords.length <= 0) {
        //no record found
        res.status(400).send({
          message:
            "Account record doesn't exist or has been verified already .Please sign up or sign in",
        });
      } else {
        // user otp record exists
        const { expiresAt } = UserOtpVerificationRecords[0];
        const hashedOtp = UserOtpVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          // user otp record has expired
          await UserOtpVerification.deleteMany({ userId });
          res
            .status(400)
            .send({ message: "Code has expired please request again" });
        } else {
          const validOTP = bcrypt.compare(otp, hashedOtp);
          if (!validOTP) {
            res
              .status(400)
              .send({ message: "Invalid code passed . Check your inbox" });
          } else {
            //success

            await Quizmaster.updateOne({ _id: userId }, { verified: true });
            // await Candidate.updateMany({ _id: userId }, { verified: true });
            await UserOtpVerification.deleteMany({ userId });
            res.status(200).send({
              message: "User email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).send({
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
    res.status(500).send({
      status: "FAILED",
      message: error.message,
    });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password, type } = req.body;
    let user;
    switch (type) {
      case myEnum.ADMIN.value:
        user = await Admin.findOne({
          email,
        });
        // console.log(user);
        if (!user) {
          res.status(404).send({
            message: "user doesn't exist",
          });
        }
        // console.log(user);
        else if (user) {
          if (await user.matchPassword(req.body.password)) {
            return res.send({
              email,
              password,
            });
          } else {
            return res.send({
              message: "Invalid email or password",
            });
          }
        }
        break;
    }
  } catch (error) {
    return res.status(400).send({
      status: "FAILED",
      message: error.message,
    });
  }
});

//login user

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, type } = req.body;
    //validate the data
    // const { error } = loginValidation(req.body);
    // if (error) return res.status(400).json({ msg: error.details[0].message });
    let user;
    switch (type) {
      case myEnum.CANDIDATE.value:
        user = await Candidate.findOne({
          email,
        });
        break;
      case myEnum.QUIZMASTER.value:
        user = await Quizmaster.findOne({
          email,
        });
        break;
      default:
        return res.status(404).send({
          message: "error provider",
        });
    }
    if (!user) {
      return res.status(404).send({
        message: "user doesn't exist",
      });
    }
    if (user) {
      // if (!user.verified) {
      //   res.status(400).send({
      //     message: "Please verify your account , check your inbox",
      //   });
      // }
      if (await user.matchPassword(password)) {
        var token = generateToken(user._id, req.body.type, user.email);

        res.status(200).send({
          auth: true,
          token: token,
          user: user,
        });
      } else {
        res.status(401).send({ message: "Invalid Email or Password" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
});

//logout

const logout = asyncHandler(async (req, res) => {
  res.status(200).send({ auth: false, token: null, user: null });
});

const registerAdmin = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password, password_confirmation } =
      req.body;
    const { error } = registerValidation({
      firstName,
      lastName,
      email,
      password,
      password_confirmation,
    });
    if (error) return res.status(400).send({ msg: "error" });
    if (userExists) {
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
          admin: admin,
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
module.exports = {
  registerAdmin,
  registerQuizMaster,
  registerCandidate,
  verifyOTP,
  resendverification,
  loginUser,
  updateUserProfile,
  logout,
  loginAdmin,
};
