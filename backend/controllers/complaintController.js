const db = require("../config/db");

// ==============================
// Create Complaint
// ==============================
exports.createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const { rows } = await db.query(
      `
      INSERT INTO complaints
      (user_id, title, description, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        req.user.id,
        title,
        description,
        "Pending",
      ]
    );

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: rows[0].id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get My Complaints
// ==============================
exports.getMyComplaints = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT *
      FROM complaints
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Single Complaint
// ==============================
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(
      `
      SELECT
        c.*,
        u.name,
        u.phone,
        u.flat_number
      FROM complaints c
      JOIN users u
        ON c.user_id = u.id
      WHERE c.id = $1
      `,
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

// ==============================
// Get All Complaints
// ==============================
exports.getAllComplaints = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        c.*,
        u.name,
        u.phone,
        u.flat_number
      FROM complaints c
      JOIN users u
        ON c.user_id = u.id
      ORDER BY c.created_at DESC
      `
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Complaint Status
// ==============================
exports.updateComplaintStatus = async (req, res) => {
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

    const result = await db.query(
      `
      UPDATE complaints
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Complaint status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Complaint
// ==============================
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM complaints
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};