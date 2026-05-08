-- Add SELECT policy on storage.objects so admins can find files (required for DELETE to work)
CREATE POLICY "Admins can read project images in storage"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Also add a public read policy so images are viewable by everyone (bucket is public)
CREATE POLICY "Public can read project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');