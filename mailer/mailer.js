const nodemailer = require("nodemailer");

const bcrypt = require("bcryptjs");

const UserOtpVerification = require("../models/Users/userOtpVerification");

require("dotenv").config();

// console.log(process.env.EMAIL, process.env.PASSWORDGMAIL);

// send verification email

const sendVerificationEmail = async ({ _id, email, firstName }, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Ready for message");
        console.log(success);
      }
    });
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    //mail options

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `
      <img src="cid:unique@kreata.ee"
      style="
      width:200px;
      display: block;
      margin-left: auto;
      margin-right: auto;
      " />

      <h4 style="font-family :Slenco, sans-serif;">
      Hi ${firstName} !
       <br>
       <br>
        your verification code is
        <b style="font-family :Slenco, sans-serif;color :#570b03;">${otp}</b>
      <br>

      Enter this code in our website to activate your account .
      <br>
      If you have any questions, send us an email .
      <br>
      <br>

      The Quizness team
      </h4>
      <br>

`,
      attachments: [
        {
          filename: "logo.png",
          path: __dirname + "/logo.png",
          cid: "unique@kreata.ee", //same cid value as in the html img src
        },
      ],
    };

    //hash the otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOtpVerification({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save otp record
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.status(200).send({
      userId: _id,
      email,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const sendVoucherToCandidate = async (
  {
    // _id,
    email,
    firstName,
    lastName,
    _id_voucher,
    // creation_date,
    validation_date,
    businessName,
    // emailQuizMaster,
    logo,
    darkColor,
  },
  res
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      //
    });
    // var transporter = nodemailer.createTransport(
    //   "smtps:process.env.EMAIL:process.env.PASSWORD"
    // );
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Ready for message");
        console.log(success);
      }
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Voucher",
      html: `
      <img src=${logo} style="width:50px" />
      <h4 style="font-family :Slenco, sans-serif;">
      Hi ${firstName}  ${lastName} !
       <br> 
       <br>
        your Voucher code is     
        <img src="cid:unique@kreata.ee"  
        style="
        width:20px;
        " />
        <b style="font-family :Slenco, sans-serif;color :${darkColor};">${_id_voucher} </b> 
     
      <br>
      the validation date of your voucher is ${validation_date}
      <br>
      Enter this code in our website to start this quiz. 
      <br>
      If you have any questions, send us an email .
      <br>
      <br>

      </h4>
      <br>
      <br>

      The ${businessName} team
`,
      attachments: [
        {
          filename: "ticket-sharp-svgrepo-com.png",
          path: __dirname + "/ticket-sharp-svgrepo-com.png",
          cid: "unique@kreata.ee", //same cid value as in the html img src
        },
      ],
    };

    transporter.sendMail(mailOptions);

    res.status(200).send({
      message: "email send successfully",
    });
  } catch (error) {
    // res.status(500).send({
    console.log(error.message);
    // });
  }
};
//nodemailer stuff

module.exports = { sendVoucherToCandidate, sendVerificationEmail };
