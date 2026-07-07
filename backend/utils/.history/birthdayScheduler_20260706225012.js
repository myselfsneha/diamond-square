const cron = require("node-cron");
const db = require("../config/db");

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
        // ==========================================
        // Birthday Notification
        // ==========================================
        if (user.date_of_birth) {
          const dob = new Date(user.date_of_birth);

          if (
            dob.getMonth() + 1 === month &&
            dob.getDate() === day
          ) {
            const existingBirthday = await db.query(
              `
              SELECT id
              FROM notifications
              WHERE resident_id = $1
                AND title = $2
                AND created_at::date = CURRENT_DATE
              `,
              [user.id, "🎂 Happy Birthday!"]
            );

            if (existingBirthday.rows.length === 0) {
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
                [
                  user.id,
                  "🎂 Happy Birthday!",
                  `Diamond Square wishes you a very Happy Birthday, ${user.name}! Have a wonderful day.`,
                  "general",
                ]
              );

              console.log(`🎂 Birthday notification sent to ${user.name}`);
            }
          }
        }

        // ==========================================
        // Anniversary Notification
        // ==========================================
        if (user.anniversary_date) {
          const ann = new Date(user.anniversary_date);

          if (
            ann.getMonth() + 1 === month &&
            ann.getDate() === day
          ) {
            const existingAnniversary = await db.query(
              `
              SELECT id
              FROM notifications
              WHERE resident_id = $1
                AND title = $2
                AND created_at::date = CURRENT_DATE
              `,
              [user.id, "💐 Happy Anniversary!"]
            );

            if (existingAnniversary.rows.length === 0) {
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
                [
                  user.id,
                  "💐 Happy Anniversary!",
                  `Diamond Square wishes you a Happy Wedding Anniversary, ${user.name}!`,
                  "general",
                ]
              );

              console.log(`💐 Anniversary notification sent to ${user.name}`);
            }
          }
        }
      }

      console.log("Birthday Scheduler Completed");
    } catch (err) {
      console.error("Birthday Scheduler Error:", err);
    }
  });

  console.log("✅ Birthday Scheduler Started (Runs daily at 9:00 AM)");
};

module.exports = startBirthdayScheduler;