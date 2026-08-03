import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/public-data.queries";

type ContentMap = Record<string, string>;

export function useSiteContent() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const content: ContentMap = data || {};
  const get = (key: string, fallback = ""): string => content[key] || fallback;
  const getNum = (key: string, fallback = 0): number =>
    parseInt(content[key]) || fallback;
  return { content, get, getNum, loading: false };
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
