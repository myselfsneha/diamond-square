const db = require("../config/db");

// ===========================
// ADMIN DASHBOARD
// ===========================

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      [members],
      [pending],
      [complaints],
      [resolved],
      [events],
      [polls],
      [guards],
      [notices],
      [recentComplaints],
      [recentResidents],
      [upcomingEvents],
      [recentNotices],
    ] = await Promise.all([
      db.query("SELECT COUNT(*) AS total FROM users WHERE role='resident'"),

      db.query(
        "SELECT COUNT(*) AS total FROM users WHERE approval_status='pending'"
      ),

      db.query("SELECT COUNT(*) AS total FROM complaints"),

      db.query(
        "SELECT COUNT(*) AS total FROM complaints WHERE status='Resolved'"
      ),

      db.query("SELECT COUNT(*) AS total FROM events"),

      db.query("SELECT COUNT(*) AS total FROM polls"),

      db.query("SELECT COUNT(*) AS total FROM guards"),

      db.query("SELECT COUNT(*) AS total FROM notices"),

      db.query(`
        SELECT
          complaints.id,
          complaints.title,
          complaints.status,
          complaints.created_at,
          users.name
        FROM complaints
        JOIN users
          ON complaints.user_id = users.id
        ORDER BY complaints.created_at DESC
        LIMIT 5
      `),

      db.query(`
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
      `),

      db.query(`
        SELECT
          id,
          title,
          event_date
        FROM events
        WHERE event_date >= CURDATE()
        ORDER BY event_date
        LIMIT 5
      `),

      db.query(`
        SELECT
          id,
          title,
          created_at
        FROM notices
        ORDER BY created_at DESC
        LIMIT 5
      `),
    ]);

    res.json({
      totalMembers: members[0].total,
      pendingApprovals: pending[0].total,
      totalComplaints: complaints[0].total,
      resolvedComplaints: resolved[0].total,
      totalEvents: events[0].total,
      totalPolls: polls[0].total,
      totalGuards: guards[0].total,
      totalNotices: notices[0].total,

      recentComplaints,
      recentResidents,
      upcomingEvents,
      recentNotices,

      activity: [
        {
          title: "Residents",
          value: members[0].total,
        },
        {
          title: "Complaints",
          value: complaints[0].total,
        },
        {
          title: "Events",
          value: events[0].total,
        },
      ],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ===========================
// RESIDENT DASHBOARD
// ===========================

exports.getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      [complaints],
      [maintenance],
      [events],
      [polls],
      [documents],
      [todayVisitors],
      [recentComplaints],
      [latestNotices],
      [upcomingEvents],
      [recentVisitors],
    ] = await Promise.all([
      db.query(
        `
        SELECT
          COUNT(*) AS totalComplaints,
          SUM(
            CASE
              WHEN status!='Resolved'
              THEN 1
              ELSE 0
            END
          ) AS pendingComplaints
        FROM complaints
        WHERE user_id=?
        `,
        [userId]
      ),

      db.query(
        `
        SELECT
          COUNT(*) AS paidMaintenance
        FROM maintenance
        WHERE user_id=?
        AND payment_status='Paid'
        `,
        [userId]
      ),

      db.query(
        `
        SELECT COUNT(*) AS totalEvents
        FROM events
        WHERE event_date>=CURDATE()
        `
      ),

      db.query(
        `
        SELECT COUNT(*) AS activePolls
        FROM polls
        `
      ),

      db.query(
        `
        SELECT COUNT(*) AS totalDocuments
        FROM documents
        `
      ),

      db.query(
        `
        SELECT COUNT(*) AS visitorsToday
        FROM visitors
        WHERE resident_id=?
        AND DATE(visit_date)=CURDATE()
        `,
        [userId]
      ),

      db.query(
        `
        SELECT
          id,
          title,
          status,
          created_at
        FROM complaints
        WHERE user_id=?
        ORDER BY created_at DESC
        LIMIT 5
        `,
        [userId]
      ),

      db.query(
        `
        SELECT
          id,
          title,
          content,
          created_at
        FROM notices
        ORDER BY created_at DESC
        LIMIT 5
        `
      ),

      db.query(
        `
        SELECT
          id,
          title,
          event_date,
          event_time,
          location
        FROM events
        WHERE event_date>=CURDATE()
        ORDER BY event_date
        LIMIT 5
        `
      ),

      db.query(
        `
        SELECT
          id,
          visitor_name,
          purpose,
          status,
          visit_date,
          entry_time,
          exit_time
        FROM visitors
        WHERE resident_id=?
        ORDER BY visit_date DESC
        LIMIT 5
        `,
        [userId]
      ),
    ]);

    res.json({
      stats: {
        totalComplaints:
          complaints[0]?.totalComplaints || 0,

        pendingComplaints:
          complaints[0]?.pendingComplaints || 0,

        paidMaintenance:
          maintenance[0]?.paidMaintenance || 0,

        totalEvents:
          events[0]?.totalEvents || 0,

        activePolls:
          polls[0]?.activePolls || 0,

        totalDocuments:
          documents[0]?.totalDocuments || 0,

        visitorsToday:
          todayVisitors[0]?.visitorsToday || 0,
      },

      recentComplaints,
      latestNotices,
      upcomingEvents,
      recentVisitors,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};