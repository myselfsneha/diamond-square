require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");
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
const notificationRoutes =
  require("./routes/notificationRoutes");
const dashboardRoutes =
  require("./routes/dashboardRoutes");
const residentDashboardRoutes = require("./routes/residentDashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Diamond Square API Running");
});

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
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/resident-dashboard",
  residentDashboardRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});