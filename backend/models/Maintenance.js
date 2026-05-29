const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true, index: true },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid", index: true },
    paidAt: Date,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: String,
  },
  { timestamps: true }
);

maintenanceSchema.index({ flat: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
