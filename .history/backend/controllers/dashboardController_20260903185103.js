const db = require("../config/db");

// ==============================
// Admin Dashboard
// ==============================
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      residents,
      pendingApprovals,
      complaints,
      notices,
      events,
      visitors,
      maintenanceDue,
      guards,
      recentComplaints,
      recentResidents,
      upcomingEvents,
    ] = await Promise.all([

      // Registered residents
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
      `),

      // Pending approvals
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'resident'
        AND approval_status = 'pending'
      `),

      // Open complaints
      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE status != 'Resolved'
      `),

      // Active notices
      db.query(`
        SELECT COUNT(*) AS total
        FROM notices
      `),

      // Upcoming events
      db.query(`
        SELECT COUNT(*) AS total
        FROM events
        WHERE event_date >= CURRENT_DATE
      `),

      // Visitors today
      db.query(`
        SELECT COUNT(*) AS total
        FROM visitors
        WHERE DATE(created_at) = CURRENT_DATE
      `),

      // Pending maintenance
      db.query(`
        SELECT COUNT(*) AS total
        FROM maintenance
        WHERE status = 'Pending'
      `),

      // Guards
      db.query(`
        SELECT COUNT(*) AS total
        FROM guards
      `),

      // Recent complaints
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

      // Recent residents
      db.query(`
        SELECT
          id,
          name,
          flat_number,
          approval_status
        FROM users
        WHERE role = 'resident'
        ORDER BY id DESC
        LIMIT 5
      `),

      // Upcoming events list
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
    