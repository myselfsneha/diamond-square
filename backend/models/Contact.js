const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["electrician", "plumber", "lift_operator", "society_manager", "security", "other"],
      required: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    active: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
