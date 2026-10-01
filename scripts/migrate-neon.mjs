import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const connectionString = process.env.DB_Connection || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No DB_Connection found in environment!");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const schemaSql = `
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  drive_folder_id TEXT,
  cover_path TEXT,
  image_count INTEGER DEFAULT 0,
  short_description TEXT,
  long_description TEXT,
  client_name TEXT,
  location TEXT,
  project_type TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT now(),
  featured_image_id TEXT,
  author_id TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_slug TEXT NOT NULL REFERENCES public.projects(slug) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_slug, file_name)
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  external_url TEXT,
  published_date TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  slider_images TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  object_position TEXT DEFAULT 'center 15%',
  scale NUMERIC(4,2) DEFAULT 1.0,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  logo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  position TEXT,
  company TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_subcategories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id TEXT NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS public.offices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  po_box TEXT,
  mobile TEXT,
  tel TEXT,
  fax TEXT,
  email TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  content_type TEXT NOT NULL DEFAULT 'text',
  page TEXT NOT NULL DEFAULT 'global',
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_send_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL,
  message_id TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_send_state (
  id INT PRIMARY KEY DEFAULT 1,
  batch_size INT DEFAULT 10,
  send_delay_ms INT DEFAULT 1000,
  auth_email_ttl_minutes INT DEFAULT 60,
  transactional_email_ttl_minutes INT DEFAULT 1440,
  retry_after_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_unsubscribe_tokens (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppressed_emails (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin user role
INSERT INTO public.user_roles (user_id, role) VALUES ('admin-user-id', 'admin') ON CONFLICT DO NOTHING;

-- Initial site content
INSERT INTO public.site_content (key, value, content_type, page, label) VALUES
  ('footer_company_profile_url', '/__l5e/assets-v1/27df3311-9b46-44fa-9034-8017fbc3407d/winteriors-decor-company-profile-2026.pdf', 'url', 'footer', 'Company Profile PDF URL'),
  ('footer_company_profile_label', 'Download Company Profile', 'text', 'footer', 'Company Profile Button Label'),
  ('footer_company_profile_sublabel', 'PDF • 2026 Edition', 'text', 'footer', 'Company Profile Button Sublabel'),
  ('footer_company_profile_filename', 'winteriors-decor-company-profile-2026.pdf', 'text', 'footer', 'Company Profile Filename')
ON CONFLICT (key) DO NOTHING;

-- Initial Projects Seed
INSERT INTO public.projects (slug, title, category, drive_folder_id, cover_path, image_count, short_description, location, status) VALUES
  ('bens-cookies', 'Ben''s Cookies', 'retail', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'bens-cookies/01.jpg', 12, 'A warm and inviting retail space designed to enhance the Ben''s Cookies brand experience.', 'Dubai, UAE', 'published'),
  ('gulf-tech', 'Gulf Tech', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'gulf-tech/01.jpg', 15, 'Modern corporate headquarters featuring open-plan workspaces and executive suites.', 'Abu Dhabi, UAE', 'published'),
  ('all-energy-services-aes', 'All Energy Services (AES)', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'all-energy-services-aes/01.jpg', 10, 'Dynamic office space designed for collaboration and productivity.', 'Dubai, UAE', 'published'),
  ('sts-library', 'STS Library', 'education', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'sts-library/01.jpg', 14, 'State-of-the-art educational library with modern learning spaces.', 'Abu Dhabi, UAE', 'published'),
  ('alpha-data', 'Alpha Data', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'alpha-data/01.jpg', 16, 'Executive office with premium boardroom and meeting facilities.', 'Dubai, UAE', 'published'),
  ('rais-hassan-saadi', 'Rais Hassan Saadi', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'rais-hassan-saadi/01.jpg', 11, 'Complete office refurbishment with modern design elements.', 'Abu Dhabi, UAE', 'published'),
  ('adveti-library', 'Adveti Library', 'education', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'adveti-library/01.jpg', 13, 'Contemporary library design promoting learning and collaboration.', 'Abu Dhabi, UAE', 'published'),
  ('alpha-data-phase-2', 'Alpha Data Phase 2', 'control-room', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'alpha-data-phase-2/01.jpg', 10, 'Expansion of the Alpha Data headquarters with additional workspaces.', 'Dubai, UAE', 'published'),
  ('bens-cookies-phase-2', 'Ben''s Cookies Phase 2', 'retail', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'bens-cookies-phase-2/01.jpg', 9, 'Second outlet maintaining brand consistency with unique local touches.', 'Dubai, UAE', 'published'),
  ('bens-cookies-phase-3', 'Ben''s Cookies Phase 3', 'retail', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'bens-cookies-phase-3/01.jpg', 8, 'Abu Dhabi expansion featuring the signature warm aesthetic.', 'Abu Dhabi, UAE', 'published'),
  ('network-operations-center', 'Network Operations Center', 'control-room', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'network-operations-center/01.jpg', 12, 'State-of-the-art network operations center with advanced monitoring systems.', 'Dubai, UAE', 'published'),
  ('command-control-center', 'Command Control Center', 'control-room', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'command-control-center/01.jpg', 10, 'Modern command center facility designed for operational excellence.', 'Abu Dhabi, UAE', 'published'),
  ('emirates-group-office', 'Emirates Group Office', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'emirates-group-office/01.jpg', 15, 'Premium corporate office with state-of-the-art meeting facilities.', 'Dubai, UAE', 'published'),
  ('training-academy', 'Training Academy', 'education', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'training-academy/01.jpg', 14, 'Professional training facility with modern learning environments.', 'Abu Dhabi, UAE', 'published'),
  ('tech-hub-innovation-center', 'Tech Hub Innovation Center', 'offices', '1NBp2iMD-o9oCZU51stXenfx8TMEFHK-k', 'tech-hub-innovation-center/01.jpg', 12, 'Modern innovation center designed for tech startups and collaboration.', 'Dubai, UAE', 'published')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  drive_folder_id = EXCLUDED.drive_folder_id,
  cover_path = EXCLUDED.cover_path,
  image_count = EXCLUDED.image_count,
  short_description = EXCLUDED.short_description,
  location = EXCLUDED.location,
  status = EXCLUDED.status;
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Running migration SQL against Neon DB...");
    await client.query(schemaSql);
    console.log("Migration successful! Projects and schema seeded on Neon DB.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
