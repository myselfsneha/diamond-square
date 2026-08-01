const { Pool } = require("pg");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Pool Error:", err);
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  } catch (err) {
    console.error(err);
  }
})();

module.exports = pool;