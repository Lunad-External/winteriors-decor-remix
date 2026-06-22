
INSERT INTO public.site_content (key, value, content_type, page, label) VALUES
  ('footer_company_profile_url', '/__l5e/assets-v1/27df3311-9b46-44fa-9034-8017fbc3407d/winteriors-decor-company-profile-2026.pdf', 'url', 'footer', 'Company Profile PDF URL'),
  ('footer_company_profile_label', 'Download Company Profile', 'text', 'footer', 'Company Profile Button Label'),
  ('footer_company_profile_sublabel', 'PDF • 2026 Edition', 'text', 'footer', 'Company Profile Button Sublabel'),
  ('footer_company_profile_filename', 'winteriors-decor-company-profile-2026.pdf', 'text', 'footer', 'Company Profile Filename')
ON CONFLICT (key) DO NOTHING;
