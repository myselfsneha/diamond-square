const db = require("../config/db");

// Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO complaints
      (user_id, title, description, status)
      VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description,
        "Pending",
      ]
    );

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Resident - My Complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT *
       FROM complaints
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - All Complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT
        c.*,
        u.name,
        u.phone
       FROM complaints c
       JOIN users u
         ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - Update Complaint Status
exports.updateComplaintStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const [result] = await db.query(
      `UPDATE complaints
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message:
        "Complaint status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};