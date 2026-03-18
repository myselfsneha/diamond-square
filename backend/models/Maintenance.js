const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);