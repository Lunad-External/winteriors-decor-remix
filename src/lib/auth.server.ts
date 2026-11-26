import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { getDbPool } from "./db.server";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

const COOKIE = "wd_admin_session";
const SESSION_DAYS = 7;
const SCRYPT = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 64;

export interface Admin {
  id: string;
  email: string;
}

/** Format: scrypt$N$r$p$saltB64$hashB64 (scripts/create-admin.mjs writes the same format). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LEN, SCRYPT);
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [kind, N, r, p, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64"), expected.length, { N: +N, r: +r, p: +p });
  return timingSafeEqual(actual, expected);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

// shortcut: in-memory limiter, fine for the single PM2 process; move to the DB if the app runs on several processes.
const failures = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

function tooManyFailures(key: string): boolean {
  const f = failures.get(key);
  if (!f || Date.now() - f.first > WINDOW_MS) return false;
  return f.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const f = failures.get(key);
  if (!f || Date.now() - f.first > WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
  else f.count++;
}

export async function login(email: string, password: string): Promise<{ admin: Admin } | { error: string }> {
  // Keyed on the email only: client IP headers behind nginx can be faked.
  const key = email.trim().toLowerCase();
  if (tooManyFailures(key)) return { error: "Too many failed attempts. Try again in 15 minutes." };

  const { rows } = await getDbPool().query<{ id: string; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM public.admin_users WHERE lower(email) = lower($1)",
    [email.trim()],
  );
  const user = rows[0];
  // Hash even when the user is unknown, so response time does not reveal which emails exist.
  const ok = user ? await verifyPassword(password, user.password_hash) : (await hashPassword(password), false);
  if (!ok || !user) {
    recordFailure(key);
    return { error: "Invalid email or password" };
  }
  failures.delete(key);

  const token = randomBytes(32).toString("base64url");
  await getDbPool().query("DELETE FROM public.admin_sessions WHERE expires_at < now()");
  await getDbPool().query(
    `INSERT INTO public.admin_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '${SESSION_DAYS} days')`,
    [sha256(token), user.id],
  );
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return { admin: { id: user.id, email: user.email } };
}

/** The admin for this request, or null. Server-side check; the browser cannot fake it. */
export async function currentAdmin(): Promise<Admin | null> {
  const token = getCookie(COOKIE);
  if (!token) return null;
  const { rows } = await getDbPool().query<Admin>(
    `SELECT u.id, u.email FROM public.admin_sessions s JOIN public.admin_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [sha256(token)],
  );
  return rows[0] ?? null;
}

export async function logout(): Promise<void> {
  const token = getCookie(COOKIE);
  if (token) await getDbPool().query("DELETE FROM public.admin_sessions WHERE token_hash = $1", [sha256(token)]);
  deleteCookie(COOKIE, { path: "/" });
}
