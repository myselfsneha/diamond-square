const cron = require("node-cron");
const db = require("../config/db");

const isSameDayOfMonth = (dateValue, month, day) => {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  return date.getMonth() + 1 === month && date.getDate() === day;
};

const insertNotificationIfMissing = async (user, title, message) => {
  const existingNotification = await db.query(
    `
      SELECT id
      FROM notifications
      WHERE resident_id = $1
        AND title = $2
        AND created_at::date = CURRENT_DATE
    `,
    [user.id, title]
  );

  if (existingNotification.rows.length > 0) {
    return;
  }

  await db.query(
    `
      INSERT INTO notifications
      (
        resident_id,
        title,
        message,
        type,
        is_read
      )
      VALUES ($1, $2, $3, $4, FALSE)
    `,
    [user.id, title, message, "general"]
  );

  console.log(`${title} notification sent to ${user.name}`);
};

const handleUserOccasions = async (user, month, day) => {
  const occasions = [
    {
      key: "date_of_birth",
      title: "🎂 Happy Birthday!",
      message: `Diamond Square wishes you a very Happy Birthday, ${user.name}! Have a wonderful day.`,
    },
    {
      key: "anniversary_date",
      title: "💐 Happy Anniversary!",
      message: `Diamond Square wishes you a Happy Wedding Anniversary, ${user.name}!`,
    },
  ];

  for (const occasion of occasions) {
    if (!user[occasion.key] || !isSameDayOfMonth(user[occasion.key], month, day)) {
      continue;
    }

    await insertNotificationIfMissing(user, occasion.title, occasion.message);
  }
};

const startBirthdayScheduler = () => {
  // Runs every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("Running Birthday & Anniversary Scheduler...");

      const result = await db.query(`
        SELECT
          id,
          name,
          date_of_birth,
          anniversary_date
        FROM users
        WHERE approval_status = 'approved'
          AND is_active = TRUE
      `);

      const users = result.rows;
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      for (const user of users) {
        await handleUserOccasions(user, month, day);
      }

      console.log("Birthday Scheduler Completed");
    } catch (err) {
      console.error("Birthday Scheduler Error:", err);
    }
  });

  console.log("✅ Birthday Scheduler Started (Runs daily at 9:00 AM)");
};

module.exports = startBirthdayScheduler;