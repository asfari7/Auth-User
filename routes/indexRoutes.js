const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");

const apiURL = "/api/v1";

router.use(apiURL, authRoutes);

module.exports = router;
