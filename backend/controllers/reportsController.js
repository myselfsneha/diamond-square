const db = require("../config/db");

exports.getReports = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Total residents
    const residentsResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM users
       WHERE role = 'resident'`
    );

    // Maintenance statistics
    const maintenanceResult = await db.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE payment_status = 'Paid')::int AS paid,
        COUNT(*) FILTER (WHERE payment_status = 'Pending')::int AS pending
      FROM maintenance
      WHERE EXTRACT(YEAR FROM created_at) = $1
      `,
      [year]
    );

    // Complaint statistics
    const complaintsResult = await db.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Resolved')::int AS resolved,
        COUNT(*) FILTER (WHERE status <> 'Resolved')::int AS pending
      FROM complaints
      WHERE EXTRACT(YEAR FROM created_at) = $1
      `,
      [year]
    );

    // Monthly maintenance collection
    // Monthly maintenance collection
const monthlyResult = await db.query(
  `
  SELECT
    month,
    COALESCE(SUM(amount_paid), 0)::float AS amount
  FROM maintenance
  WHERE payment_status = 'Paid'
    AND year = $1
  GROUP BY month
  ORDER BY
    CASE month
      WHEN 'January' THEN 1
      WHEN 'February' THEN 2
      WHEN 'March' THEN 3
      WHEN 'April' THEN 4
      WHEN 'May' THEN 5
      WHEN 'June' THEN 6
      WHEN 'July' THEN 7
      WHEN 'August' THEN 8
      WHEN 'September' THEN 9
      WHEN 'October' THEN 10
      WHEN 'November' THEN 11
      WHEN 'December' THEN 12
    END
  `,
  [year]
);

    return res.status(200).json({
      success: true,
      year,
      totalResidents: residentsResult.rows[0].total,
      totalMaintenance: maintenanceResult.rows[0].total,
      paidMaintenance: maintenanceResult.rows[0].paid,
      pendingMaintenance: maintenanceResult.rows[0].pending,
      totalComplaints: complaintsResult.rows[0].total,
      resolvedComplaints: complaintsResult.rows[0].resolved,
      pendingComplaints: complaintsResult.rows[0].pending,
      monthlyCollection: monthlyResult.rows,
    });
  } catch (err) {
    console.error("Report Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: err.message,
    });
  }
};