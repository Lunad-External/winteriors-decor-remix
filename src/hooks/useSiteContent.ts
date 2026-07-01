import { useQuery, useQueryClient } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/public-data.queries";

type ContentMap = Record<string, string>;

import { useState, useEffect } from "react";

export function useSiteContent() {
  const { data, isLoading } = useQuery(siteContentQuery);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content: ContentMap = (mounted && data) ? data : {};
  
  const get = (key: string, fallback = ""): string => {
    if (!mounted) return fallback;
    return content[key] || fallback;
  };

  const getNum = (key: string, fallback = 0): number => {
    if (!mounted) return fallback;
    return parseInt(content[key]) || fallback;
  };

  return { content, get, getNum, loading: isLoading || !mounted };
}

export function useInvalidateSiteContent() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: siteContentQuery.queryKey });
}

// Back-compat: legacy callers used a module-level invalidator. Kept as no-op
// since cache is now owned by React Query (use useInvalidateSiteContent in
// components instead).
export function invalidateSiteContent() {
  // no-op; see useInvalidateSiteContent
}
