const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    flatNumber: { type: String, required: true, unique: true, trim: true },
    floor: { type: String, trim: true },
    maintenanceAmount: { type: Number, required: true, min: 0, default: 0 },
    ownerName: { type: String, trim: true },
    tenantName: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    birthday: Date,
    anniversary: Date,
    residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flat", flatSchema);
