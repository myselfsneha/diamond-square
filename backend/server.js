const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map(origin => origin.trim());

app.use(helmet());
app.use(cors({ origin: (origin, cb) => !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")), credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "Diamond Square API" }));
app.use("/api", require("./routes/platform"));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "Duplicate record", fields: err.keyValue });
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const start = async () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required");
  await mongoose.connect(process.env.MONGO_URL);
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Diamond Square API running on ${port}`));
};

if (require.main === module) start().catch(error => { console.error(error); process.exit(1); });
module.exports = app;
