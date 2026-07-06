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
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role='resident'
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role='resident'
        AND approval_status='pending'
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
      `),

      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE status='Resolved'
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
          ON c.resident_id = u.id
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
        WHERE role='resident'
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
        WHERE event_date >= CURDATE()
        ORDER BY event_date ASC
        LIMIT 5
      `),
    ]);

    res.json({
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
    console.error(err);
    res.status(500).json({
      message: "Dashboard loading failed",
      error: err.message,
    });
  }
};