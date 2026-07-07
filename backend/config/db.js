const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const client = await pool.connect();

    console.log("✅ PostgreSQL Connected Successfully");

    client.release();
  } catch (err) {
    console.error("❌ Database Connection Failed");
    console.error(err.message);
    process.exit(1);
  }
})();

module.exports = pool;