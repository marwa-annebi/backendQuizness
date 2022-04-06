const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: process.env.HOST,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
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
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};