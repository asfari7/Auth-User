const { PrismaClient } = require("../prisma");
const { sendMail } = require("../utils/sendMail");
const { generateOTP } = require("../utils/otpGenerator");

const prisma = new PrismaClient();

const sendOtp = async (email) => {
  try {
    const otp = generateOTP();
    await sendMail(email, otp);

    await prisma.verification_user.create({
      data: {
        email,
        otp,
      },
    });

    return "OTP sent successfully";
  } catch (error) {
    return error;
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const data = await prisma.verification_user.findUnique({
      where: {
        email,
      },
    });

    if (!data) {
      return res.status(400).json({ message: "Email not found" });
    } else if (data.createAt > Date.now() - 60 * 1000) {
      return res
        .status(400)
        .json({ message: "OTP already sent, wait one minute to resend OTP" });
    } else {
      await sendMail(email, otp);

      await prisma.verification_user.update({
        where: {
          email,
        },
        data: {
          otp,
          createAt: new Date(),
        },
      });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { sendOtp, requestOtp };
