const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const User = require("../models/User");

async function main() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD, MONGO_URL } = process.env;
  if (!MONGO_URL || !ADMIN_NAME || !ADMIN_PHONE || !ADMIN_PASSWORD) {
    throw new Error("MONGO_URL, ADMIN_NAME, ADMIN_PHONE, and ADMIN_PASSWORD are required");
  }
  await mongoose.connect(MONGO_URL);
  const existing = await User.findOne({ phone: ADMIN_PHONE });
  if (existing) {
    existing.name = ADMIN_NAME;
    existing.email = ADMIN_EMAIL || existing.email;
    existing.role = "admin";
    existing.status = "active";
    existing.password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await existing.save();
    console.log(`Updated admin ${ADMIN_PHONE}`);
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, phone: ADMIN_PHONE, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: "admin", status: "active" });
    console.log(`Created admin ${ADMIN_PHONE}`);
  }
  await mongoose.disconnect();
}

main().catch(error => { console.error(error); process.exit(1); });
