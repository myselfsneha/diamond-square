const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
  role: { type: String, default: "resident" }
});

module.exports = mongoose.model("User", schema);