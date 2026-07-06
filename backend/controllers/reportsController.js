exports.getReports = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    res.json({
      year,
      totalResidents: 0,
      totalMaintenance: 0,
      paidMaintenance: 0,
      pendingMaintenance: 0,
      totalComplaints: 0,
      resolvedComplaints: 0,
      pendingComplaints: 0,
      monthlyCollection: []
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate report",
    });
  }
};