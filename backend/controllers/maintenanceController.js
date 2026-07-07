const db = require("../config/db");

// ==============================
// Get All Maintenance
// ==============================
exports.getAllMaintenance = async (req, res) => {
  try {
    const { rows: maintenance } = await db.query(`
      SELECT
        m.*,
        u.name,
        u.flat_number
      FROM maintenance m
      JOIN users u
        ON m.user_id = u.id
      ORDER BY m.year DESC, m.month DESC
    `);

    return res.status(200).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    console.error("Get All Maintenance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get My Maintenance
// ==============================
exports.getMyMaintenance = async (req, res) => {
  try {
    const { rows: maintenance } = await db.query(
      `
      SELECT *
      FROM maintenance
      WHERE user_id = $1
      ORDER BY year DESC, month DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      maintenance,
    });
  } catch (error) {
    console.error("Get My Maintenance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Maintenance
// ==============================
exports.createMaintenance = async (req, res) => {
  try {
    const {
      user_id,
      month,
      year,
      maintenance_amount,
      water_charges,
      other_charges,
      due_date,
      remarks,
    } = req.body;

    if (
      !user_id ||
      !month ||
      !year ||
      maintenance_amount == null ||
      !due_date
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const maintenance = Number(maintenance_amount) || 0;
    const water = Number(water_charges) || 0;
    const other = Number(other_charges) || 0;
    const total = maintenance + water + other;

    await db.query(
      `
      INSERT INTO maintenance
      (
        user_id,
        month,
        year,
        maintenance_amount,
        water_charges,
        other_charges,
        total_amount,
        amount_paid,
        balance,
        status,
        due_date,
        remarks
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `,
      [
        user_id,
        month,
        year,
        maintenance,
        water,
        other,
        total,
        0,
        total,
        "Pending",
        due_date,
        remarks?.trim() || "",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Maintenance bill created successfully.",
    });
  } catch (error) {
    console.error("Create Maintenance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Maintenance
// ==============================
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      maintenance_amount,
      water_charges,
      other_charges,
      due_date,
      remarks,
    } = req.body;

    const maintenance = Number(maintenance_amount) || 0;
    const water = Number(water_charges) || 0;
    const other = Number(other_charges) || 0;
    const total = maintenance + water + other;

    const { rows } = await db.query(
      `
      SELECT amount_paid
      FROM maintenance
      WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Maintenance bill not found.",
      });
    }

    const amountPaid = Number(rows[0].amount_paid);
    let balance = total - amountPaid;
    let status = "Pending";

    if (balance <= 0) {
      balance = 0;
      status = "Paid";
    } else if (amountPaid > 0) {
      status = "Partially Paid";
    }

    await db.query(
      `
      UPDATE maintenance
      SET
        maintenance_amount = $1,
        water_charges = $2,
        other_charges = $3,
        total_amount = $4,
        balance = $5,
        status = $6,
        due_date = $7,
        remarks = $8
      WHERE id = $9
      `,
      [
        maintenance,
        water,
        other,
        total,
        balance,
        status,
        due_date,
        remarks?.trim() || "",
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Maintenance bill updated successfully.",
    });
  } catch (error) {
    console.error("Update Maintenance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Mark Maintenance Paid
// ==============================
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_paid } = req.body;

    const { rows } = await db.query(
      `
      SELECT total_amount
      FROM maintenance
      WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Maintenance bill not found.",
      });
    }

    const paid = Number(amount_paid) || 0;

    let balance = Number(rows[0].total_amount) - paid;
    let status = "Pending";

    if (balance <= 0) {
      balance = 0;
      status = "Paid";
    } else if (paid > 0) {
      status = "Partially Paid";
    }

    await db.query(
      `
      UPDATE maintenance
      SET
        amount_paid = $1,
        balance = $2,
        status = $3,
        payment_date = CURRENT_DATE
      WHERE id = $4
      `,
      [
        paid,
        balance,
        status,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully.",
    });
  } catch (error) {
    console.error("Mark Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Maintenance
// ==============================
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM maintenance
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Maintenance bill not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Maintenance bill deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Maintenance Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};