import { Pool } from "pg";
import { SEED } from "./db";

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "❌ DATABASE_URL n'est pas défini. Exportez DATABASE_URL avant de lancer la migration.",
    );
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 2,
  });

  try {
    const client = await pool.connect();
    try {
      console.log("→ Création de la table app_state…");
      await client.query(`
        CREATE TABLE IF NOT EXISTS app_state (
          key TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      console.log("→ Initialisation du contenu seed…");
      await client.query(
        `INSERT INTO app_state (key, data) VALUES ($1, $2)
         ON CONFLICT (key) DO NOTHING`,
        ["main", SEED],
      );

      const res = await client.query("SELECT data FROM app_state WHERE key = $1", ["main"]);
      if (res.rows.length > 0) {
        const data = res.rows[0].data as { posts?: unknown[]; books?: unknown[] };
        console.log(
          `✅ Base de données prête. ${data.posts?.length ?? 0} article(s), ${data.books?.length ?? 0} livre(s).`,
        );
      } else {
        console.log("✅ Base de données prête (état initial).");
      }
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("❌ Échec de la migration :", err);
  process.exit(1);
});
