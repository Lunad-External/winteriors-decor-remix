ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS slider_images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keywords text[] NOT NULL DEFAULT '{}';