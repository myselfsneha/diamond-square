const Notification = require("../models/Notification");

// create notification
exports.createNotification = async (req, res) => {
  try {
    const { message, type, flatNumber } = req.body;

    const notification = new Notification({
      message,
      type,
      flatNumber
    });

    await notification.save();

    res.status(201).json({
      message: "Notification created",
      notification
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};