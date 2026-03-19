const router = require("express").Router();
const Payment = require("../models/Payment");
const { verifyToken, isAdmin } = require("../middleware/auth");
const Razorpay = require("razorpay");

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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE ORDER
router.post("/create-order", verifyToken, async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // paise
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);

  res.json(order);
});

module.exports = router;