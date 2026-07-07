const db = require("../config/db");

exports.getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      complaintsResult,
      maintenanceResult,
      eventsResult,
      pollsResult,
      recentComplaintsResult,
      recentNoticesResult,
      upcomingEventsResult,
      recentVisitorsResult,
    ] = await Promise.all([
      db.query(
        `
        SELECT
          COUNT(*)::int AS "totalComplaints",
          COUNT(*) FILTER (WHERE status <> 'Resolved')::int AS "openComplaints",
          COUNT(*) FILTER (WHERE status = 'Resolved')::int AS "resolvedComplaints"
        FROM complaints
        WHERE user_id = $1
        `,
        [userId]
      ),

      db.query(
        `
        SELECT
          COUNT(*)::int AS "totalBills",
          COUNT(*) FILTER (WHERE status = 'Paid')::int AS "paidBills",
          COUNT(*) FILTER (WHERE status = 'Pending')::int AS "pendingBills",
          COUNT(*) FILTER (WHERE status = 'Partially Paid')::int AS "partialBills",
          COALESCE(SUM(balance),0)::numeric AS "totalBalance"
        FROM maintenance
        WHERE user_id = $1
        `,
        [userId]
      ),

      db.query(
        `
        SELECT COUNT(*)::int AS "totalEvents"
        FROM events
        WHERE event_date >= CURRENT_DATE
        `
      ),

      db.query(
        `
        SELECT COUNT(*)::int AS "totalPolls"
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
        WHERE user_id = $1
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
        WHERE event_date >= CURRENT_DATE
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
        WHERE resident_id = $1
        ORDER BY visit_date DESC
        LIMIT 5
        `,
        [userId]
      ),
    ]);

    const complaints = complaintsResult.rows[0];
    const maintenance = maintenanceResult.rows[0];
    const events = eventsResult.rows[0];
    const polls = pollsResult.rows[0];

    return res.json({
      success: true,
      stats: {
        totalComplaints: complaints.totalComplaints || 0,
        openComplaints: complaints.openComplaints || 0,
        resolvedComplaints: complaints.resolvedComplaints || 0,

        totalMaintenanceBills: maintenance.totalBills || 0,
        paidBills: maintenance.paidBills || 0,
        pendingBills: maintenance.pendingBills || 0,
        partialBills: maintenance.partialBills || 0,
        outstandingBalance: maintenance.totalBalance || 0,

        totalEvents: events.totalEvents || 0,
        totalPolls: polls.totalPolls || 0,
      },

      recentComplaints: recentComplaintsResult.rows,
      recentNotices: recentNoticesResult.rows,
      upcomingEvents: upcomingEventsResult.rows,
      recentVisitors: recentVisitorsResult.rows,
    });
  } catch (error) {
    console.error("Resident Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load resident dashboard",
      error: error.message,
    });
  }
};