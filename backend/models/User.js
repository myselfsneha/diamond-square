const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: String, unique: true },
  password: String,
  role: { type: String, default: "resident" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);