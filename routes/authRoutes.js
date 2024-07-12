const express = require("express");
const router = express.Router();

const {
  signUp,
  activation,
  resetPassword,
  signIn,
} = require("../controllers/authController");
const { verifyUnique } = require("../middleware/verifyUnique");
const { verifyOtp } = require("../middleware/verifyOtp");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const { requestOtp } = require("../services/otpService");

router.post("/signup", verifyUnique, signUp);
router.post("/activation", verifyOtp, activation);
router.post("/request-otp", requestOtp);
router.post("/signin", signIn);

router.put("/reset-password", verifyOtp, resetPassword);

router.get("/user-data", authenticateJWT, (req, res) => {
  const userUuid = req.user;

  res.json({
    status: "true",
    message: "User data fetched successfully",
    data: {
      uuid: userUuid.uuid,
      iat: userUuid.iat,
      exp: userUuid.exp,
    },
  });
});

module.exports = router;
