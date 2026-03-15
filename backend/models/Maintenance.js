const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    flatNumber: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);