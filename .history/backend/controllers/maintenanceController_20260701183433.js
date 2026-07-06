const db = require("../config/db");

// ==============================
// Admin - Get All Maintenance Bills
// ==============================
exports.getAllMaintenance = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        m.*,
        u.name,
        u.flat_number
      FROM maintenance m
      JOIN users u
        ON m.user_id = u.id
      ORDER BY m.year DESC, m.month DESC
    `);

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Resident - Get My Bills
// ==============================
exports.getMyMaintenance = async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT
        *
      FROM maintenance
      WHERE user_id = ?
      ORDER BY year DESC, month DESC
      `,
      [req.user.id]
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Admin - Create Bill
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
        message: "Required fields are missing",
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        remarks || "",
      ]
    );

    res.status(201).json({
      message: "Maintenance bill created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Admin - Update Bill
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

    const [[bill]] = await db.query(
      `
      SELECT amount_paid
      FROM maintenance
      WHERE id = ?
      `,
      [id]
    );

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    const amountPaid = Number(bill.amount_paid);

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
        maintenance_amount=?,
        water_charges=?,
        other_charges=?,
        total_amount=?,
        balance=?,
        status=?,
        due_date=?,
        remarks=?
      WHERE id=?
      `,
      [
        maintenance,
        water,
        other,
        total,
        balance,
        status,
        due_date,
        remarks || "",
        id,
      ]
    );

    res.json({
      message: "Bill updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Admin - Mark Payment
// ==============================
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const { amount_paid } = req.body;

    const [[bill]] = await db.query(
      `
      SELECT total_amount
      FROM maintenance
      WHERE id=?
      `,
      [id]
    );

    if (!bill) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    const paid = Number(amount_paid);

    let balance = Number(bill.total_amount) - paid;

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
        amount_paid=?,
        balance=?,
        status=?,
        payment_date=CURDATE()
      WHERE id=?
      `,
      [
        paid,
        balance,
        status,
        id,
      ]
    );

    res.json({
      message: "Payment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Admin - Delete Bill
// ==============================
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM maintenance
      WHERE id=?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Bill not found",
      });
    }

    res.json({
      message: "Maintenance bill deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};