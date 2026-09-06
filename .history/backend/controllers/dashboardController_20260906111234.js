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

      // NEW
      latestNotices,
      latestEvents,
      birthdays,
      anniversaries,
    ] = await Promise.all([

      // Registered Residents
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE approval_status='approved'
      `),

      // Pending Approvals
      db.query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE approval_status='pending'
      `),

      // Open Complaints
      db.query(`
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE status!='Resolved'
      `),

      // Notices Count
      db.query(`
        SELECT COUNT(*) AS total
        FROM notices
      `),

      // Upcoming Events Count
      db.query(`
        SELECT COUNT(*) AS total
        FROM events
        WHERE event_date>=CURRENT_DATE
      `),

      // Visitors Today
      db.query(`
        SELECT COUNT(*) AS total
        FROM visitors
        WHERE DATE(created_at)=CURRENT_DATE
      `),

      // Maintenance Due
      db.query(`
        SELECT COUNT(*) AS total
        FROM maintenance
        WHERE payment_status='Pending'
      `),

      // Guards
      db.query(`
        SELECT COUNT(*) AS total
        FROM guards
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
        ON c.user_id=u.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `),

      // Recent Residents
      db.query(`
        SELECT
          id,
          name,
          flat_number,
          role
        FROM users
        WHERE approval_status='approved'
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
        WHERE event_date>=CURRENT_DATE
        ORDER BY event_date
        LIMIT 5
      `),

      // ==========================
      // What's New Today
      // ==========================

      db.query(`
        SELECT
          id,
          title,
          created_at
        FROM notices
        ORDER BY created_at DESC
        LIMIT 3
      `),

      db.query(`
        SELECT
          id,
          title,
          event_date
        FROM events
        WHERE event_date>=CURRENT_DATE
        ORDER BY event_date
        LIMIT 3
      `),

      // ==========================
      // Today's Birthdays
      // ==========================

      db.query(`
        SELECT
          id,
          name,
          flat_number
        FROM users
        WHERE
        EXTRACT(MONTH FROM birthday)=EXTRACT(MONTH FROM CURRENT_DATE)
        AND
        EXTRACT(DAY FROM birthday)=EXTRACT(DAY FROM CURRENT_DATE)
      `),

      // ==========================
      // Today's Anniversaries
      // ==========================

      db.query(`
        SELECT
          id,
          name,
          flat_number
        FROM users
        WHERE
        EXTRACT(MONTH FROM anniversary)=EXTRACT(MONTH FROM CURRENT_DATE)
        AND
        EXTRACT(DAY FROM anniversary)=EXTRACT(DAY FROM CURRENT_DATE)
      `),
    ]);
    