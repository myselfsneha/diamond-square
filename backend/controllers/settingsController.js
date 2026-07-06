exports.getSettings = async (req, res) => {
  try {
    res.json({
      societyName: "Diamond Square",
      address: "Ahmedabad",
      maintenanceDueDate: 10,
      contactEmail: "admin@diamondsquare.com",
      contactPhone: "9999999999"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    res.json({
      message: "Settings updated successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};