
-- Extend projects table with CMS fields
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS featured_image_id uuid,
  ADD COLUMN IF NOT EXISTS author_id uuid,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Extend project_images with alt_text and caption
ALTER TABLE public.project_images
  ADD COLUMN IF NOT EXISTS alt_text text,
  ADD COLUMN IF NOT EXISTS caption text;

-- Add foreign key for featured_image_id
ALTER TABLE public.projects
  ADD CONSTRAINT projects_featured_image_fkey
  FOREIGN KEY (featured_image_id) REFERENCES public.project_images(id) ON DELETE SET NULL;

-- Set published_at for existing published projects
UPDATE public.projects SET published_at = created_at WHERE status = 'published' AND published_at IS NULL;
