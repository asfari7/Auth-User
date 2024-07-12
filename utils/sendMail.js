const nodeMailer = require("nodemailer");
const template = require("../templates/emailTemplate");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendMail(to, OTP) {
  try {
    const mailOptions = {
      from: {
        name: "OTP Verification code",
        address: process.env.EMAIL,
      },
      to,
      subject: "OTP Verification code",
      html: template(OTP),
    };
    transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
}

module.exports = { sendMail };
