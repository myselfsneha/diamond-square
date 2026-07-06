const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPendingUsers,
  approveUser
} = require("../controllers/adminController");

router.get(
  "/pending-users",
  authMiddleware,
  adminMiddleware,
  getPendingUsers
);

router.put(
  "/approve-user/:id",
  authMiddleware,
  adminMiddleware,
  approveUser
);

module.exports = router;