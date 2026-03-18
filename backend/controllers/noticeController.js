const Notice = require("../models/Notice");

// ================= CREATE NOTICE (ADMIN) =================
exports.createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notice = new Notice({
      title,
      message,
      createdBy: req.user.id,
    });

    await notice.save();

    res.status(201).json({
      message: "Notice created successfully",
      notice,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL NOTICES =================
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.json(notices);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};