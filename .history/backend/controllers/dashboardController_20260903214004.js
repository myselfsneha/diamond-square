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
        res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        flat: req.user.flat_number,
      },

      stats: [
        {
          title: "Registered Residents",
          value: Number(residents.rows[0].total),
        },
        {
          title: "Pending Approvals",
          value: Number(pendingApprovals.rows[0].total),
        },
        {
          title: "Visitors Today",
          value: Number(visitors.rows[0].total),
        },
        {
          title: "Open Complaints",
          value: Number(complaints.rows[0].total),
        },
        {
          title: "Maintenance Due",
          value: Number(maintenanceDue.rows[0].total),
        },
        {
          title: "Active Notices",
          value: Number(notices.rows[0].total),
        },
        {
          title: "Upcoming Events",
          value: Number(events.rows[0].total),
        },
        {
          title: "Security Guards",
          value: Number(guards.rows[0].total),
        },
      ],

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
        const [
      residentResult,
      myComplaints,
      pendingComplaints,
      latestNotices,
      upcomingEvents,
      visitorsToday,
      maintenanceDue,
    ] = await Promise.all([

      // Resident Details
      db.query(
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
      ),

      // My Complaints
      db.query(
        `
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE user_id = $1
        `,
        [residentId]
      ),

      // Pending Complaints
      db.query(
        `
        SELECT COUNT(*) AS total
        FROM complaints
        WHERE user_id = $1
          AND status != 'Resolved'
        `,
        [residentId]
      ),

      // Latest Notices
      db.query(`
        SELECT
          id,
          title,
          created_at
        FROM notices
        ORDER BY created_at DESC
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
        WHERE event_date >= CURRENT_DATE
        ORDER BY event_date ASC
        LIMIT 5
      `),

      // Visitors Today
      db.query(`
        SELECT COUNT(*) AS total
        FROM visitors
        WHERE DATE(created_at) = CURRENT_DATE
      `),

      // Pending Maintenance
      db.query(
  `
  SELECT COUNT(*) AS total
  FROM maintenance
  WHERE user_id = $1
    AND payment_status = 'Pending'
  `,
  [residentId]
)
    ]);

    const resident = residentResult.rows[0];
        return res.status(200).json({
      resident,

      stats: [
        {
          title: "My Complaints",
          value: Number(myComplaints.rows[0].total),
        },
        {
          title: "Pending Complaints",
          value: Number(pendingComplaints.rows[0].total),
        },
        {
          title: "Visitors Today",
          value: Number(visitorsToday.rows[0].total),
        },
        {
          title: "Maintenance Due",
          value: Number(maintenanceDue.rows[0].total),
        },
        {
          title: "Active Notices",
          value: latestNotices.rows.length,
        },
        {
          title: "Upcoming Events",
          value: upcomingEvents.rows.length,
        },
      ],

      latestNotices: latestNotices.rows,
      upcomingEvents: upcomingEvents.rows,
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