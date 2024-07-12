const { PrismaClient } = require("../prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateUuid = require("../utils/generateUuid");
const { sendOtp } = require("../services/otpService");

const prisma = new PrismaClient();

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const uuid = generateUuid();

  if (!email || !password) {
    return res.status(400).json({
      status: "false",
      message: "Email and password is required",
    });
  } else if (password.length < 6) {
    return res.status(400).json({
      status: "false",
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        uuid: uuid,
        name,
        email,
        password: hashedPassword,
      },
    });
    res.json({
      status: "true",
      message: "User created successfully",
      data: {
        user: {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
        },
      },
    });
    await sendOtp(email);
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await prisma.verification_user.findFirst({
      where: {
        email,
      },
    });
    if (user.otp === otp && user.createAt < Date.now() - 60 * 1000) {
      res.status(400).json({ message: "OTP expired" });
    } else if (user.otp === otp) {
      await prisma.verification_user.delete({
        where: {
          email,
        },
      });

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          is_verified: true,
        },
      });

      res.json({ message: "OTP verified" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signUp, verifyOtp };
