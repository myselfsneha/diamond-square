const router = require("express").Router();
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const { verifyToken, isAdmin } = require("../middleware/auth");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE ORDER
router.post("/create-order", verifyToken, async (req, res) => {
  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR"
  });

  res.json(order);
});

// SAVE PAYMENT
router.post("/", verifyToken, async (req, res) => {
  await Payment.create({
    user: req.user.id,
    amount: req.body.amount,
    status: "paid"
  });

  res.json({ message: "Payment saved" });
});

// ADMIN VIEW
router.get("/", verifyToken, isAdmin, async (req, res) => {
  const data = await Payment.find().populate("user");
  res.json(data);
});

module.exports = router;