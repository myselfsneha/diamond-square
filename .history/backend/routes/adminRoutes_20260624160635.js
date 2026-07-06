const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  getAllResidents,
  deleteResident,
} = require("../controllers/adminController");

router.get("/pending-users", getPendingUsers);
router.put("/approve/:id", approveUser);

router.get("/residents", getAllResidents);
router.delete("/residents/:id", deleteResident);

module.exports = router;