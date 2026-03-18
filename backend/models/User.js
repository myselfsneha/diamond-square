const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    flatNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["resident", "admin"],
      default: "resident",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);