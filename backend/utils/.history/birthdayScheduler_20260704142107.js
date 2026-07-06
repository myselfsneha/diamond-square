exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [users] = await db.query(
      `
      SELECT password
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      users[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.query(
      `
      UPDATE users
      SET password = ?
      WHERE id = ?
      `,
      [hashedPassword, req.user.id]
    );

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile image.",
      });
    }

    const profileImage = req.file.filename;

    await db.query(
      `
      UPDATE users
      SET
        profile_image = ?,
        profile_completed = 1
      WHERE id = ?
      `,
      [profileImage, req.user.id]
    );

    return res.json({
      success: true,
      message: "Profile image updated successfully.",
      profile_image: profileImage,
    });
  } catch (error) {
    console.error("Upload Profile Image:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.switchDashboard = async (req, res) => {
  try {
    const { mode } = req.body;

    if (!["resident", "admin"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dashboard mode.",
      });
    }

    const [users] = await db.query(
      `
      SELECT role
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      mode === "admin" &&
      users[0].role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.json({
      success: true,
      mode,
      message: `Switched to ${mode} dashboard successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
};

exports.forgotPassword = async (req, res) => {
  return res.status(501).json({
    success: false,
    message:
      "Forgot Password feature will be added in a future update.",
  });
};

exports.resetPassword = async (req, res) => {
  return res.status(501).json({
    success: false,
    message:
      "Reset Password feature will be added in a future update.",
  });
};