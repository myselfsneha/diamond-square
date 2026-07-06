const cron = require("node-cron");
const db = require("../config/db");

const startBirthdayScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log("Running Birthday & Anniversary Scheduler...");

      const [users] = await db.query(`
        SELECT
          id,
          name,
          date_of_birth,
          anniversary_date
        FROM users
        WHERE approval_status='approved'
          AND is_active=1
      `);

      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      for (const user of users) {
        // Birthday
        if (user.date_of_birth) {
          const dob = new Date(user.date_of_birth);

          if (
            dob.getMonth() + 1 === month &&
            dob.getDate() === day
          ) {
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
              VALUES (?, ?, ?, ?, 0)
              `,
              [
                user.id,
                "🎂 Happy Birthday!",
                `Diamond Square wishes you a very Happy Birthday, ${user.name}! Have a wonderful day.`,
                "General",
              ]
            );
          }
        }

        // Anniversary
        if (user.anniversary_date) {
          const ann = new Date(user.anniversary_date);

          if (
            ann.getMonth() + 1 === month &&
            ann.getDate() === day
          ) {
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
              VALUES (?, ?, ?, ?, 0)
              `,
              [
                user.id,
                "💐 Happy Anniversary!",
                `Diamond Square wishes you a Happy Wedding Anniversary, ${user.name}!`,
                "General",
              ]
            );
          }
        }
      }

      console.log("Birthday Scheduler Completed");
    } catch (err) {
      console.error("Birthday Scheduler Error:", err);
    }
  });
};

module.exports = startBirthdayScheduler;