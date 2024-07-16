const express = require("express");
const router = express.Router();

const {
  signUp,
  activation,
  resetPassword,
  signIn,
  signOut,
} = require("../controllers/authController");
const { verifyUnique } = require("../middleware/verifyUnique");
const { verifyOtp } = require("../middleware/verifyOtp");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const { requestOtp } = require("../services/otpService");

router.post("/signUp", verifyUnique, signUp);
router.post("/activation", verifyOtp, activation);
router.post("/request-otp", requestOtp);
router.post("/signIn", signIn);

router.put("/reset-password", verifyOtp, resetPassword);

router.get("/user-data", authenticateJWT, (req, res) => {
  const user = req.user;

  res.json({
    status: "true",
    message: "User data fetched successfully",
    data: {
      uuid: user.uuid,
      name: user.name,
      iat: user.iat,
      exp: user.exp,
    },
  });
});

router.delete("/signOut", signOut);

module.exports = router;
