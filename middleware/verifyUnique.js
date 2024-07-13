const { PrismaClient } = require("../prisma");
const { sendSuccess, sendError } = require("../utils/responseUtils");

const prisma = new PrismaClient();

const verifyUnique = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return sendError(res, "User already exists", 400);
    }
    next();
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = { verifyUnique };
