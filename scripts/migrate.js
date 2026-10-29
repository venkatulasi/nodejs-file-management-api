import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import "dotenv/config"

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname,"../migrations");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

async function  getMigrationFiles() {
    const files = await fs.readdir(migrationsDir);

    return files
    .filter((file) => file.endsWith(".sql")).sort();
}

async function createMigrationTable(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
};

async function getAppliedMigrations(client) {
    const result = await client.query("SELECT filename FROM schema_migrations");
    return new Set(
        result.rows.map((row) => row.filename)
    )
}

async function runMigrations() {
  const client = await pool.connect();

  try {
    await createMigrationTable(client);

    const applied = await getAppliedMigrations(client);

    const files = await getMigrationFiles();

    for (const filename of files) {
      if (applied.has(filename)) {
        console.log(`SKIPPED: ${filename}`);
        continue;
      }

      const filePath = path.join(migrationsDir, filename);

      const sql = await fs.readFile(filePath, "utf8");

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [filename]
        );

        await client.query("COMMIT");

        console.log(`APPLIED: ${filename}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrations completed");
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
    console.error("Migration fialed:", error.message);
    process.exitCode  = 1;    
})