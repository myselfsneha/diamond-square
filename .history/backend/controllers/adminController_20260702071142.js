// =============================================================
// Admin Controller
// File: controllers/adminController.js
//
// Description:
// Handles all admin-related operations.
//
// Features Included:
// ✔ Pending resident approval
// ✔ Approve resident
// ✔ Reject resident
// ✔ Pending statistics
// ✔ Better error handling
// ✔ Detailed comments
//
// Diamond Square
// =============================================================

const db = require("../config/db");

/**
 * =============================================================
 * Get All Pending Residents
 * -------------------------------------------------------------
 * Returns every resident whose registration
 * is waiting for admin approval.
 * =============================================================
 */
exports.getPendingUsers = async (req, res) => {
  try {

    const [users] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        role,
        approval_status,
        profile_image,
        created_at
      FROM users
      WHERE approval_status = 'pending'
      ORDER BY created_at ASC
    `);

    return res.status(200).json({
      success: true,
      total: users.length,
      users
    });

  } catch (error) {

    console.error("Get Pending Users:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch pending residents.",
      error: error.message
    });

  }
};

/**
 * =============================================================
 * Get Pending Resident Count
 * -------------------------------------------------------------
 * Dashboard card helper.
 * =============================================================
 */
exports.getPendingCount = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE approval_status='pending'
    `);

    return res.json({
      success: true,
      total: rows[0].total
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Approve Resident
 * -------------------------------------------------------------
 * Changes approval status from Pending
 * to Approved.
 * =============================================================
 */
exports.approveUser = async (req, res) => {

  try {

    const { id } = req.params;

    // Check if resident exists
    const [user] = await db.query(
      `
      SELECT *
      FROM users
      WHERE id=?
      `,
      [id]
    );

    if (!user.length) {

      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });

    }

    // Already approved
    if (user[0].approval_status === "approved") {

      return res.status(400).json({
        success: false,
        message: "Resident already approved."
      });

    }

    // Approve resident
    await db.query(
      `
      UPDATE users
      SET approval_status='approved'
      WHERE id=?
      `,
      [id]
    );

    // Future:
    // Send notification
    // Send email
    // Send welcome message

    return res.json({
      success: true,
      message: "Resident approved successfully."
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Reject Resident
 * -------------------------------------------------------------
 * Instead of deleting immediately,
 * mark registration as rejected.
 *
 * Later we can allow resident
 * to edit details and reapply.
 * =============================================================
 */
exports.rejectUser = async (req, res) => {

  try {

    const { id } = req.params;

    const { reason } = req.body;

    const [user] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id=?
      `,
      [id]
    );

    if (!user.length) {

      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });

    }

    await db.query(
      `
      UPDATE users
      SET
        approval_status='rejected',
        rejection_reason=?
      WHERE id=?
      `,
      [
        reason || "Rejected by admin.",
        id
      ]
    );

    return res.json({
      success: true,
      message: "Resident registration rejected."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Get All Residents
 * -------------------------------------------------------------
 * Returns all registered residents.
 *
 * Supports:
 * ✔ Search
 * ✔ Filter
 * ✔ Alphabetical sorting
 * =============================================================
 */
exports.getAllResidents = async (req, res) => {
  try {

    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";

    let query = `
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        profile_image,
        role,
        approval_status,
        created_at
      FROM users
      WHERE 1 = 1
    `;

    const params = [];

    // Search by name/email/flat
    if (search) {
      query += `
        AND (
          name LIKE ?
          OR email LIKE ?
          OR flat_number LIKE ?
        )
      `;

      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword);
    }

    // Filter by Owner / Tenant
    if (role) {
      query += ` AND role = ? `;
      params.push(role);
    }

    // Filter by approval status
    if (status) {
      query += ` AND approval_status = ? `;
      params.push(status);
    }

    query += `
      ORDER BY
      name ASC
    `;

    const [users] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      total: users.length,
      users
    });

  } catch (error) {

    console.error("Get Residents:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/**
 * =============================================================
 * Get Resident By ID
 * -------------------------------------------------------------
 * Returns complete resident information.
 * =============================================================
 */
exports.getResidentById = async (req, res) => {

  try {

    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT
        *
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (!users.length) {

      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });

    }

    return res.json({
      success: true,
      resident: users[0]
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Update Resident
 * -------------------------------------------------------------
 * Allows admin to update resident information.
 * =============================================================
 */
exports.updateResident = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      email,
      phone,
      flat_number
    } = req.body;

    const [user] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (!user.length) {

      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });

    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        flat_number = ?
      WHERE id = ?
      `,
      [
        name?.trim(),
        email?.trim(),
        phone?.trim(),
        flat_number?.trim(),
        id
      ]
    );

    return res.json({
      success: true,
      message: "Resident updated successfully."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Delete Resident
 * -------------------------------------------------------------
 * Deletes resident permanently.
 * Admin accounts cannot be deleted.
 * =============================================================
 */
exports.deleteResident = async (req, res) => {

  try {

    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT
        role
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (!users.length) {

      return res.status(404).json({
        success: false,
        message: "Resident not found."
      });

    }

    if (users[0].role === "admin") {

      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted."
      });

    }

    await db.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Resident deleted successfully."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Suspend / Activate Resident
 * -------------------------------------------------------------
 * Temporarily disables or enables resident access
 * without deleting the account.
 * =============================================================
 */
exports.toggleResidentStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { is_active } = req.body;

    await db.query(
      `
      UPDATE users
      SET is_active = ?
      WHERE id = ?
      `,
      [
        is_active,
        id
      ]
    );

    return res.json({
      success: true,
      message: is_active
        ? "Resident activated successfully."
        : "Resident suspended successfully."
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/**
 * =============================================================
 * Dashboard Statistics
 * -------------------------------------------------------------
 * Returns overall dashboard counts for the Admin panel.
 *
 * Includes:
 * ✔ Total Residents
 * ✔ Pending Approvals
 * ✔ Approved Residents
 * ✔ Rejected Residents
 * ✔ Total Owners
 * ✔ Total Tenants
 * ✔ Active Residents
 * =============================================================
 */
exports.getDashboardStats = async (req, res) => {
  try {

    const [[residentStats]] = await db.query(`
      SELECT
        COUNT(*) AS totalResidents,

        SUM(
          CASE
            WHEN approval_status = 'pending'
            THEN 1 ELSE 0
          END
        ) AS pendingResidents,

        SUM(
          CASE
            WHEN approval_status = 'approved'
            THEN 1 ELSE 0
          END
        ) AS approvedResidents,

        SUM(
          CASE
            WHEN approval_status = 'rejected'
            THEN 1 ELSE 0
          END
        ) AS rejectedResidents,

        SUM(
          CASE
            WHEN role = 'owner'
            THEN 1 ELSE 0
          END
        ) AS owners,

        SUM(
          CASE
            WHEN role = 'tenant'
            THEN 1 ELSE 0
          END
        ) AS tenants,

        SUM(
          CASE
            WHEN is_active = 1
            THEN 1 ELSE 0
          END
        ) AS activeResidents
      FROM users
    `);

    return res.status(200).json({
      success: true,
      stats: residentStats,
    });

  } catch (error) {

    console.error("Dashboard Stats:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * =============================================================
 * Recent Registrations
 * -------------------------------------------------------------
 * Returns latest registered residents.
 * Used on Admin Dashboard.
 * =============================================================
 */
exports.getRecentRegistrations = async (req, res) => {
  try {

    const limit = Number(req.query.limit) || 10;

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        flat_number,
        role,
        approval_status,
        profile_image,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ?
      `,
      [limit]
    );

    return res.json({
      success: true,
      total: users.length,
      users,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * =============================================================
 * Today's Birthdays
 * -------------------------------------------------------------
 * Returns all residents whose birthday is today.
 *
 * Future:
 * - Include family members
 * - Send automatic notifications
 * =============================================================
 */
exports.getTodaysBirthdays = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        name,
        flat_number,
        profile_image,
        dob
      FROM users
      WHERE
        approval_status = 'approved'
        AND dob IS NOT NULL
        AND DAY(dob) = DAY(CURDATE())
        AND MONTH(dob) = MONTH(CURDATE())
      ORDER BY name ASC
    `);

    return res.json({
      success: true,
      total: rows.length,
      birthdays: rows,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * =============================================================
 * Today's Anniversaries
 * -------------------------------------------------------------
 * Returns all residents celebrating
 * their wedding anniversary today.
 * =============================================================
 */
exports.getTodaysAnniversaries = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        name,
        flat_number,
        anniversary_date
      FROM users
      WHERE
        approval_status = 'approved'
        AND anniversary_date IS NOT NULL
        AND DAY(anniversary_date) = DAY(CURDATE())
        AND MONTH(anniversary_date) = MONTH(CURDATE())
      ORDER BY name ASC
    `);

    return res.json({
      success: true,
      total: rows.length,
      anniversaries: rows,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * =============================================================
 * Profile Completion Report
 * -------------------------------------------------------------
 * Shows residents whose profiles are incomplete.
 * Useful for admin follow-up.
 * =============================================================
 */
exports.getIncompleteProfiles = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        flat_number
      FROM users
      WHERE
        profile_completed = 0
      ORDER BY name ASC
    `);

    return res.json({
      success: true,
      total: rows.length,
      residents: rows,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * =============================================================
 * Future Diamond Square Features
 * -------------------------------------------------------------
 * Planned additions:
 *
 * ✔ Visitor Pass Approval
 * ✔ Maintenance Bill Management
 * ✔ Complaint Analytics
 * ✔ Parking Management
 * ✔ Vehicle Approval
 * ✔ Family Member Approval
 * ✔ Notice Management
 * ✔ Event Management
 * ✔ Polls & Voting
 * ✔ Push Notifications
 * ✔ Email Notifications
 * ✔ Audit Logs
 * ✔ Activity Timeline
 * ✔ Export Reports (PDF/Excel)
 * =============================================================
 */