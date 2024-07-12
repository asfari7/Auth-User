const { PrismaClient } = require("../prisma");
const prisma = new PrismaClient();

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await prisma.verification_user.findFirst({
      where: {
        email,
      },
    });
    if (user.otp !== otp) {
      res.status(400).json({
        status: "false",
        message: "Invalid OTP",
      });
    } else if (user.createAt < Date.now() - 60 * 1000) {
      res.status(400).json({
        status: "false",
        message: "OTP expired",
      });
    } else {
      await prisma.verification_user.delete({
        where: {
          email,
        },
      });
      next();
    }
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

module.exports = { verifyOtp };
