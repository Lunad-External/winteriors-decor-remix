
-- 1. Pin search_path and lock down pgmq wrapper functions to service_role only
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- 2. Lock down trigger-only / internal SECURITY DEFINER functions from anon/authenticated
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- 3. Remove broad SELECT policies on storage.objects for project-images.
-- The bucket is public so direct file URLs (/storage/v1/object/public/...) still work,
-- but listing the bucket contents via the API is no longer allowed for anon.
DROP POLICY IF EXISTS "Public can read project images" ON storage.objects;
DROP POLICY IF EXISTS "Public read project image files" ON storage.objects;

-- 4. Hide internal Google Drive folder IDs from public visitors.
-- Replace blanket SELECT for anon with column-level grants excluding drive_folder_id.
REVOKE SELECT ON public.projects FROM anon;
GRANT SELECT (
  id, slug, title, category, cover_path, image_count,
  created_at, updated_at, short_description, long_description,
  client_name, location, project_type, status, published_at,
  featured_image_id, author_id, deleted_at
) ON public.projects TO anon;

-- 5. Tighten the public enquiry insert policy (was WITH CHECK true).
DROP POLICY IF EXISTS "Anyone can insert enquiries" ON public.enquiries;
CREATE POLICY "Anyone can insert enquiries"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(phone) BETWEEN 3 AND 50
  AND length(message) BETWEEN 1 AND 5000
  AND (company IS NULL OR length(company) <= 200)
);
