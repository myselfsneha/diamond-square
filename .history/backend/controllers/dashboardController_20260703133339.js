const db = require("../config/db");

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
      // Total Residents
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
      `),

      // Pending Approvals
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
          AND approval_status = 'pending'
      `),

      // Complaints
      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
      `),

      // Resolved Complaints
      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE status='Resolved'
      `),

      // Events
      db.query(`
        SELECT COUNT(*) AS total
        FROM events
      `),

      // Polls
      db.query(`
        SELECT COUNT(*) AS total
        FROM polls
      `),

      // Guards
      db.query(`
        SELECT COUNT(*) AS total
        FROM guards
      `),

      // Notices
      db.query(`
        SELECT COUNT(*) AS total
        FROM notices
      `),

      // Recent Complaints
      db.query(`
        SELECT
          c.id,
          c.title,
          c.status,
          c.created_at,
          u.name
        FROM complaints c
        LEFT JOIN users u
          ON c.resident_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `),

      // Recent Residents
      db.query(`
        SELECT
          id,
          name,
          flat_number,
          phone,
          approval_status
        FROM users
        WHERE role='resident'
        ORDER BY id DESC
        LIMIT 5
      `),

      // Upcoming Events
      db.query(`
        SELECT
          id,
          title,
          location,
          event_date
        FROM events
        WHERE event_date >= CURDATE()
        ORDER BY event_date ASC
        LIMIT 5
      `),
    ]);

    res.status(200).json({
      totalMembers: members[0][0].total,
      pendingApprovals: pending[0][0].total,
      totalComplaints: complaints[0][0].total,
      resolvedComplaints: resolved[0][0].total,
      totalEvents: events[0][0].total,
      totalPolls: polls[0][0].total,
      totalGuards: guards[0][0].total,
      totalNotices: notices[0][0].total,

      recentComplaints: recentComplaints[0],
      recentResidents: recentResidents[0],
      upcomingEvents: upcomingEvents[0],
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