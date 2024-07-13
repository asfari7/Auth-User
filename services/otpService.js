const { PrismaClient } = require("../prisma");
const { sendMail } = require("../utils/sendMail");
const { generateOTP } = require("../utils/otpGenerator");
const { sendSuccess, sendError } = require("../utils/responseUtils");

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
      return sendError(res, "Email is required", 400);
    }

    const data = await prisma.verification_user.findUnique({
      where: {
        email,
      },
    });

    if (!data) {
      return sendError(res, "Email not found", 400);
    } else if (data.createAt > Date.now() - 60 * 1000) {
      return sendError(
        res,
        "Please wait for 1 minute before requesting another OTP",
        400
      );
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

    return sendSuccess(res, { email }, "OTP sent");
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = { sendOtp, requestOtp };
