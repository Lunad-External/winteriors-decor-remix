
-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  drive_folder_id text,
  cover_path text,
  image_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
create policy "Public read projects" on public.projects for select using (true);

-- Project images table
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references public.projects(slug) on delete cascade,
  file_name text not null,
  storage_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now(),
  unique(project_slug, file_name)
);

alter table public.project_images enable row level security;
create policy "Public read project images" on public.project_images for select using (true);

-- Storage bucket for project images
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);

create policy "Public read project image files" on storage.objects for select using (bucket_id = 'project-images');
