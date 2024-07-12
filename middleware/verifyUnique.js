const { PrismaClient } = require("../prisma");

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
      return res.status(400).json({
        status: "false",
        message: "User already exists",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

module.exports = { verifyUnique };
