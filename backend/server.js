const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaint"));

app.listen(5000, () => console.log("Server running"));