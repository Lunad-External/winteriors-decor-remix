import { queryOptions } from "@tanstack/react-query";
import {
  getSiteContentFn,
  getStorageProjectsFn,
  getProjectImagesFn,
  getProjectCmsFn,
} from "./public-data.functions";

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContentFn(),
  staleTime: 60_000,
});

export const storageProjectsQuery = queryOptions({
  queryKey: ["storage-projects"],
  queryFn: () => getStorageProjectsFn(),
  staleTime: 60_000,
});

export const projectImagesQuery = (folder: string) =>
  queryOptions({
    queryKey: ["project-images", folder],
    queryFn: () => getProjectImagesFn({ data: { folder } }),
    staleTime: 60_000,
    enabled: !!folder,
  });

export const projectCmsQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project-cms", slug],
    queryFn: () => getProjectCmsFn({ data: { slug } }),
    staleTime: 60_000,
    enabled: !!slug,
  });
