require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");


// CONNECT DB
connectDB();

// ✅ SIMPLE CORS (ENOUGH)
app.use(cors());

// BODY PARSER
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Diamond Square Backend Running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});