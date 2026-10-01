// Check exactly what URLs are being generated from the DB
import fs from "fs";
import pg from "pg";

const env = fs.readFileSync(".env", "utf8");
const line = env.split("\n").find((l) => l.startsWith("DATABASE_URL="));
const dbUrl = line.substring(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");

const pool = new pg.Pool({ connectionString: dbUrl });

async function main() {
  const { rows } = await pool.query(
    `SELECT slug, title, cover_path FROM projects WHERE deleted_at IS NULL`
  );
  console.log(`Testing thumbnails for all ${rows.length} projects...`);

  let okCount = 0;
  let failCount = 0;

  for (const row of rows) {
    const id = row.cover_path;
    if (id && /^[a-zA-Z0-9_-]{25,}$/.test(id)) {
      const ucUrl = `https://drive.usercontent.google.com/download?id=${id}&export=view`;
      try {
        const r = await fetch(ucUrl);
        if (r.status === 200) {
          okCount++;
        } else {
          failCount++;
          console.log(`FAIL [${r.status}]: ${row.slug} (${id})`);
        }
      } catch (e) {
        failCount++;
        console.log(`ERROR: ${row.slug} - ${e.message}`);
      }
    } else {
      console.log(`NOT A DRIVE ID: ${row.slug} - "${id}"`);
    }
  }

  console.log(`\nRESULTS: ${okCount} OK, ${failCount} FAILED out of ${rows.length} projects`);
  await pool.end();
}

main().catch(console.error);
