const router = require("express").Router();
const Razorpay = require("razorpay");
const { verifyToken } = require("../middleware/auth");
const Payment = require("../models/Payment");

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

router.post("/create-order", verifyToken, async (req, res) => {
  const order = await rzp.orders.create({
    amount: req.body.amount * 100,
    currency: "INR"
  });
  res.json(order);
});

router.post("/", verifyToken, async (req, res) => {
  await Payment.create({
    user: req.user.id,
    amount: req.body.amount,
    status: "paid"
  });
  res.json({ msg: "Saved" });
});

module.exports = router;