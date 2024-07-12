const express = require("express");
const router = express.Router();

const { signUp, verifyOtp } = require("../controllers/authController");
const { verifyUnique } = require("../middleware/verifyUnique");
const { requestOtp } = require("../services/otpService");

router.post("/signup", verifyUnique, signUp);
router.post("/verify-user", verifyOtp);
router.post("/resend-otp", requestOtp);

module.exports = router;
