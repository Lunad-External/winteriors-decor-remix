import { useQuery, useQueryClient } from "@tanstack/react-query";
import { siteContentQuery } from "@/lib/public-data.queries";

type ContentMap = Record<string, string>;

export function useSiteContent() {
  const { data, isLoading, isError } = useQuery(siteContentQuery);

  // Always keep SSR + client output identical
  const content: ContentMap = data ?? {};

  const get = (key: string, fallback = ""): string => {
    const value = content[key];
    return value !== undefined && value !== null ? value : fallback;
  };

  const getNum = (key: string, fallback = 0): number => {
    const value = content[key];
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  return {
    content,
    get,
    getNum,
    loading: isLoading,
    error: isError,
  };
}

export function useInvalidateSiteContent() {
  const qc = useQueryClient();

  return () =>
    qc.invalidateQueries({
      queryKey: siteContentQuery.queryKey,
    });
}

// Backward compatibility (kept safe no-op)
export function invalidateSiteContent() {
  // intentionally empty (React Query handles caching)
}