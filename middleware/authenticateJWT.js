const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({
      status: "false",
      message: "Access denied",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

module.exports = { authenticateJWT };
