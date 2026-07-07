const db = require("../config/db");

// ==============================
// Get All Events
// ==============================
exports.getEvents = async (req, res) => {
  try {
    const { rows: events } = await db.query(`
      SELECT *
      FROM events
      ORDER BY event_date DESC
    `);

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Event
// ==============================
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, location } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Title and event date are required.",
      });
    }

    const result = await db.query(
      `
      INSERT INTO events
      (
        title,
        event_date,
        description,
        location
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        title.trim(),
        date,
        description?.trim() || "",
        location?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      eventId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Event
// ==============================
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM events WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};