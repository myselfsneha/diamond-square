const router = require("express").Router();
const Payment = require("../models/Payment");
const { verifyToken, isAdmin } = require("../middleware/auth");

// USER PAY
router.post("/", verifyToken, async (req, res) => {
  const payment = await Payment.create({
    user: req.user.id,
    amount: req.body.amount
  });

  res.json({ message: "Payment recorded", payment });
});

// ADMIN VIEW ALL
router.get("/", verifyToken, isAdmin, async (req, res) => {
  const data = await Payment.find().populate("user");
  res.json(data);
});

module.exports = router;