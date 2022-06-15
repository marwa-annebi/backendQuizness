const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,

      html: `
      <!DOCTYPE html>
      <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
      <title></title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
      <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
      <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Alegreya" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"/>
      <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
      <!--<![endif]-->
      <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }

          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }

          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }

          p {
            line-height: inherit
          }

          @media (max-width:520px) {
            .row-content {
              width: 100% !important;
            }

            .column .border {
              display: none;
            }

            table {
              table-layout: fixed !important;
            }

            .stack .column {
              width: 100%;
              display: block;
            }
          }
        </style>
      </head>
      <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td style="padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;">
      <div align="center" style="line-height:10px">
      <img alt="your-logo" src="cid:logo" style="display: block; height: auto; border: 0; width: 125px; max-width: 100%;"
      title="your-logo" width="125"/>
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;" width="500">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
      <div align="center" style="line-height:10px"><img alt="reset-password" src="cid:gif" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" title="reset-password" width="350"/></div>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td style="text-align:center;width:100%;">
      <h1 style="margin: 0; color: #570b03; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Forgot your password?</strong></h1>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="10" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
      <tr>
      <td>
      <div style="font-family: Tahoma, Verdana, sans-serif">
      <div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #000000; line-height: 1.5;">
      <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="font-size:14px;"><span style="">Not to worry, we got you! </span><span style="">Let’s get you a new password.</span></span></p>
      </div>
      </div>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="15" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td>
      <div align="center">
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.yourwebsite.com" style="height:58px;width:272px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#FFC727" fillcolor="#ffc727"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#570b03; font-family:Tahoma, Verdana, sans-serif; font-size:18px"><![endif]-->
      <a href=${text} style="text-decoration:none;display:inline-block;color:#570b03;background-color:#ffc727;border-radius:20px;width:auto;border-top:1px solid #FFC727;font-weight:400;border-right:1px solid #FFC727;border-bottom:1px solid #FFC727;border-left:1px solid #FFC727;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;">
      <span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 18px; line-height: 36px;" style="font-size: 18px; line-height: 36px;"><strong>
      RESET PASSWORD</strong></span></span></span></a>
      <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
      </div>
      </td>
      </tr>
      </table>
      <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
      <tr>
      <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
      <div style="font-family: Tahoma, Verdana, sans-serif">
      <div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-line-height-alt: 18px; color: #000000; line-height: 1.5;">
      <p style="margin: 0; mso-line-height-alt: 19.5px;"><span style="font-size:13px;">If you didn’t request to change your password, simply ignore this email.</span></p>
      </div>
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="15" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
      <tr>
      <td>
      <div style="font-family: Tahoma, Verdana, sans-serif">
      <div class="txtTinyMce-wrapper" style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;">
      <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:10px;">This link will expire in 24 hours. If you continue to have problems</span><br/><span style="font-size:10px;">please feel  to contact us at <a href="mailto:support@youremail.com" rel="noopener" style="text-decoration: underline; color: #393d47;" target="_blank" title="support@youremail.com">quizness2022@gmail.com</a>. </span></p>
      </div>
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tbody>
      <tr>
      <td>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
      <tbody>
      <tr>
      <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
      <table border="0" cellpadding="0" cellspacing="0" class="empty_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
      <tr>
      <td>
      <div></div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table><!-- End -->
      </body>
      </html>`,
      attachments: [
        {
          filename: "logo.png",
          path: __dirname + "/logo.png",
          cid: "logo", //same cid value as in the html img src
        },
        {
          filename: "gif-resetpass.gif",
          path: __dirname + "/gif-resetpass.gif",
          cid: "gif", //same cid value as in the html img src
        },
      ],
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
