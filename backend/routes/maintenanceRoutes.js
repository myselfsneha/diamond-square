const express = require("express");
const router = express.Router();

const {
  addMaintenance,
  getMaintenance,
  markPaid
} = require("../controllers/maintenanceController");

router.post("/add", addMaintenance);
router.get("/", getMaintenance);
router.patch("/pay/:id", markPaid);

module.exports = router;