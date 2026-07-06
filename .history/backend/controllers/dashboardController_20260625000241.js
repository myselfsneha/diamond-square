const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [
      [members],
      [pendingApprovals],
      [complaints],
      [events],
      [polls],
      [guards],
      [recentComplaints],
      [recentResidents],
      [upcomingEvents],
    ] = await Promise.all([
      db.query(
        "SELECT COUNT(*) AS totalMembers FROM users"
      ),

      db.query(
        "SELECT COUNT(*) AS pendingApprovals FROM users WHERE approval_status = 'pending'"
      ),

      db.query(
        "SELECT COUNT(*) AS totalComplaints FROM complaints"
      ),

      db.query(
        "SELECT COUNT(*) AS totalEvents FROM events"
      ),

      db.query(
        "SELECT COUNT(*) AS totalPolls FROM polls"
      ),

      db.query(
        "SELECT COUNT(*) AS totalGuards FROM guards"
      ),

      db.query(`
        SELECT
          c.id,
          c.title,
          c.status,
          c.created_at,
          u.name
        FROM complaints c
        JOIN users u
          ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
          id,
          name,
          flat_number,
          phone,
          approval_status,
          created_at
        FROM users
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
        ORDER BY event_date ASC
        LIMIT 5
      `),
    ]);

    res.json({
      totalMembers:
        members[0]?.totalMembers || 0,

      pendingApprovals:
        pendingApprovals[0]?.pendingApprovals || 0,

      totalComplaints:
        complaints[0]?.totalComplaints || 0,

      totalEvents:
        events[0]?.totalEvents || 0,

      totalPolls:
        polls[0]?.totalPolls || 0,

      totalGuards:
        guards[0]?.totalGuards || 0,

      recentComplaints,
      recentResidents,
      upcomingEvents,
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard statistics",
    });
  }
};