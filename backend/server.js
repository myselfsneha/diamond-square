require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// CONNECT DATABASE
connectDB();

// ✅ VERY IMPORTANT CORS FIX
app.use(cors({
  origin: "*",
}));

// ✅ HANDLE PREFLIGHT (THIS FIXES YOUR EXACT ERROR)
app.options("*", cors());

// BODY PARSER
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notifications", notificationRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Diamond Square Backend Running 🚀");
});

// ✅ RENDER PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});