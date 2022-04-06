
const Token = require("../../models/users/tokenModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const sendEmail = require("../../utils/sendEmail");
const myEnum = require("./enumUser");
const Admin = require("../../models/users/adminModel");
const Candidate=require("../../models/users/candidateModel");
const QuizMaster = require("../../models/users/quizMasterModel");
const sendPasswordLink = async (req, res) => {
 const {email}=req.body
   
//     const { error } = emailSchema.validate(req.body.email);
//      if (error)
//    return res.status(400).send({ message: error.details[0].message });

    let user;
    switch(req.params.typeUser){
      case myEnum.ADMIN.value:
             user = await Admin.findOne({email});
             console.log(user);
      break;
      case myEnum.CANDIDATE.value:
             user = await Candidate.findOne({email});
             console.log(user);
      break;
      case myEnum.QUIZMASTER.value:
             user = await QuizMaster.findOne({email});
             console.log(user);
      break;
    }
             if(user){

              let newtoken = await Token.findOne({userId:user._id});
              if (!newtoken) {
                newtoken=await new Token (
                  {
                    userId:user._id,
                    token :crypto.randomBytes(32).toString("hex")
                  }
                ).save();
                
              }
              const url = `

  Dear Quizness User,
  We have received your request to reset your password.
  Please click the link below to complete the reset:
  ${process.env.CLIENT_URL}/auth/sendpasswordlink/${user._id}/${newtoken.token}`;
  await sendEmail(user.email, "Password Reset", url);

  res
    .status(200)
    .send({ message: "Password reset link sent to your email account" });}


    else  {
      res
      .status(200)
      .send({ message: "email not exist in Admin account" });}
    }


    
    
       
    

const setNewPassword = async (req, res) => {
  try {
    // const passwordSchema = Joi.object({
    //      userDetails:{password: Joi.string().required() }}
    // );
    // const { error } = passwordSchema.validate(req.body);
    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });
 let  {password}=req.body;
    
    let user = await Candidate.findOne({ _id: req.params.id });
   
    
    if (!user)
     { user = await Admin.findOne({ _id: req.params.id });
     user = await QuizMaster.findOne({ _id: req.params.id });
    console.log(user);}

    if (!user) return res.status(400).send({ message: "user not exist" });
    const newtoken = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!newtoken)
      return res.status(400).send({ message: "Invalid link or expired" });
      
   if(user){
const NewPassword=await bcrypt.hash(req.body.password,10)
    user.password=NewPassword
    console.log(NewPassword);
    await user.updateOne({password:NewPassword});
    console.log(user);
    await newtoken.remove();
    res.status(200).send({ message: "Password reset successfully" });}
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { sendPasswordLink, setNewPassword };