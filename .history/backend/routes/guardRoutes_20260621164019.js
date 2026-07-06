const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getGuards,
  createGuard,
  deleteGuard,
} = require("../controllers/guardController");

router.get(
  "/",
  authMiddleware,
  getGuards
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createGuard
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteGuard
);

module.exports = router;