const crypto = require("crypto");

function generateOTP() {
  const otp = crypto.randomBytes(3).toString("hex");
  const numericOtp = parseInt(otp, 16).toString().slice(0, 6);
  return numericOtp.padStart(6, "0");
}

module.exports = { generateOTP };
