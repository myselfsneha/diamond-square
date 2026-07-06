const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [
      [residents],
      [complaints],
      [events],
      [polls],
      [guards],
    ] = await Promise.all([
      db.query(
        "SELECT COUNT(*) AS totalResidents FROM users WHERE role = 'resident'"
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
      totalResidents:
        residents[0]?.totalResidents || 0,

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
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard statistics",
    });
  }
};