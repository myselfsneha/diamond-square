const express = require("express");
const router = express.Router();

const { register, loginUser } = require("../controllers/authController");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", loginUser);

module.exports = router;