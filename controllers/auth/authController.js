// register for admin
const moment = require("moment");
const asyncHandler = require("express-async-handler");
const { sendVerificationEmail } = require("../../mailer/mailer");
const Admin = require("../../models/users/adminModel");

const UserOtpVerification = require("../../models/users/userOtpVerification");
const bcrypt = require("bcryptjs");
const myEnum = require("./enumUser");
const generateToken = require("../../utils/generateToken");

const crypto = require("crypto");
const User = require("../../models/users/userModel");

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.image = req.body.image || user.image;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const update = await user.save();
    res.json({
      _id: update._id,
      name: update.name,
      lastName: update.lastName,
      email: update.email,
      image: update.image,
      // token: generateToken(update._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
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
    const userExists = await User.findOne({ email, isQuizmaster: true });
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      res.status(400).send({
        message: "Empty input fields !",
      });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.status(400).send({
        message: "Invalid firstName entered",
      });
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.status(400).send({
        message: "Invalid last name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(400).send({
        message: "Invalid email",
      });
    } else if (userExists) {
      res.status(400).send({
        message: "quizMaster with provided email exists ",
      });
    } else {
      const quizMaster = new User({
        firstName,
        lastName,
        email,
        password,
        isQuizmaster: true,
        isTrialer: true
        
      });
      quizMaster.save().then((result) => {
      sendVerificationEmail(result, res);
      });
    }
  } catch (error) {
    return  res.status(500).send({
      message: error.message,
    });
    
  }
});

// register Candidate

const registerCandidate = asyncHandler(async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email, isCandidat: true });
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      res.status(400).send({
        message: "Empty input fields !",
      });
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
      res.status(400).send({
        message: "Invalid firstName entered",
      });
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
      res.status(400).send({
        message: "Invalid last name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.status(400).send({
        message: "Invalid email",
      });
    } else if (userExists) {
      res.status(400).send({
        message: "Candidate with provided email exists ",
      });
    } else {
      const candidate = new User({
        firstName,
        lastName,
        email,
        password,
        isCandidat: true,
      });
      candidate.save().then((result) => {
        // const url = `${process.env.CLIENT_URL}/sendVerification/${result._id}`;
        sendVerificationEmail(result, res);
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

            await User.updateOne({ _id: userId }, { verified: true });
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
        user = await User.findOne({
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
    let user;
    switch (type) {
      case myEnum.CANDIDATE.value:
        user = await User.findOne({
          email,
          isCandidat: true,
        });
        // console.log(user);

        if (!user) {
          // user=await User.findOne({email,isQuizmaster:false})
          user = await User.findOneAndUpdate(
            { email: req.body.email, isCandidat: false },
            { $set: { isCandidat: true } },
            { new: true }
          );
          console.log(user);
        }

      break;
      case myEnum.QUIZMASTER.value:
        user = await User.findOne({
          email,
          isQuizmaster: true,
        });
        //console.log(user);
       

        if (!user) {
          //user=await User.findOne({email,isCandidat:false})
          user = await User.findOneAndUpdate(
            { email: req.body.email, isQuizmaster: false },
            { $set: { isQuizmaster: true 
        } },
            { new: true }
          );

          console.log(user);
        }
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

    console.log(user);
    if (user) {

      
      console.log(user);
      if (!user.verified) {
        res.status(400).send({
          message: "Please verify your account , check your inbox",
        });


  
      } else if (await user.matchPassword(password)) {
  
       //
       let date = user.createdAt;
        let date1 =date.setDate(date.getDate()+6)

        if( new Date(+ date1) < new Date ( +Date.now()))
        {
          await   User.findOneAndUpdate({_id:user._id},{$set:{isTrialer:false}},
            {new: true},)
        }
        var token = generateToken(user._id, req.body.type, user.email);
       // console.log(token);

        res.status(200).send({ auth: true, token: token ,isTrialer:user.isTrialer,_id:user._id});

      } else {
        console.log("invalid");
        res.status(401).send({ message: "Invalid Email or Password" });
      }
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send({ message: "internal server error" });
  }
});

//logout

const logout = asyncHandler(async (req, res) => {

  res.status(200).send({ auth: false,token:null });

})

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
