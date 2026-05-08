import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, string>;

let cachedContent: ContentMap | null = null;
let fetchPromise: Promise<ContentMap> | null = null;

async function fetchContent(): Promise<ContentMap> {
  const { data } = await supabase.from("site_content").select("key, value");
  const map: ContentMap = {};
  (data || []).forEach((row: any) => { map[row.key] = row.value; });
  return map;
}

export function useSiteContent() {
  const [content, setContent] = useState<ContentMap>(cachedContent || {});
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent) return;
    
    if (!fetchPromise) {
      fetchPromise = fetchContent();
    }

    fetchPromise.then(data => {
      cachedContent = data;
      setContent(data);
      setLoading(false);
    });
  }, []);

  const get = (key: string, fallback = ""): string => content[key] || fallback;
  const getNum = (key: string, fallback = 0): number => parseInt(content[key]) || fallback;

  return { content, get, getNum, loading };
}

// Invalidate cache (call after admin saves)
export function invalidateSiteContent() {
  cachedContent = null;
  fetchPromise = null;
}
