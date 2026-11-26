// Create an admin account, or set a new password for an existing one.
// Run on the server (or locally against your local database):
//   node --env-file=$HOME/.config/winteriors/app.env scripts/create-admin.mjs admin@example.com
// The password is typed at a hidden prompt, never passed on the command line.
// Hash format must match src/lib/auth.server.ts (scrypt$N$r$p$salt$hash).
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const email = (process.argv[2] || "").trim();
if (!/^[^@\s]+@[^@\s]+$/.test(email)) {
  console.error("Usage: node --env-file=<settings file> scripts/create-admin.mjs <email>");
  process.exit(1);
}
const url = process.env.DB_Connection || process.env.DATABASE_URL;
if (!url) {
  console.error("No database configured: pass --env-file with DB_Connection or DATABASE_URL.");
  process.exit(1);
}

let pending = ""; // input already read but meant for the next prompt (piped input arrives in one chunk)

function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    let value = "";
    const finish = (rest) => {
      pending = rest;
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.pause();
      stdin.off("data", onData);
      stdin.off("end", onEnd);
      process.stdout.write("\n");
      resolve(value);
    };
    const consume = (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        const ch = chunk[i];
        if (ch === "\r" || ch === "\n" || ch === "\u0004") return finish(chunk.slice(chunk[i + 1] === "\n" && ch === "\r" ? i + 2 : i + 1)), true;
        if (ch === "\u0003") process.exit(130);
        if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
        else value += ch;
      }
      return false;
    };
    const onData = (chunk) => consume(chunk);
    const onEnd = () => finish("");
    if (pending && consume(pending)) return;
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.on("data", onData);
    stdin.on("end", onEnd);
    stdin.resume();
  });
}

const password = await askHidden(`Password for ${email} (min 12 characters): `);
if (password.length < 12) {
  console.error("Password too short (minimum 12 characters). Nothing changed.");
  process.exit(1);
}
if ((await askHidden("Repeat password: ")) !== password) {
  console.error("Passwords do not match. Nothing changed.");
  process.exit(1);
}

const N = 16384, r = 8, p = 1;
const salt = randomBytes(16);
const hash = await promisify(scrypt)(password, salt, 64, { N, r, p });
const stored = ["scrypt", N, r, p, salt.toString("base64"), hash.toString("base64")].join("$");

const client = new pg.Client({ connectionString: url, ssl: url.includes("sslmode=") ? { rejectUnauthorized: false } : false });
await client.connect();
try {
  const { rows } = await client.query(
    `INSERT INTO public.admin_users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING (xmax = 0) AS created`,
    [email.toLowerCase(), stored],
  );
  // A new password logs out every existing session of this admin.
  await client.query(
    "DELETE FROM public.admin_sessions WHERE user_id = (SELECT id FROM public.admin_users WHERE email = $1)",
    [email.toLowerCase()],
  );
  console.log(rows[0].created ? `Admin ${email} created.` : `Password updated for ${email}; existing sessions signed out.`);
} finally {
  await client.end();
}
