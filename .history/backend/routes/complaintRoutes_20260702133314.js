const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

// Resident
router.post(
  "/",
  authMiddleware,
  createComplaint
);

router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

router.get(
  "/:id",
  authMiddleware,
  getComplaintById
);

// Admin
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllComplaints
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateComplaintStatus
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteComplaint
);

module.exports = router;

exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM complaints
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};