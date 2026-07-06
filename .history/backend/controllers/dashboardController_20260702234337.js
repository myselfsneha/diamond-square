const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const [[resident]] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role='resident'"
    );

    const [[guard]] = await db.query(
      "SELECT COUNT(*) AS total FROM guards"
    );

    const [[visitor]] = await db.query(
      "SELECT COUNT(*) AS total FROM visitors WHERE DATE(created_at)=CURDATE()"
    );

    const [[complaint]] = await db.query(
      "SELECT COUNT(*) AS total FROM complaints"
    );

    const [[notice]] = await db.query(
      "SELECT COUNT(*) AS total FROM notices"
    );

    const [[event]] = await db.query(
      "SELECT COUNT(*) AS total FROM events"
    );

    const [[document]] = await db.query(
      "SELECT COUNT(*) AS total FROM documents"
    );

    const [[payment]] = await db.query(
      "SELECT COUNT(*) AS total FROM maintenance WHERE status='Pending'"
    );

    const [recentComplaints] = await db.query(`
      SELECT
        c.id,
        c.title,
        c.status,
        u.name
      FROM complaints c
      LEFT JOIN users u
        ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    const [recentVisitors] = await db.query(`
      SELECT
        visitor_name,
        status,
        visit_date
      FROM visitors
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const [upcomingEvents] = await db.query(`
      SELECT
        title,
        event_date
      FROM events
      WHERE event_date>=CURDATE()
      ORDER BY event_date ASC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        residents: resident.total,
        guards: guard.total,
        visitorsToday: visitor.total,
        complaints: complaint.total,
        notices: notice.total,
        events: event.total,
        documents: document.total,
        pendingPayments: payment.total,
      },
      recentComplaints,
      recentVisitors,
      upcomingEvents,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};