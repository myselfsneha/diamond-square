const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String
});

module.exports = mongoose.model("Payment", schema);