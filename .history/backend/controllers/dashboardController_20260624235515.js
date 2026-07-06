const db = require("../config/db");

// Dashboard Overview
exports.getDashboardData = async (req, res) => {
  try {
    const [
      [statsResult],
      [recentComplaints],
      [recentResidents],
      [upcomingEvents],
    ] = await Promise.all([
      db.query(`
        SELECT
          (SELECT COUNT(*) FROM users) AS totalMembers,
          (SELECT COUNT(*) FROM users WHERE approval_status = 'pending') AS pendingApprovals,
          (SELECT COUNT(*) FROM complaints) AS totalComplaints,
          (SELECT COUNT(*) FROM events) AS totalEvents,
          (SELECT COUNT(*) FROM polls) AS totalPolls,
          (SELECT COUNT(*) FROM guards) AS totalGuards
      `),

      db.query(`
        SELECT
          c.id,
          c.title,
          c.status,
          c.created_at,
          u.name,
          u.flat_number
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
          phone,
          flat_number,
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
          description,
          event_date,
          created_at
        FROM events
        ORDER BY event_date ASC
        LIMIT 5
      `),
    ]);

    res.json({
      stats: statsResult[0] || {
        totalMembers: 0,
        pendingApprovals: 0,
        totalComplaints: 0,
        totalEvents: 0,
        totalPolls: 0,
        totalGuards: 0,
      },

      recentComplaints: recentComplaints || [],
      recentResidents: recentResidents || [],
      upcomingEvents: upcomingEvents || [],
    });
  } catch (error) {
    console.error("Dashboard Overview Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard overview",
    });
  }
};

// Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const [
      [members],
      [pendingApprovals],
      [complaints],
      [events],
      [polls],
      [guards],
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