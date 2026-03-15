const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    flatNumber: {
      type: String,
      required: true
    },
    entryTime: {
      type: Date
    },
    exitTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ["expected", "inside", "exited"],
      default: "expected"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);