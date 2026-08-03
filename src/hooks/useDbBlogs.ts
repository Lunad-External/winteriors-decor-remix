import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  slider_images: string[] | null;
  keywords: string[] | null;
  external_url: string | null;
  published_date: string | null;
  display_order: number | null;
  is_published: boolean;
}

export function useDbBlogs() {
  const q = useQuery({
    queryKey: ["db-blogs"],
    queryFn: async (): Promise<DbBlog[]> => {
      const { data, error } = await (supabase as any)
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: false });
      if (error) throw error;
      return (data || []) as DbBlog[];
    },
    staleTime: 60_000,
  });
  return { blogs: q.data || [], loading: q.isLoading };
}

export function useDbBlog(slug: string) {
  const q = useQuery({
    queryKey: ["db-blog", slug],
    queryFn: async (): Promise<DbBlog | null> => {
      const { data, error } = await (supabase as any)
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as DbBlog) || null;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
  return { blog: q.data ?? null, loading: q.isLoading };
}
