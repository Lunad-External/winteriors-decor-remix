
-- Key-value content blocks for structured site content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  page text NOT NULL DEFAULT 'global',
  label text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read site_content" ON public.site_content
  FOR SELECT TO public USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert site_content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site_content" ON public.site_content
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site_content" ON public.site_content
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- CMS Pages for full page editing
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published cms_pages" ON public.cms_pages
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "Admins can read all cms_pages" ON public.cms_pages
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert cms_pages" ON public.cms_pages
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cms_pages" ON public.cms_pages
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cms_pages" ON public.cms_pages
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
