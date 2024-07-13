const { PrismaClient } = require("../prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateUuid = require("../utils/generateUuid");
const {
  sendSuccess,
  sendError,
  sendResponse,
} = require("../utils/responseUtils");
const { sendOtp } = require("../services/otpService");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const uuid = generateUuid();

  if (!email || !password) {
    return sendError(res, "Email and password is required", 400);
  } else if (password.length < 6) {
    return sendError(res, "Password must be at least 6 characters", 400);
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
    await sendOtp(email);
    return sendSuccess(
      res,
      { uuid: user.uuid, name: user.name, email: user.email },
      "User created successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const activation = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        is_verified: true,
      },
    });
    return sendSuccess(
      res,
      { uuid: user.uuid, name: user.name, email: user.email },
      "User activated successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        is_verified: true,
      },
    });
    return sendSuccess(
      res,
      { uuid: user.uuid, name: user.name, email: user.email },
      "Password reset successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email and password is required", 400);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    } else {
      if (user.is_verified === false) {
        next();
      }
    }

    const isMatch = await comparePassword(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { uuid: user.uuid, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      req.session.token = token;
      return sendSuccess(
        res,
        { uuid: user.uuid, name: user.name, email: user.email, token },
        "User signed in successfully"
      );
    } else {
      return sendError(res, "Invalid credentials", 400);
    }
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = { signUp, activation, resetPassword, signIn };
