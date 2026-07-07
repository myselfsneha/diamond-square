const db = require("../config/db");

// ==============================
// Admin Dashboard
// ==============================
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      members,
      pending,
      complaints,
      resolved,
      events,
      polls,
      guards,
      notices,
      recentComplaints,
      recentResidents,
      upcomingEvents,
    ] = await Promise.all([
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
          AND approval_status = 'pending'
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE status = 'Resolved'
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM events
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM polls
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM guards
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM notices
      `),

      db.query(`
        SELECT
          c.id,
          c.title,
          c.status,
          c.created_at,
          u.name
        FROM complaints c
        LEFT JOIN users u
          ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
          id,
          name,
          flat_number,
          phone,
          approval_status
        FROM users
        WHERE role = 'resident'
        ORDER BY id DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
          id,
          title,
          location,
          event_date
        FROM events
        WHERE event_date >= CURRENT_DATE
        ORDER BY event_date ASC
        LIMIT 5
      `),
    ]);

    res.status(200).json({
      totalMembers: members.rows[0].total,
      pendingApprovals: pending.rows[0].total,
      totalComplaints: complaints.rows[0].total,
      resolvedComplaints: resolved.rows[0].total,
      totalEvents: events.rows[0].total,
      totalPolls: polls.rows[0].total,
      totalGuards: guards.rows[0].total,
      totalNotices: notices.rows[0].total,

      recentComplaints: recentComplaints.rows,
      recentResidents: recentResidents.rows,
      upcomingEvents: upcomingEvents.rows,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      success: false,
      message: "Dashboard loading failed",
      error: err.message,
    });
  }
};

// ==============================
// Resident Dashboard
// ==============================
exports.getResidentDashboard = async (req, res) => {
  try {
    const residentId = req.user.id;

    const { rows: residentRows } = await db.query(
      `
      SELECT
        id,
        name,
        flat_number,
        approval_status
      FROM users
      WHERE id = $1
      `,
      [residentId]
    );

    const resident = residentRows[0];

    const { rows: totalComplaintRows } = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM complaints
      WHERE user_id = $1
      `,
      [residentId]
    );

    const { rows: resolvedComplaintRows } = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM complaints
      WHERE user_id = $1
      AND status = 'Resolved'
      `,
      [residentId]
    );

    const { rows: pendingComplaintRows } = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM complaints
      WHERE user_id = $1
      AND status != 'Resolved'
      `,
      [residentId]
    );

    const { rows: recentComplaints } = await db.query(
      `
      SELECT
        id,
        title,
        status,
        created_at
      FROM complaints
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [residentId]
    );

    const { rows: upcomingEvents } = await db.query(
      `
      SELECT
        id,
        title,
        location,
        event_date
      FROM events
      WHERE event_date >= CURRENT_DATE
      ORDER BY event_date ASC
      LIMIT 5
      `
    );

    const { rows: latestNotices } = await db.query(
      `
      SELECT
        id,
        title,
        created_at
      FROM notices
      ORDER BY created_at DESC
      LIMIT 5
      `
    );

    return res.status(200).json({
      resident,
      totalComplaints: totalComplaintRows[0].total,
      resolvedComplaints: resolvedComplaintRows[0].total,
      pendingComplaints: pendingComplaintRows[0].total,
      recentComplaints,
      upcomingEvents,
      latestNotices,
    });
  } catch (err) {
    console.error("Resident Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Admin Dashboard Alias
// ==============================
exports.getAdminDashboard = exports.getDashboardStats;