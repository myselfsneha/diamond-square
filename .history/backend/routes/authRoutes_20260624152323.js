const express = require("express");

const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

console.log("✅ AUTH ROUTES LOADED");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working",
  });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;