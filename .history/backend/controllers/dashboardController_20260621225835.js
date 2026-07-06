const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const stats = {};

    db.query(
      "SELECT COUNT(*) AS totalResidents FROM users WHERE role='resident'",
      (err, residents) => {
        if (err) return res.status(500).json(err);

        stats.totalResidents =
          residents[0].totalResidents;

        db.query(
          "SELECT COUNT(*) AS totalComplaints FROM complaints",
          (err, complaints) => {
            if (err)
              return res.status(500).json(err);

            stats.totalComplaints =
              complaints[0].totalComplaints;

            db.query(
              "SELECT COUNT(*) AS totalEvents FROM events",
              (err, events) => {
                if (err)
                  return res.status(500).json(err);

                stats.totalEvents =
                  events[0].totalEvents;

                db.query(
                  "SELECT COUNT(*) AS totalPolls FROM polls",
                  (err, polls) => {
                    if (err)
                      return res.status(500).json(err);

                    stats.totalPolls =
                      polls[0].totalPolls;

                    db.query(
                      "SELECT COUNT(*) AS totalGuards FROM guards",
                      (err, guards) => {
                        if (err)
                          return res.status(500).json(err);

                        stats.totalGuards =
                          guards[0].totalGuards;

                        res.json(stats);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};