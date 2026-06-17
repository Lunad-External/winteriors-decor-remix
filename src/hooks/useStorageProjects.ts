import { useQuery } from "@tanstack/react-query";
import {
  storageProjectsQuery,
  projectImagesQuery,
} from "@/lib/public-data.queries";
import type {
  StorageProjectDTO,
  ProjectImageDTO,
} from "@/lib/public-data.functions";

export type StorageProject = StorageProjectDTO;
export type ProjectImage = ProjectImageDTO;

export const storageCategories = [
  "All",
  "Offices",
  "Retail",
  "Education",
  "Control Room",
];

export function useStorageProjects() {
  const { data, isLoading, error } = useQuery(storageProjectsQuery);
  return {
    projects: data || [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

export function useProjectImages(folder: string) {
  const { data, isLoading } = useQuery(projectImagesQuery(folder));
  return { images: data || [], loading: isLoading };
}

export function prefetchProjectCovers(_count = 8) {
  // no-op on server; client cover prefetch happens via React Query on hydration
}
