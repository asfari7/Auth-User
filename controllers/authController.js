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

const activation = async (req, res) => {
  const { email } = req.body;
  try {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        is_verified: true,
      },
    });
    res.json({
      status: "true",
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

module.exports = { signUp, activation };
