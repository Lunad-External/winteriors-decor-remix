import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('DATABASE_URL='));
const dbUrl = line.substring(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
const pool = new pg.Pool({ connectionString: dbUrl });

async function main() {
  const p = await pool.query('SELECT slug, title, cover_path, image_count FROM projects WHERE deleted_at IS NULL');
  console.log(`TOTAL PROJECTS IN DB: ${p.rows.length}`);
  p.rows.forEach(r => console.log(`slug: ${r.slug} | cover_path: ${r.cover_path}`));
  await pool.end();
}

main().catch(console.error);
