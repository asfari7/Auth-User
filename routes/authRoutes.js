const express = require("express");
const router = express.Router();

const {
  signUp,
  activation,
  resetPassword,
} = require("../controllers/authController");
const { verifyUnique } = require("../middleware/verifyUnique");
const { verifyOtp } = require("../middleware/verifyOtp");
const { requestOtp } = require("../services/otpService");

router.post("/signup", verifyUnique, signUp);
router.post("/activation", verifyOtp, activation);
router.post("/request-otp", requestOtp);

router.put("/reset-password", verifyOtp, resetPassword);

module.exports = router;
