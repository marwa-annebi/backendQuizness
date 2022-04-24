
var mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const sendEmail = require("../../utils/sendEmail");
const myEnum = require("./enumUser");
const Admin = require("../../models/users/adminModel");
const generateToken = require("../../utils/generateToken");

const User = require("../../models/users/userModel");


const sendPasswordLink = async (req, res, next) => {
  const { email, type } = req.body;


  //     const { error } = emailSchema.validate(req.body.email);
  //      if (error)
  //    return res.status(400).send({ message: error.details[0].message });

  let user;
  switch (type) {
    case myEnum.ADMIN.value:
      user = await Admin.findOne({ email });
      //console.log(user);
      break;
    case myEnum.CANDIDATE.value:
      user = await User.findOne({ email ,isCandidat:true});
      console.log(user);
      break;
    case myEnum.QUIZMASTER.value:
      user = await User.findOne({ email ,isQuizmaster:true});
      // console.log(user);
      break;
  }
  if (user) {
    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    await user.save();
    console.log(user);

    const url = `
  Dear Quizness User,
  We have received your request to reset your password.
  Please click the link below to complete the reset:
  ${process.env.CLIENT_URL}/auth/setNewPassword/${user._id}/${resetToken}/${type}`;
    await sendEmail(user.email, "Password Reset", url);

    res
      .status(200)
      .send({ message: "Password reset link sent to your email account" });
  } else {
    res.status(400).send({ message: "email not exist in Admin account" });
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    next();
  }
};

const confirmResetPassword = async (resetToken,type,id) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      isCandidat:true,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      user = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    } console.log(user);
    if (!user) {
      user = await User.findOne({
        isQuizmaster:true,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }
    console.log(user);

    if (!user) return ({ message: "user not exist" });
    return user;
  } catch (err) {
   return ({ message: "Internal Server Error" });
  }
};

const setNewPassword = async (req, res, next) => {
  try {
   
    let user = await confirmResetPassword(req.params.resetToken,req.params.type,req.params.id);
    console.log(user);
    let { password } = req.body;
 let {type,id}=req.params;
 
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
     //user.password = hashedPassword;
      // user.resetPasswordToken = undefined;
      // user.resetPasswordExpire = undefined;
     // console.log(hashedPassword);
      switch (type) {
       
        case myEnum.ADMIN.value:
   
        let  newAdmin= await Admin.findByIdAndUpdate(req.params.id,{ password: hashedPassword })
          //console.log(user);
          newAdmin.save();
          break;
        case myEnum.CANDIDATE.value:
          let newCandidate=await User.findByIdAndUpdate(req.params.id,{ password: hashedPassword })
          // newCandidate.updateOne({ password: hashedPassword });
          // console.log(user);
          newCandidate.save();
          break;
        case myEnum.QUIZMASTER.value:
          // let newQuizMaster=await User.findById(req.params.id)
           newQuizMaster= await User.findByIdAndUpdate(req.params.id,{ password: hashedPassword })
          //console.log( typeof newQuizMaster);
          newQuizMaster.save();
         
         
         
          break;
      }
      return res.status(201).json({
        success: true,
        data: "Password Updated Success",
        token : generateToken(user._id ,type,user.email),
      });
    }
    return res.status(400).json({ msg: "user not exist!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    next(error);
  }
};

module.exports = { sendPasswordLink, setNewPassword, confirmResetPassword };
