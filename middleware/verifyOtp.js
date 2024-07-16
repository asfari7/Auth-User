const { PrismaClient } = require("../prisma");
const { sendError } = require("../utils/responseUtils");

const prisma = new PrismaClient();

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendError(res, "Email and OTP is required", 400);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
  } catch (error) {
    return sendError(res, error.message, 400);
  }

  try {
    const user = await prisma.verification_user.findFirst({
      where: {
        email,
      },
    });

    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP", 400);
    } else if (user.createAt < Date.now() - 60 * 5000) {
      return sendError(res, "OTP expired", 400);
    } else {
      await prisma.verification_user.delete({
        where: {
          email,
        },
      });

      next();
    }
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = { verifyOtp };
