const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [
      residentsResult,
      complaintsResult,
      eventsResult,
      pollsResult,
      guardsResult,
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

    const stats = {
      totalResidents:
        residentsResult[0][0]?.totalResidents || 0,

      totalComplaints:
        complaintsResult[0][0]?.totalComplaints || 0,

      totalEvents:
        eventsResult[0][0]?.totalEvents || 0,

      totalPolls:
        pollsResult[0][0]?.totalPolls || 0,

      totalGuards:
        guardsResult[0][0]?.totalGuards || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};