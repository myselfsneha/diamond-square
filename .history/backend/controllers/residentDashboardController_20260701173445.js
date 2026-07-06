const db = require("../config/db");

exports.getResidentDashboard = async (req, res) => {
  try {
    // Logged in user id
    const userId = req.user.id;

    const [
      [complaints],
      [paidMaintenance],
      [events],
      [polls],
      [recentComplaints],
      [recentNotices],
      [upcomingEvents],
      [recentVisitors],
    ] = await Promise.all([
      db.query(
        `SELECT
            COUNT(*) AS totalComplaints,
            SUM(CASE WHEN status != 'Resolved' THEN 1 ELSE 0 END) AS openComplaints
         FROM complaints
         WHERE user_id = ?`,
        [userId]
      ),

      db.query(
        `SELECT COUNT(*) AS paidMaintenance
         FROM maintenance
         WHERE user_id = ?
         AND payment_status='Paid'`,
        [userId]
      ),

      db.query(
        `SELECT COUNT(*) AS totalEvents
         FROM events
         WHERE event_date >= CURDATE()`
      ),

      db.query(
        `SELECT COUNT(*) AS activePolls
         FROM polls
         WHERE status='Active'`
      ),

      db.query(
        `SELECT
            id,
            title,
            status,
            created_at
         FROM complaints
         WHERE user_id=?
         ORDER BY created_at DESC
         LIMIT 5`,
        [userId]
      ),

      db.query(
        `SELECT
            id,
            title,
            created_at
         FROM notices
         ORDER BY created_at DESC
         LIMIT 5`
      ),

      db.query(
        `SELECT
            id,
            title,
            event_date
         FROM events
         WHERE event_date>=CURDATE()
         ORDER BY event_date
         LIMIT 5`
      ),

      db.query(
        `SELECT
            id,
            visitor_name,
            status,
            visit_date
         FROM visitors
         WHERE resident_id=?
         ORDER BY visit_date DESC
         LIMIT 5`,
        [userId]
      ),
    ]);

    res.json({
      stats: {
        totalComplaints:
          complaints[0]?.totalComplaints || 0,

        openComplaints:
          complaints[0]?.openComplaints || 0,

        paidMaintenance:
          paidMaintenance[0]?.paidMaintenance || 0,

        totalEvents:
          events[0]?.totalEvents || 0,

        activePolls:
          polls[0]?.activePolls || 0,
      },

      recentComplaints,
      recentNotices,
      upcomingEvents,
      recentVisitors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load resident dashboard",
    });
  }
};