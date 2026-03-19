const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/complaints", require("./routes/complaint"));
app.use("/api/payments", require("./routes/payment"));

app.listen(process.env.PORT, () =>
  console.log("Server running")
);