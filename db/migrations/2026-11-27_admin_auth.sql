-- Real admin login (replaces the browser-only mock login).
-- Additive only: two new tables, nothing existing is changed.
-- Apply before deploying the code that uses them:
--   psql -h 127.0.0.1 -U winteriors_app -d winteriors -f db/migrations/2026-11-27_admin_auth.sql

CREATE TABLE IF NOT EXISTS public.admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,            -- scrypt, see src/lib/auth.server.ts
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_sessions (
  token_hash text PRIMARY KEY,            -- sha256 of the cookie token; the token itself is never stored
  user_id    uuid NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_user_id_idx ON public.admin_sessions (user_id);
