const Notice = require("../models/Notice");

exports.createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notice = new Notice({
      title,
      message,
      createdBy: null
    });

    await notice.save();

    res.status(201).json({
      message: "Notice created",
      notice
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.json(notices);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};