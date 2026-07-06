require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const contactRoutes = require("./routes/contactRoutes");
const eventRoutes = require("./routes/eventRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const guardRoutes = require("./routes/guardRoutes");
const documentRoutes = require("./routes/documentRoutes");
const pollRoutes = require("./routes/pollRoutes");
const pollVoteRoutes = require("./routes/pollVoteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const residentDashboardRoutes = require("./routes/residentDashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.send("Diamond Square API Running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/guards", guardRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/resident-polls", pollVoteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resident-dashboard", residentDashboardRoutes);
app.use("/api/settings", settingsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});