require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*"}));
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/complaints", require("./routes/complaint"));
app.use("/api/notices", require("./routes/notice"));
app.use("/api/maintenance", require("./routes/maintenance"));
app.use("/api/complaints", require("./routes/complaint"));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SERVER
app.listen(process.env.PORT, () => {
  console.log("Server running");
});