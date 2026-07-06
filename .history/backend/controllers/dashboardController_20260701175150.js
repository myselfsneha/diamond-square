const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [[members]] = await db.query(`
      SELECT COUNT(*) AS totalMembers
      FROM users
      WHERE role='resident'
    `);

    const [[pending]] = await db.query(`
      SELECT COUNT(*) AS pendingApprovals
      FROM users
      WHERE approval_status='pending'
    `);

    const [[complaints]] = await db.query(`
      SELECT COUNT(*) AS totalComplaints
      FROM complaints
    `);

    const [[resolved]] = await db.query(`
      SELECT COUNT(*) AS resolvedComplaints
      FROM complaints
      WHERE status='Resolved'
    `);

    const [[events]] = await db.query(`
      SELECT COUNT(*) AS totalEvents
      FROM events
    `);

    const [[polls]] = await db.query(`
      SELECT COUNT(*) AS totalPolls
      FROM polls
    `);

    const [[guards]] = await db.query(`
      SELECT COUNT(*) AS totalGuards
      FROM guards
    `);

    const [[notices]] = await db.query(`
      SELECT COUNT(*) AS totalNotices
      FROM notices
    `);

    const [recentComplaints] = await db.query(`
      SELECT
        c.id,
        c.title,
        c.status,
        c.created_at,
        u.name
      FROM complaints c
      JOIN users u
        ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    const [recentResidents] = await db.query(`
      SELECT
        id,
        name,
        phone,
        flat_number,
        approval_status,
        created_at
      FROM users
      WHERE role='resident'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const [upcomingEvents] = await db.query(`
      SELECT
        id,
        title,
        event_date
      FROM events
      WHERE event_date >= CURDATE()
      ORDER BY event_date ASC
      LIMIT 5
    `);
        const [recentNotices] = await db.query(`
      SELECT
        id,
        title,
        created_at
      FROM notices
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const activity = [
      {
        type: "Residents",
        value: members.totalMembers,
      },
      {
        type: "Pending",
        value: pending.pendingApprovals,
      },
      {
        type: "Complaints",
        value: complaints.totalComplaints,
      },
      {
        type: "Events",
        value: events.totalEvents,
      },
      {
        type: "Polls",
        value: polls.totalPolls,
      },
      {
        type: "Guards",
        value: guards.totalGuards,
      },
    ];

    res.json({
      totalMembers: members.totalMembers,
      pendingApprovals: pending.pendingApprovals,
      totalComplaints: complaints.totalComplaints,
      resolvedComplaints: resolved.resolvedComplaints,
      totalEvents: events.totalEvents,
      totalPolls: polls.totalPolls,
      totalGuards: guards.totalGuards,
      totalNotices: notices.totalNotices,

      recentComplaints,
      recentResidents,
      upcomingEvents,
      recentNotices,
      activity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// Resident Dashboard
exports.getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[resident]] = await db.query(
      `
      SELECT
        name,
        flat_number,
        approval_status
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    const [[complaints]] = await db.query(
      `
      SELECT COUNT(*) AS totalComplaints
      FROM complaints
      WHERE user_id = ?
      `,
      [userId]
    );

    const [[resolved]] = await db.query(
      `
      SELECT COUNT(*) AS resolvedComplaints
      FROM complaints
      WHERE user_id = ?
        AND status = 'Resolved'
      `,
      [userId]
    );

    const [recentComplaints] = await db.query(
      `
      SELECT
        id,
        title,
        status,
        created_at
      FROM complaints
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    const [upcomingEvents] = await db.query(`
      SELECT
        id,
        title,
        event_date,
        location
      FROM events
      WHERE event_date >= CURDATE()
      ORDER BY event_date ASC
      LIMIT 5
    `);

    const [latestNotices] = await db.query(`
      SELECT
        id,
        title,
        created_at
      FROM notices
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      resident,
      totalComplaints: complaints.totalComplaints,
      resolvedComplaints: resolved.resolvedComplaints,
      pendingComplaints:
        complaints.totalComplaints - resolved.resolvedComplaints,
      recentComplaints,
      upcomingEvents,
      latestNotices,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};