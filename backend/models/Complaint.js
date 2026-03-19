const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);