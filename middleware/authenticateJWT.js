const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseUtils");

const authenticateJWT = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return sendError(res, "Access denied", 401);
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = { authenticateJWT };
