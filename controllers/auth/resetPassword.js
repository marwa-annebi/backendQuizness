var mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const myEnum = require("./enumUser");
const Admin = require("../../models/users/adminModel");
const Quizmaster = require("../../models/users/quizmasterModel");
const sendEmail = require("../../mailer/sendEmail");
const Candidate = require("../../models/users/candidateModel");

const sendPasswordLink = async (req, res, next) => {
  const { email, type } = req.body;

  //     const { error } = emailSchema.validate(req.body.email);
  //      if (error)
  //    return res.status(400).send({ message: error.details[0].message });
  if (!email) {
    res.status(422).send({ message: "please input your email !" });
  }
  let user;
  switch (type) {
    case myEnum.ADMIN.value:
      user = await Admin.findOne({ email });
      //console.log(user);
      break;
    case myEnum.CANDIDATE.value:
      user = await Candidate.findOne({ email});
      console.log(user);
      break;
    case myEnum.QUIZMASTER.value:
      user = await Quizmaster.findOne({ email});
      // console.log(user);
      break;
  }
  if (!user) {
    return res
      .status(409)
      .send({ message: "User with given email does not exist!" });
  }
  if (user) {
    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    await user.save();
    // console.log(user);
    const url = ` ${process.env.CLIENT_URL}setNewPassword/${user._id}/${resetToken}/${type}`;
    await sendEmail(user.email, "reset password", url);
console.log(url)
    res
      .status(200)
      .send({ message: "Password reset link sent to your email account" });
  } else if (!user) {
    res.status(400).send({ message: "email not exist" });
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    next();
  }
};

const confirmResetPassword = async (resetToken) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  try {
    const user = await Candidate.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      user = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }
    console.log(user);
    if (!user) {
      user = await Quizmaster.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
    }
    console.log(user);

    if (!user) return { message: "user not exist" };
    return user;
  } catch (err) {
    return { message: "Internal Server Error" };
  }
};

const setNewPassword = async (req, res, next) => {
  try {
    let { password } = req.body;
    let { type, id } = req.params;
    let user = await confirmResetPassword(
      req.params.resetToken,
      req.params.type,
      req.params.id
    );
    console.log(user);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      switch (type) {
        case myEnum.ADMIN.value:
          let newAdmin = await Admin.findByIdAndUpdate(req.params.id, {
            password: hashedPassword,
          });
          //console.log(user);
          newAdmin.save();
          break;
        case myEnum.CANDIDATE.value:
          let newCandidate = await Candidate.findByIdAndUpdate(req.params.id, {
            password: hashedPassword,
          });
          // newCandidate.updateOne({ password: hashedPassword });
          // console.log(user);
          newCandidate.save();
          break;
        case myEnum.QUIZMASTER.value:
          // let newQuizMaster=await User.findById(req.params.id)
          newQuizMaster = await Quizmaster.findByIdAndUpdate(req.params.id, {
            password: hashedPassword,
          });
          //console.log( typeof newQuizMaster);
          newQuizMaster.save();
          break;
      }
      return res.status(201).send({
        message: "Password Updated Success",
      });
    }
    return res.status(400).send({ msg: "user not exist!" });
  } catch (error) {
    res.status(500).send({ message: error });
    next(error);
  }
};

module.exports = { sendPasswordLink, setNewPassword, confirmResetPassword };
