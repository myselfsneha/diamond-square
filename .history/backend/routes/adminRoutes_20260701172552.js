const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  getAllResidents,
  deleteResident,
} = require("../controllers/adminController");

// Pending Approvals
router.get("/pending-users", getPendingUsers);
router.put("/approve-user/:id", approveUser);

// Residents
router.get("/residents", getAllResidents);
router.delete("/residents/:id", deleteResident);

module.exports = router;