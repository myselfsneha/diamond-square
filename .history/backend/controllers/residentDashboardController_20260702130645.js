const db = require("../config/db");

exports.getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      [complaints],
      [maintenance],
      [events],
      [polls],
      [recentComplaints],
      [recentNotices],
      [upcomingEvents],
      [recentVisitors],
    ] = await Promise.all([
      db.query(
        `
        SELECT
          COUNT(*) AS totalComplaints,
          SUM(CASE WHEN status != 'Resolved' THEN 1 ELSE 0 END) AS openComplaints,
          SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolvedComplaints
        FROM complaints
        WHERE user_id = ?
        `,
        [userId]
      ),

      db.query(
        `
        SELECT
          COUNT(*) AS totalBills,
          SUM(CASE WHEN status='Paid' THEN 1 ELSE 0 END) AS paidBills,
          SUM(CASE WHEN status='Pending' THEN 1 ELSE 0 END) AS pendingBills,
          SUM(CASE WHEN status='Partially Paid' THEN 1 ELSE 0 END) AS partialBills,
          COALESCE(SUM(balance),0) AS totalBalance
        FROM maintenance
        WHERE user_id = ?
        `,
        [userId]
      ),

      db.query(
        `
        SELECT COUNT(*) AS totalEvents
        FROM events
        WHERE event_date >= CURDATE()
        `
      ),

      db.query(
        `
        SELECT COUNT(*) AS totalPolls
        FROM polls
        `
      ),

      db.query(
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
      ),

      db.query(
        `
        SELECT
          id,
          title,
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
          description
        FROM events
        WHERE event_date >= CURDATE()
        ORDER BY event_date ASC
        LIMIT 5
        `
      ),

      db.query(
        `
        SELECT
          id,
          visitor_name,
          status,
          visit_date
        FROM visitors
        WHERE resident_id = ?
        ORDER BY visit_date DESC
        LIMIT 5
        `,
        [userId]
      ),
    ]);

        res.json({
      stats: {
        totalComplaints: complaints[0]?.totalComplaints || 0,
        openComplaints: complaints[0]?.openComplaints || 0,
        resolvedComplaints: complaints[0]?.resolvedComplaints || 0,

        totalMaintenanceBills: maintenance[0]?.totalBills || 0,
        paidBills: maintenance[0]?.paidBills || 0,
        pendingBills: maintenance[0]?.pendingBills || 0,
        partialBills: maintenance[0]?.partialBills || 0,
        outstandingBalance: maintenance[0]?.totalBalance || 0,

        totalEvents: events[0]?.totalEvents || 0,
        totalPolls: polls[0]?.totalPolls || 0,
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