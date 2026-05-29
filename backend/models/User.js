const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
    phone: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "resident"], default: "resident", index: true },
    status: {
      type: String,
      enum: ["pending_otp", "pending_approval", "active", "rejected"],
      default: "pending_otp",
      index: true,
    },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat" },
    residentType: { type: String, enum: ["owner", "tenant"], default: "owner" },
    birthday: Date,
    anniversary: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
