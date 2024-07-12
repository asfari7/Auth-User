const express = require("express");
const router = express.Router();

const { signUp, activation } = require("../controllers/authController");
const { verifyUnique } = require("../middleware/verifyUnique");
const { verifyOtp } = require("../middleware/verifyOtp");
const { requestOtp } = require("../services/otpService");

router.post("/signup", verifyUnique, signUp);
router.post("/verify-user", verifyOtp, activation);
router.post("/request-otp", requestOtp);

module.exports = router;
